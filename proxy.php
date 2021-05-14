<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
### API PROXY SERVER
### a simple proxy server to get arround CORS 
### update your config/conf.js file to point at this end point.
### NOTE: update the header: X-Api-Key: xxxxx. with a valid api key.

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"X-Api-Key: xxxxxxxxx\r\n" .
              "Content-Type: application/json\r\n"
  )
);

$action = (array_key_exists('action', $_GET)) ? $_GET['action'] : 'latest_versions';
$product = (array_key_exists('product', $_GET)) ? '&product='.$_GET['product'] : '';
$env = (array_key_exists('environment', $_GET)) ? '&environment='.$_GET['environment'] : '';
$url = 'https://a0jn8tx1cc.execute-api.us-west-2.amazonaws.com/production/deployment?action='.$action.$env.$product;

$context = stream_context_create($opts);
$file = file_get_contents($url, false, $context);
echo $file;

}else{
  echo '{"error": "GET method only"}';
}

?>
