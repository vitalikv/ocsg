<? require_once("include/bd.php");  ?>
<?php $vrs = '=31' ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>
	<meta name="description" content="<?=$description?>" />
	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>"> 
</head>

<body>
	<script>
		var vr = "<?=$vrs ?>";
		
		var infProject = JSON.parse('<?=$jsonPhp?>');

		console.log('type '+ vr);		
	</script>
	
			
	
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>
    <script src="<?=$path?>js/ThreeCSG.js"></script>         
	
	<script src="<?=$path?>js/dp/EffectComposer.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/CopyShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/RenderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/ShaderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/OutlinePass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/FXAAShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/DepthLimitedBlurShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/UnpackDepthRGBAShader.js?<?=$vrs?>"></script>	
	
	<script src="<?=$path?>js/loader/inflate.min.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/FBXLoader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/STLExporter.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/GLTFLoader.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>js/BufferGeometryUtils.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/export/GLTFExporter.js?<?=$vrs?>"></script>
	
	
	<? if($_SERVER['SERVER_NAME']=='ocsg') 
	{ 
		require_once("admin/catalog/admin_menu.php");
		require_once("admin/obj/adminInputLoadObj.php");
	} ?>
	
	<div id="canvasFrame" style="position: fixed; width: 100%; height: 100%; top: 0; right: 0; overflow: hidden;">
		<div class="frame block_select_text">
				
			<div class="flex_1 height100">
				
				<div style="flex-grow:1; position: relative;">
					<? require_once("include/top_1.php"); ?>
					
				</div>
				
				<? require_once("include/right_panel_1.php"); ?>
				
			</div>
		
		</div>

		<svg id="svgFrame" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute; z-index: 1">
		</svg>	

		<div id='selectBoxFrame'></div>
		
		<div id='htmlBlock' class="block_select_text"></div>
		
	</div>
	
	
	
	
	<style type="text/css">
		#selectBoxFrame
		{
			width: 0;
			height: 0;
			line-height: 0;
			background-color: #707070;
			position: absolute;
			z-index: 100;
			visibility: hidden;
			-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
			filter: alpha(opacity=40);
			opacity: .4;
		}
	</style>	
	
	<script src="<?=$path?>meshBSP.js"></script> 	
    <script src="<?=$path?>calculationArea.js?<?=$vrs?>"></script>
	<script src="<?=$path?>boxScale2D.js?<?=$vrs?>"></script>
	<script src="<?=$path?>clickObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>clickMoveGizmo.js?<?=$vrs?>"></script>
	<script src="<?=$path?>clickMovePivot.js?<?=$vrs?>"></script>
    <script src="<?=$path?>crossWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addPoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>mouseClick.js?<?=$vrs?>"></script>
	<script src="<?=$path?>changeCamera.js?<?=$vrs?>"></script>
    <script src="<?=$path?>moveCamera.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickChangeWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMovePoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>deleteObj.js?<?=$vrs?>"></script>
    <script src="<?=$path?>floor.js?<?=$vrs?>"></script>
    <script src="<?=$path?>detectZone.js?<?=$vrs?>"></script>
	<script src="<?=$path?>loadObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>substrate.js?<?=$vrs?>"></script>
	<script src="<?=$path?>svg_1.js?<?=$vrs?>"></script>
	<script src="<?=$path?>html_1.js?<?=$vrs?>"></script>
	<script src="<?=$path?>selectionBox.js?<?=$vrs?>"></script>
	<script src="<?=$path?>getScreenshot.js?<?=$vrs?>"></script>
	<script src="<?=$path?>undoRedo.js?<?=$vrs?>"></script>
	
	
	<script src="<?=$path?>hideWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>inputWall.js?<?=$vrs?>"></script>  	
	<script src="<?=$path?>clickActiveObj.js?<?=$vrs?>"></script>    
    <script src="<?=$path?>saveLoad.js?<?=$vrs?>"></script>
	<script src="<?=$path?>uiInterface.js?<?=$vrs?>"></script>
	<script src="<?=$path?>uiInterface_catalog.js?<?=$vrs?>"></script>
	<script src="<?=$path?>eventClick.js?<?=$vrs?>"></script>
    <script src="<?=$path?>script.js?<?=$vrs?>"></script>    		 
		
		
	<? if($_SERVER['SERVER_NAME']=='ocsg') 
	{?> 
		<script src="<?=$path?>admin/catalog/panel_menu.js?<?=$vrs?>"></script>
		<script src="<?=$path?>admin/obj/adminLoadObj.js?<?=$vrs?>"></script>
		<script src="<?=$path?>admin/obj/adminClickObj.js?<?=$vrs?>"></script>		
	<?}?>


</body>


</html>