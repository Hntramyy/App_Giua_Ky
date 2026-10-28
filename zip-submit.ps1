# Usage: powershell -ExecutionPolicy Bypass -File zip-submit.ps1 -Name HoTen_MSSV_DeX
param([Parameter(Mandatory = $true)][string]$Name)

$root = $PSScriptRoot
$exclude = @('node_modules', 'android\build', 'android\app\build', 'ios\Pods', 'android\.gradle', 'android\.kotlin')
$stage = Join-Path $env:TEMP "rn_submit_$Name"
$target = Join-Path $stage 'RestaurantApp'
$zip = Join-Path (Split-Path $root -Parent) "$Name.zip"

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force $target | Out-Null

$xd = $exclude | ForEach-Object { Join-Path $root $_ }
robocopy $root $target /E /XD $xd /NFL /NDL /NJH /NJS /NP | Out-Null

if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $target -DestinationPath $zip
Remove-Item $stage -Recurse -Force
Write-Host "Created $zip"
