param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$PublishUrl = $env:NIROGIDHARA_CODEX_PUBLISH_URL,
  [string]$CodexPackage = "@openai/codex@0.137.0"
)

$ErrorActionPreference = "Stop"

function Get-PublishEnvironmentValue {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  $value = [Environment]::GetEnvironmentVariable($Name, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) {
    $value = [Environment]::GetEnvironmentVariable($Name, "User")
  }
  if ([string]::IsNullOrWhiteSpace($value)) {
    $value = [Environment]::GetEnvironmentVariable($Name, "Machine")
  }

  return $value
}

if ([string]::IsNullOrWhiteSpace($PublishUrl)) {
  $PublishUrl = Get-PublishEnvironmentValue -Name "NIROGIDHARA_CODEX_PUBLISH_URL"
}

if ([string]::IsNullOrWhiteSpace($PublishUrl)) {
  $PublishUrl = "https://nirogidhara.com/api/automation/codex-publish"
}

$publishSecret = Get-PublishEnvironmentValue -Name "NIROGIDHARA_CODEX_PUBLISH_SECRET"
if ([string]::IsNullOrWhiteSpace($publishSecret)) {
  throw "NIROGIDHARA_CODEX_PUBLISH_SECRET is missing. Set it to the VPS CRON_SECRET in the Windows user environment."
}

$logDir = Join-Path $RepoRoot "logs\codex-daily"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logPath = Join-Path $logDir "$stamp.log"

$prompt = @"
Perform the scheduled Codex-side publishing run for Nirogidhara now.

Objective:
- Publish one new high-quality Ayurveda awareness article group to the live website without using any AI API key inside the website repo or VPS.
- Generate one English article, one Hindi adaptation, and one original SVG visual.
- POST the payload to `$env:NIROGIDHARA_CODEX_PUBLISH_URL if set, otherwise $PublishUrl.
- Authenticate with the header x-cron-secret using `$env:NIROGIDHARA_CODEX_PUBLISH_SECRET. Do not print or store the secret.
- Execute the publishing task now. Do not only acknowledge these instructions.

Rules:
- Do not modify repository source files during the daily publishing run.
- Use live web search for current, reliable, non-commercial sources. Prefer official or high-authority sources for Ayurveda context and safety.
- Avoid disease cure, diagnosis, treatment promises, guaranteed results, or unsafe medical claims.
- Pick a topic that is not already covered on https://nirogidhara.com/en/blog and https://nirogidhara.com/hi/blog.
- Keep content educational, practical, responsible, SEO-focused, and globally understandable.
- Include at least 3 sources per language payload. Sources may be English-language authoritative sources for both language versions.
- Include at least 3 FAQ entries per language.
- Use one of these topicId values: ayurveda-basics, dinacharya, ritucharya, ayurvedic-herbs, food-digestion, sleep-stress, natural-wellness, global-ayurveda.
- Use slugs that include today's date in India, for example topic-angle-YYYY-MM-DD.
- Image quality is mandatory: no visible text inside the visual, no labels, no infographic layout, no icon set, no flat vector poster, no cartoon look, and no medical diagram style.
- The image must look like a premium Ayurveda editorial/photo-style visual with real-world objects, warm light, herbs, copper, water, earth textures, and calm wellness atmosphere.
- If you cannot create a convincing premium realistic SVG from scratch, create an SVG wrapper that uses one suitable existing premium Nirogidhara image from /media as the main visual and adds only subtle no-text treatment.

