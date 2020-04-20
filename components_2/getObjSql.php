<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");




$id = trim($_GET['id']);
$id = addslashes($id);
if(!preg_match("/^[0-9]+$/i", $id)) { exit; }



// находим e-mail, Имя, codepro
$sql = "SELECT * FROM list_obj WHERE id = :id";
$r = $db->prepare($sql);
$r->bindValue(':id', $id, PDO::PARAM_STR);
$r->execute();
$res = $r->fetch(PDO::FETCH_ASSOC);


$count = $r->rowCount();

$data = [];
$data['error'] = true;

if($res) 
{
	$data = [];
	$data['id'] = json_decode($res['id']);
	
	if($res['name'])
	{
		$data['name'] = json_decode($res['name']);	
	}

	if($res['type'])
	{
		$data['type'] = json_decode($res['type']);	
	}
	
	if($res['size'])
	{
		$data['size'] = json_decode($res['size']);	
	}
	
	if($res['json'])
	{
		$data['json'] = json_decode($res['json']);	
	}

	if($res['properties'])
	{
		$data['properties'] = json_decode($res['properties']);	
	}	
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );




