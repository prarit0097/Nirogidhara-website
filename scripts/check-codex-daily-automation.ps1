param(
  [string]$TaskName = "Nirogidhara Codex Daily Publisher",
  [string]$PublishUrl = $env:NIROGIDHARA_CODEX_PUBLISH_URL
)

$ErrorActionPreference = "Continue"

if ([string]::IsNullOrWhiteSpace($PublishUrl)) {
  $PublishUrl = "https://nirogidhara.com/api/automation/codex-publish"
}

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
$taskInfo = if ($task) { Get-ScheduledTaskInfo -TaskName $TaskName -ErrorAction SilentlyContinue } else { $null }
$secretConfigured = -not [string]::IsNullOrWhiteSpace($env:NIROGIDHARA_CODEX_PUBLISH_SECRET)

$endpoint = $null
try {
  $endpoint = Invoke-RestMethod -Uri $PublishUrl -Method Get -TimeoutSec 20
} catch {
  $endpoint = @{ ok = $false; error = $_.Exception.Message }
}

$codexVersion = $null
try {
  $codexVersion = (& npx -y "@openai/codex@0.137.0" --version 2>$null)
} catch {
  $codexVersion = "unavailable"
}

[pscustomobject]@{
  TaskName = $TaskName
  TaskInstalled = [bool]$task
  TaskState = if ($task) { $task.State } else { "Missing" }
  LastRunTime = if ($taskInfo) { $taskInfo.LastRunTime } else { $null }
  LastTaskResult = if ($taskInfo) { $taskInfo.LastTaskResult } else { $null }
  SecretConfigured = $secretConfigured
  PublishUrl = $PublishUrl
  EndpointOk = [bool]$endpoint.ok
  EndpointSchedule = $endpoint.schedule
  CodexCli = $codexVersion
}
