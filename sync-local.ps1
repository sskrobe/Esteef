# Copies the Coma Toast work from this repo to your computer:
#   - PaintShop final files  -> G:\ComaToast\PaintShop\
#   - Obsidian notes         -> <your vault>\Coma Toast\   (only if you pass -Vault)
# Run from the repo root in PowerShell, e.g.:
#   .\sync-local.ps1 -Vault "D:\Obsidian\MyVault"
param(
  [string]$Dest = "G:\ComaToast",
  [string]$Vault = ""
)
$ErrorActionPreference = "Stop"
$repo = $PSScriptRoot

git -C $repo pull --ff-only

# PaintShop: every colorway folder, the zips, and the preview page.
$src = Join-Path $repo "tshirts\paintshop\printful"
$out = Join-Path $Dest "PaintShop"
New-Item -ItemType Directory -Force -Path $out | Out-Null
robocopy $src $out /E /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed copying PaintShop ($LASTEXITCODE)" }
Copy-Item (Join-Path $repo "obsidian\Coma Toast\Shirts\PaintShop.md") (Join-Path $out "PaintShop.md") -Force
Write-Host "PaintShop files copied to $out"

if ($Vault) {
  $notes = Join-Path $Vault "Coma Toast"
  New-Item -ItemType Directory -Force -Path $notes | Out-Null
  robocopy (Join-Path $repo "obsidian\Coma Toast") $notes /E /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy failed copying notes ($LASTEXITCODE)" }
  Write-Host "Obsidian notes copied to $notes"
}
