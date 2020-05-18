<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");


$id = trim($_POST['id']);
$name = trim($_POST['name']);
$type = trim($_POST['type']);
$size = trim($_POST['size']); 
$model = trim($_POST['model']);
$properties = trim($_POST['properties']); 
$preview = trim($_POST['preview']);
//$date = date("Y-m-d-G-i");


	

if($id == 0)
{
	$sql = "INSERT INTO list_obj (name, type, size, model, properties, preview) VALUES (:name, :type, :size, :model, :properties, :preview)";

	$r = $db->prepare($sql);
	$r->bindValue(':name', $name);
	$r->bindValue(':type', $type);
	$r->bindValue(':size', $size);
	$r->bindValue(':model', $model);
	$r->bindValue(':properties', $properties);
	$r->bindValue(':preview', $preview);
	$r->execute();


	$count = $r->rowCount();

	if($count==1)
	{ 
		$inf['success'] = true;
		$inf['id'] = $db->lastInsertId(); 	
	}
}
else
{
	$sql = "UPDATE list_obj SET name=:name, type=:type, model=:model, properties=:properties, preview=:preview WHERE id = :id";
	//$sql = "UPDATE list_obj SET json = :json, size = :size, name = :name WHERE id = :id";
	$r = $db->prepare($sql);
	$r->bindValue(':id', $id);
	$r->bindValue(':name', $name);
	$r->bindValue(':type', $type);
	$r->bindValue(':model', $model);
	$r->bindValue(':properties', $properties);
	$r->bindValue(':preview', $preview);
	$f = $r->execute();

	if($f=='1'){ $inf['success'] = true; } // проверяем записались ли данные	
}

echo json_encode( $inf );

?>





