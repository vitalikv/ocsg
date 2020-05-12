<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");



if($_GET['select_list']) 
{
	$select_list = $_GET['select_list'];
}

if($_POST['select_list']) 
{
	$select_list = $_POST['select_list'];
}


if(!isset($select_list)) { $select_list = '*'; }


$sql = "SELECT {$select_list} FROM list_obj";
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
	
	$i++;
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );
//die();

