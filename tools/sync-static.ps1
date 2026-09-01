$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$buildRoot = (Resolve-Path -LiteralPath (Join-Path $repoRoot "source\dist\client")).Path
$generatedDirectories = @("_next", ".vite", "about", "files", "images", "media")
$generatedFiles = @("favicon.svg", "index.html", "vinext-client-entry-manifest.json")

foreach ($name in $generatedDirectories) {
    $target = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $name))
    if (-not $target.StartsWith($repoRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Unsafe generated directory: $target"
    }
    if (Test-Path -LiteralPath $target) {
        Remove-Item -LiteralPath $target -Recurse -Force
    }
    Copy-Item -LiteralPath (Join-Path $buildRoot $name) -Destination $repoRoot -Recurse -Force
}

foreach ($name in $generatedFiles) {
    Copy-Item -LiteralPath (Join-Path $buildRoot $name) -Destination (Join-Path $repoRoot $name) -Force
}

Write-Output "GitHub Pages static output synchronized."