Payload shape to POST as JSON:
{
  "translationGroup": "codex-YYYY-MM-DD-short-topic",
  "image": {
    "id": "codex-YYYY-MM-DD-short-topic-image",
    "path": "/generated/codex-YYYY-MM-DD-short-topic.svg",
    "alt": "descriptive alt text",
    "caption": "short caption",
    "prompt": "visual generation rationale",
    "svg": "<svg ...>...</svg>"
  },
  "posts": [
    {
      "locale": "en",
      "slug": "english-slug-YYYY-MM-DD",
      "title": "English title",
      "metaTitle": "SEO title under 150 chars",
      "metaDescription": "SEO description under 180 chars",
      "excerpt": "short excerpt",
      "content": "Markdown article, minimum 1500 characters",
      "faq": [{"question":"...","answer":"..."}],
      "topicId": "one allowed topicId",
      "targetKeyword": "target keyword",
      "sources": [{"name":"...","url":"https://..."}],
      "internalLinks": [{"title":"Ayurveda Basics","href":"/en/ayurveda-basics"}],
      "socialCaptions": {"linkedin":"...","instagram":"...","facebook":"...","youtube":"..."},
      "seoScore": 85
    },
    {
      "locale": "hi",
      "slug": "hindi-transliterated-slug-YYYY-MM-DD",
      "title": "Hindi title",
      "metaTitle": "Hindi SEO title under 150 chars",
      "metaDescription": "Hindi SEO description under 180 chars",
      "excerpt": "Hindi excerpt",
      "content": "Hindi Markdown article, minimum 1500 characters",
      "faq": [{"question":"...","answer":"..."}],
      "topicId": "same topicId",
      "targetKeyword": "Hindi target keyword",
      "sources": [{"name":"...","url":"https://..."}],
      "internalLinks": [{"title":"आयुर्वेद की बुनियाद","href":"/hi/ayurveda-kya-hai"}],
      "socialCaptions": {"linkedin":"...","instagram":"...","facebook":"...","youtube":"..."},
      "seoScore": 85
    }
  ]
}

Implementation:
1. Research and draft the payload.
2. Save the payload to a temporary JSON file outside gitignored source if useful.
3. POST it with PowerShell Invoke-RestMethod or curl to the publish URL.
4. Verify the response status is success.
5. Fetch the returned English and Hindi blog URLs to confirm HTTP 200 / visible publication.
6. Fetch the generated image URL, for example https://nirogidhara.com/generated/codex-YYYY-MM-DD-short-topic.svg, and confirm HTTP 200 with image/svg+xml content.
7. Fetch the English and Hindi blog indexes to confirm the new slugs are visible.
8. If and only if the articles, blog indexes, and generated image URL all verify successfully, final response must start with NIROGIDHARA_PUBLISH_SUCCESS and include the published English URL, Hindi URL, and image URL.
9. If publishing fails, the endpoint is unavailable, or the generated image URL returns a non-200 response, final response must start with NIROGIDHARA_PUBLISH_FAILED and include the reason.
"@

Push-Location $RepoRoot
$promptPath = Join-Path $logDir "$stamp.prompt.txt"
try {
  $env:NIROGIDHARA_CODEX_PUBLISH_URL = $PublishUrl
  $env:NIROGIDHARA_CODEX_PUBLISH_SECRET = $publishSecret
  Set-Content -LiteralPath $promptPath -Value $prompt -Encoding UTF8

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    Get-Content -LiteralPath $promptPath -Raw | & npx -y $CodexPackage --search -a never exec -s danger-full-access -C $RepoRoot - *> $logPath
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }

  if ($exitCode -ne 0) {
    throw "Codex daily publisher failed with exit code $exitCode. See $logPath"
  }

  $logText = Get-Content -LiteralPath $logPath -Raw -ErrorAction SilentlyContinue
  $successPattern = "(?m)^codex\r?\nNIROGIDHARA_PUBLISH_SUCCESS\b|^NIROGIDHARA_PUBLISH_SUCCESS\b"
  $failedPattern = "(?m)^codex\r?\nNIROGIDHARA_PUBLISH_FAILED\b|^NIROGIDHARA_PUBLISH_FAILED\b"
  if ($logText -notmatch $successPattern) {
    if ($logText -match $failedPattern) {
      throw "Codex daily publisher reported failure. See $logPath"
    }

    throw "Codex daily publisher did not confirm a completed publish. See $logPath"
  }
} finally {
  Remove-Item -LiteralPath $promptPath -Force -ErrorAction SilentlyContinue
  Pop-Location
}

Write-Host "Codex daily publisher completed. Log: $logPath"
