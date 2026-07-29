param(
  [int]$Port = 8125,
  [string]$Root = "C:\Users\FIVESTAR Autopflege\Documents\Cloude Code\CPC"
)
$mime = @{
  ".html"  = "text/html; charset=utf-8"
  ".css"   = "text/css; charset=utf-8"
  ".js"    = "application/javascript; charset=utf-8"
  ".svg"   = "image/svg+xml"
  ".jpg"   = "image/jpeg"
  ".jpeg"  = "image/jpeg"
  ".png"   = "image/png"
  ".webp"  = "image/webp"
  ".woff2" = "font/woff2"
  ".xml"   = "application/xml"
  ".txt"   = "text/plain; charset=utf-8"
  ".ico"   = "image/x-icon"
  ".json"  = "application/json; charset=utf-8"
  ".mp4"   = "video/mp4"
  ".pdf"   = "application/pdf"
}
$rootFull = (Resolve-Path $Root).Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving `"$rootFull`" at http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath).TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
    $file = Join-Path $rootFull $path
    if (Test-Path $file -PathType Container) { $file = Join-Path $file "index.html" }
    $ok = (Test-Path $file -PathType Leaf)
    if ($ok) { $ok = (Resolve-Path $file).Path.StartsWith($rootFull) }
    if ($ok) {
      $bytes = [IO.File]::ReadAllBytes($file)
      $ext = [IO.Path]::GetExtension($file).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $ctx.Response.ContentLength64 = $bytes.Length
      if ($ctx.Request.HttpMethod -ne 'HEAD') {
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $ctx.Response.StatusCode = 404
    }
  } catch {
    try { $ctx.Response.StatusCode = 500 } catch {}
  } finally {
    try { $ctx.Response.Close() } catch {}
  }
}
