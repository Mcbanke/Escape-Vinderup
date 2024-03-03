<?php
$data = $_POST['data'];

// File path for storing user data
$filePath = 'users.txt';

// Append user data to the file
file_put_contents($filePath, $data . PHP_EOL, FILE_APPEND);

echo 'User data saved successfully!';
?>
