Add-Type -AssemblyName System.Drawing

function New-CrosshairBitmap([int]$size, [bool]$transparentBg) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $cx = $size / 2.0
    $cy = $size / 2.0

    if (-not $transparentBg) {
        # Rounded dark badge
        $pad = [Math]::Max(2.0, $size * 0.05)
        $badgeSize = $size - (2 * $pad)
        $radius = $badgeSize * 0.22

        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $rect = New-Object System.Drawing.RectangleF($pad, $pad, $badgeSize, $badgeSize)
        $d = $radius * 2

        $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
        $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
        $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
        $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
        $path.CloseFigure()

        # Background gradient
        $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.PointF(0, 0)),
            (New-Object System.Drawing.PointF(0, $size)),
            [System.Drawing.Color]::FromArgb(255, 18, 24, 38),
            [System.Drawing.Color]::FromArgb(255, 8, 11, 16)
        )
        $g.FillPath($bgBrush, $path)

        # Border
        $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 45, 60, 85), [Math]::Max(1.0, $size * 0.02))
        $g.DrawPath($borderPen, $path)

        # Subtle glow behind reticle
        $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 16, 185, 129))
        $glowSize = $size * 0.55
        $g.FillEllipse($glowBrush, ($cx - $glowSize/2), ($cy - $glowSize/2), $glowSize, $glowSize)
    }

    # Crosshair elements in electric emerald / lime (#10B981)
    $greenColor = [System.Drawing.Color]::FromArgb(255, 16, 185, 129)
    $accentPen = New-Object System.Drawing.Pen($greenColor, [Math]::Max(1.5, $size * 0.055))
    $accentPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $accentPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $accentBrush = New-Object System.Drawing.SolidBrush($greenColor)

    # Tactical Ring
    $ringRadius = $size * 0.22
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 16, 185, 129), [Math]::Max(1.2, $size * 0.035))
    $g.DrawEllipse($ringPen, ($cx - $ringRadius), ($cy - $ringRadius), ($ringRadius * 2), ($ringRadius * 2))

    # Crosshair arms (with gap)
    $gap = $size * 0.09
    $armLen = $size * 0.22

    # Top arm
    $g.DrawLine($accentPen, $cx, ($cy - $gap), $cx, ($cy - $gap - $armLen))
    # Bottom arm
    $g.DrawLine($accentPen, $cx, ($cy + $gap), $cx, ($cy + $gap + $armLen))
    # Left arm
    $g.DrawLine($accentPen, ($cx - $gap), $cy, ($cx - $gap - $armLen), $cy)
    # Right arm
    $g.DrawLine($accentPen, ($cx + $gap), $cy, ($cx + $gap + $armLen), $cy)

    # Center Dot
    $dotRadius = [Math]::Max(1.5, $size * 0.032)
    $g.FillEllipse($accentBrush, ($cx - $dotRadius), ($cy - $dotRadius), ($dotRadius * 2), ($dotRadius * 2))

    $g.Dispose()
    return $bmp
}

# Create output folders if needed
$assetsDir = "C:\Users\DELL\Projects\open-crosshair\electron\assets"
$publicDir = "C:\Users\DELL\Projects\open-crosshair\public"
if (-not (Test-Path $publicDir)) { New-Item -ItemType Directory -Path $publicDir -Force }

# 1. Generate 256x256 app icon PNG
$icon256 = New-CrosshairBitmap 256 $false
$icon256.Save("$assetsDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon256.Save("$publicDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Generate 32x32 tray icon (transparent background)
$tray32 = New-CrosshairBitmap 32 $true
$tray32.Save("$assetsDir\tray.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 3. Generate multi-resolution ICO file using binary construction
# Sizes: 256, 128, 64, 48, 32, 16
$sizes = @(256, 128, 64, 48, 32, 16)
$pngBytesList = @()

foreach ($s in $sizes) {
    $bmp = New-CrosshairBitmap $s $false
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,@($s, $ms.ToArray())
    $ms.Dispose()
    $bmp.Dispose()
}

$icoStream = New-Object System.IO.FileStream("$assetsDir\icon.ico", [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($icoStream)

# ICONDIR header: idReserved (0), idType (1 for ICO), idCount (number of images)
$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]$sizes.Count)

$offset = 6 + ($sizes.Count * 16)

# Write ICONDIRENTRY for each image
foreach ($item in $pngBytesList) {
    $s = $item[0]
    $data = $item[1]
    $w = if ($s -ge 256) { 0 } else { [byte]$s }
    $h = if ($s -ge 256) { 0 } else { [byte]$s }

    $bw.Write([byte]$w)            # bWidth
    $bw.Write([byte]$h)            # bHeight
    $bw.Write([byte]0)             # bColorCount
    $bw.Write([byte]0)             # bReserved
    $bw.Write([uint16]1)           # wPlanes
    $bw.Write([uint16]32)          # wBitCount
    $bw.Write([uint32]$data.Length)# dwBytesInRes
    $bw.Write([uint32]$offset)     # dwImageOffset

    $offset += $data.Length
}

# Write PNG data blobs
foreach ($item in $pngBytesList) {
    $bw.Write($item[1])
}

$bw.Close()
$icoStream.Close()

# Also copy icon.ico to public/favicon.ico
Copy-Item "$assetsDir\icon.ico" "$publicDir\favicon.ico" -Force

Write-Host "Icons generated successfully!"
Get-ChildItem -Path $assetsDir, $publicDir -Filter *icon* | Select-Object Name, Length, FullName
