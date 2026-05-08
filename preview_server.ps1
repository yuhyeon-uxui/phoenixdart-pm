$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $root "index.html"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:4173/")
$listener.Start()

function Get-ContentType([string]$path) {
  switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".js" { return "application/javascript; charset=utf-8" }
    ".css" { return "text/css; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".svg" { return "image/svg+xml" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".ico" { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $targetPath = $indexPath
    } else {
      $candidate = Join-Path $root $requestPath
      $resolved = [System.IO.Path]::GetFullPath($candidate)
      if ($resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $resolved -PathType Leaf)) {
        $targetPath = $resolved
      } else {
        $targetPath = $indexPath
      }
    }

    $bytes = [System.IO.File]::ReadAllBytes($targetPath)
    $response = $context.Response
    $response.StatusCode = 200
    $response.ContentType = Get-ContentType $targetPath
    $response.ContentLength64 = $bytes.Length
    $response.Headers["Cache-Control"] = "no-store"
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
