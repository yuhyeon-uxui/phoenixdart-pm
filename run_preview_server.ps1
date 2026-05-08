$ErrorActionPreference = "Stop"
$log = "C:\Users\yuhyeon.an\Documents\Codex\2026-04-23-mvp-5-1-2-3-task\run_preview_server.log"
"[$([DateTime]::Now.ToString('s'))] starting" | Out-File -FilePath $log -Encoding utf8
try {
  Set-Location "C:\Users\yuhyeon.an\Documents\Codex\2026-04-23-mvp-5-1-2-3-task"
  & "C:\Users\yuhyeon.an\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "preview_server.py" 2>&1 | Tee-Object -FilePath $log -Append
}
catch {
  $_ | Out-String | Out-File -FilePath $log -Append -Encoding utf8
  throw
}
