<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");




$sql = "SELECT id, name, size FROM list_obj";
$r = $db->prepare($sql);
$r->execute();
$res = $r->fetchAll(PDO::FETCH_ASSOC);





header('Content-Type: application/json; charset=utf-8');
echo json_encode( $res );
//die();

