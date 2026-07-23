<?php
// test.php
$scriptURL = 'https://script.google.com/macros/s/AKfycbwx2RMJRvxPuCV4m4M6sVakws3OlVgIJnEHA67Jqtzw7n8h15BLN8b_uAWemhuJOalZ/exec';

$data = ['action' => 'getMessages'];

$ch = curl_init($scriptURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n";
?>