<? 



 
//echo '5555555555555';

$params = [];
$params['keys'] = '2';
$params['lots'] = '34';		
$params['listId'] = 11;


//header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: http://localtest.vim.myplan.pro");
header('Content-Type: application/json; charset=utf-8');
echo json_encode( $params );









