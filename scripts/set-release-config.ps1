param(
  [Parameter(Mandatory = $true)]
  [string]$PublicUrl,

  [string]$RsvpEmail
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$indexPath = Join-Path $root "index.html"
$appPath = Join-Path $root "app.js"

$normalizedUrl = $PublicUrl.Trim()
if (-not $normalizedUrl.EndsWith("/")) {
  $normalizedUrl += "/"
}

$shareImageUrl = $normalizedUrl + "assets/share-card.jpg"
$index = Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8
$index = $index -replace '(<meta property="og:image" content=")[^"]*(" />)', "`${1}$shareImageUrl`${2}"
$index = $index -replace '(<meta name="twitter:image" content=")[^"]*(" />)', "`${1}$shareImageUrl`${2}"
$index = $index -replace '(<meta itemprop="image" content=")[^"]*(" />)', "`${1}$shareImageUrl`${2}"
$index = $index -replace '(<link rel="image_src" href=")[^"]*(" />)', "`${1}$shareImageUrl`${2}"
Set-Content -LiteralPath $indexPath -Value $index -Encoding UTF8

if ($RsvpEmail) {
  $endpoint = "https://formsubmit.co/ajax/" + $RsvpEmail.Trim()
  $app = Get-Content -LiteralPath $appPath -Raw -Encoding UTF8
  $app = $app -replace 'rsvpEndpoint: "[^"]*"', "rsvpEndpoint: `"$endpoint`""
  Set-Content -LiteralPath $appPath -Value $app -Encoding UTF8
}

Write-Host "已更新分享图片地址: $shareImageUrl"
if ($RsvpEmail) {
  Write-Host "已更新在线回执 endpoint: https://formsubmit.co/ajax/$RsvpEmail"
}
