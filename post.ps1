Set-Location $PSScriptRoot
$item = Get-Item "PostPost.txt"
$content = Get-Content $item

$date = $content[0]
$title = $content[1]

Write-Host "date: $date"
Write-Host "title: $title"

$text = ""
for($i = 2; $i -lt $content.length; $i += 1) {
  $text += "$($content[$i])`n"
}


$date_seg = $date -split ' '
$date_res = "$($date_seg[2]) (o)$($date_seg[1]) $($date_seg[0])"

if($date_seg[1] -match "Jan") { $date_res = $date_res -replace "\(o\)", "(1)" }
else { if($date_seg[1] -match "Feb") { $date_res = $date_res -replace "\(o\)", "(2)" }
else { if($date_seg[1] -match "Mar") { $date_res = $date_res -replace "\(o\)", "(3)" }
else { if($date_seg[1] -match "Apr") { $date_res = $date_res -replace "\(o\)", "(4)" }
else { if($date_seg[1] -match "Mai") { $date_res = $date_res -replace "\(o\)", "(5)" }
else { if($date_seg[1] -match "Jun") { $date_res = $date_res -replace "\(o\)", "(6)" }
else { if($date_seg[1] -match "Jul") { $date_res = $date_res -replace "\(o\)", "(7)" }
else { if($date_seg[1] -match "Aug") { $date_res = $date_res -replace "\(o\)", "(8)" }
else { if($date_seg[1] -match "Sep") { $date_res = $date_res -replace "\(o\)", "(9)" }
else { if($date_seg[1] -match "Oct") { $date_res = $date_res -replace "\(o\)", "(10)" }
else { if($date_seg[1] -match "Nov") { $date_res = $date_res -replace "\(o\)", "(11)" }
else { if($date_seg[1] -match "Dec") { $date_res = $date_res -replace "\(o\)", "(12)" }
}}}}}}}}}}}

$date_res = $date_res -replace "\s", "_"

$list = Get-ChildItem "../PostStorage/posts" -Filter $date_res

$date_res += "_" + ($list.length + 1) + ".crp"

if($title.Lenght -gt 1) {
  $partition_entry = $date_res
}
else {
  $partition_entry = $date_res + "`t" + $title
}

Write-Host $partition_entry
Write-Host
Write-Host $text

$partition_entry | Out-File "../PostStorage/partitions.txt" -Encoding "ascii" -Append

$text >> "../PostStorage/posts/$date_res"

cd "../PostStorage/"
git commit -a -m "uploaded a post $date_res"
git push
