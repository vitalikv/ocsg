<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");



if($_GET['select_list']) { $select_list = $_GET['select_list']; }
if($_POST['select_list']) { $select_list = $_POST['select_list']; }
if(!isset($select_list)) { $select_list = '*'; }


if($_GET['id']) { $arrId = $_GET['id']; }
if($_POST['id']) { $arrId = $_POST['id']; }

if(isset($arrId))
{
	$strId = 'WHERE id IN (';
	
	for ($i = 0; $i < count($arrId); $i++)
	{
		if($i > 0) { $strId .= ','; }
		$strId .= $arrId[$i];
	}

	$strId .= ')';	
}





$sql = "SELECT {$select_list} FROM list_obj {$strId}";
$r = $db->prepare($sql);
$r->execute();
$res = $r->fetchAll(PDO::FETCH_ASSOC);


$data = array();
$i = 0;

foreach ($res as $text) 
{
	$data[$i]['id'] = json_decode($text['id']);
	
	if($text['name'])
	{
		$data[$i]['name'] = json_decode($text['name']);	
	}

	if($text['type'])
	{
		$data[$i]['type'] = json_decode($text['type']);	
	}	

	if($text['size'])
	{
		$data[$i]['size'] = json_decode($text['size']);	
	}
	
	if($text['model'])
	{
		$data[$i]['model'] = json_decode($text['model']);	
	}

	if($text['properties'])
	{
		$data[$i]['properties'] = json_decode($text['properties']);	
	}	

	if($text['preview'])
	{
		$data[$i]['preview'] = $text['preview'];	
	}
	
	$i++;
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );
//die();

