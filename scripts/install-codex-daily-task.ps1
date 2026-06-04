param(
  [string]$TaskName = "Nirogidhara Codex Daily Publisher",
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$PublishUrl = "https://nirogidhara.com/api/automation/codex-publish",
  [string]$PublishSecret = "",
  [string]$At = "07:00"
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($PublishSecret) -and [string]::IsNullOrWhiteSpace($env:NIROGIDHARA_CODEX_PUBLISH_SECRET)) {
  $secureSecret = Read-Host "Paste VPS CRON_SECRET for Nirogidhara publish endpoint" -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)
  try {
    $PublishSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

if (-not [string]::IsNullOrWhiteSpace($PublishSecret)) {
  [Environment]::SetEnvironmentVariable("NIROGIDHARA_CODEX_PUBLISH_SECRET", $PublishSecret, "User")
  $env:NIROGIDHARA_CODEX_PUBLISH_SECRET = $PublishSecret
}

[Environment]::SetEnvironmentVariable("NIROGIDHARA_CODEX_PUBLISH_URL", $PublishUrl, "User")
$env:NIROGIDHARA_CODEX_PUBLISH_URL = $PublishUrl

if ([string]::IsNullOrWhiteSpace($env:NIROGIDHARA_CODEX_PUBLISH_SECRET)) {
  throw "Publish secret is missing. Re-run with -PublishSecret set to the same value as the VPS CRON_SECRET."
}

$runner = Join-Path $RepoRoot "scripts\codex-daily-publisher.ps1"
if (-not (Test-Path -LiteralPath $runner)) {
  throw "Runner not found: $runner"
}

$timeParts = $At.Split(":")
if ($timeParts.Count -ne 2) {
  throw "Use HH:mm format for -At, for example 07:00."
}

$runAt = [datetime]::Today.AddHours([int]$timeParts[0]).AddMinutes([int]$timeParts[1])
$actionArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$runner`" -RepoRoot `"$RepoRoot`" -PublishUrl `"$PublishUrl`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $actionArgs -WorkingDirectory $RepoRoot
$trigger = New-ScheduledTaskTrigger -Daily -At $runAt
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Hours 2)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal `
  -Description "Runs Codex at 7 AM Asia/Kolkata to publish a Nirogidhara blog post and image without website AI API keys." `
  -Force | Out-Null

Get-ScheduledTask -TaskName $TaskName | Select-Object TaskName, State
