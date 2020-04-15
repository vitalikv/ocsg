$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { clickInterface(); });
$('[data-action="left_panel_1"]').mousedown(function () { clickInterface(); });



$('[nameId="camera_button"]').change(function() { clickInterface({button: $( this ).val()}); });




$('[nameId="button_wrap_catalog"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_object"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_plan"]').mousedown(function () { changeRightMenuUI_1({el: this}); });

$('[nameId="sw_dw_1"]').mousedown(function () { swSetDW_1({obj: clickO.last_obj, type: 'r-l'}); }); 
$('[nameId="sw_dw_2"]').mousedown(function () { swSetDW_1({obj: clickO.last_obj, type: 't-b'}); });	

$('[nameId="obj_rotate_reset"]').mousedown(function () { objRotateReset(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { copyObj(); });
$('[nameId="button_delete_obj"]').mousedown(function () { deleteObjectPop(); });


$('[data-action="wall"]').mousedown(function () { clickInterface({button:'point_1'}); });
$('[data-action="create_wd_2"]').mousedown(function () { clickInterface({button:'create_wd_2'}); });
$('[data-action="create_wd_3"]').mousedown(function () { clickInterface({button:'create_wd_3'}); });
$('[add_lotid]').mousedown(function () { clickInterface({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[nameId="screenshot"]').mousedown(function () { createImageSvg(); createImageScene(); }); 				


$('[nameId="zoom_camera_butt_m"]').mousedown(function () { zoomLoop = 'zoomOut'; });
$('[nameId="zoom_camera_butt_p"]').mousedown(function () { zoomLoop = 'zoomIn'; });
$(window).mouseup(function () { zoomLoop = ''; });


$('[data-action="deleteObj"]').mousedown(function () { detectDeleteObj(); return false; });
$('[data-action="addPointCenterWall"]').mousedown(function () { addPointCenterWall(); return false; });



$('input').on('focus', function () { actionInputUI({el: $(this), act: 'down'}); });
$('input').on('change', function () { actionInputUI({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function actionInputUI(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		console.log(cdm.act, infProject.activeInput);
	}
	
	if(cdm.act == 'up')
	{
		actionChangeInputUI();
	}
		
}


function actionChangeInputUI(cdm)
{
	if(infProject.activeInput == 'rp_floor_height')
	{
		changeAllHeightWall_1({ height: $('[nameId="rp_floor_height"]').val(), input: true, globalHeight: true });
	}
	else if(infProject.activeInput == 'rp_wall_width_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	



// нажали кнопку применить
$('[nameId="rp_button_apply"]').mousedown(function () 
{  
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	if(obj.userData.tag == 'wall')
	{
		var width = $('[nameid="size_wall_width_1"]').val();
		
		inputWidthOneWall({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'});		
	}
	else if(obj.userData.tag == 'window')
	{
		inputWidthHeightWD(clickO.last_obj);
	}
	else if(obj.userData.tag == 'door')
	{
		inputWidthHeightWD(clickO.last_obj);
	}
	else if(obj.userData.tag == 'obj')
	{
		inputScaleObjPop({obj: clickO.last_obj});
	}	
});



// texture UI
$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	clickO.click.o = clickO.last_obj;
	showHideMenuTexture_1({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	clickO.click.o = clickO.last_obj;
	showHideMenuTexture_1({type: 2});
});

$('[nameId="rp_button_room_texture_1"]').mousedown(function () 
{ 
	clickO.click.o = clickO.last_obj; 
	showHideMenuTexture_2({type: 2}); 
});

$('[nameId="rp_button_room_texture_2"]').mousedown(function () 
{ 
	clickO.click.o = findNumberInArrRoom_2({obj: clickO.last_obj}).ceiling;
	showHideMenuTexture_2({type: 2}); 	
});


$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	showHideMenuTexture_1({type: 1});
});

$('[nameId="but_back_catalog_texture_2"]').mousedown(function () 
{ 
	showHideMenuTexture_2({type: 1});
});

$('[add_texture]').mousedown(function () 
{ 
	var inf = {obj: clickO.click.o, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true};
	if(camera == camera3D)
	{ 
		if(clickO.index) 
		{ 
			inf.obj = clickO.last_obj;
			inf.material.index = clickO.index; 
		};
	}
	
	setTexture(inf); 
}); 
// texture UI




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	clickInterface(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


//  window_main_sett --->
$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { switchLight({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { switchFxaaPass({visible: this.checked}); });
//  <--- window_main_sett


//  modal_wind_3 --->

$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	
	

$('[nameId="button_check_reg_1"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });
$('[nameId="button_check_reg_2"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });	




//  <--- modal_wind_3 




//  right_panel --->

$('[nameId="button_show_panel_catalog"]').mousedown(function () { showHideCatalogMenuUI({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { showHideCatalogMenuUI({show: false}); });


// скрываем/показываем правое меню UI
function showHideCatalogMenuUI(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}




//  <--- right_panel




// загрузка obj --->

$('#load_obj_1').change(readURL_2);

function readURL_2(e) 
{
	if (this.files[0]) 
	{		
		var reader = new FileReader();
		reader.onload = function (e) 
		{						
			loadInputFile({data: e.target.result});
		};				

		reader.readAsArrayBuffer(this.files[0]);  									
	};
};


$('[nameId="butt_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"block"}); });

$('[nameId="button_close_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"none"}); });

$('[nameId="butt_load_obj_2"]').mousedown(function () { loadUrlFile(); });
// <--- загрузка obj


});







