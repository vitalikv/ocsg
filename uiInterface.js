




// добавляем текстыры в каталог UI 
function addTextureInCatalogUI_1(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_1"]').append(str);
	}	
}

function addTextureInCatalogUI_2(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_2"]').append(str);
	}	
}

// показываем/скрываем кнопки/список текстур для стен
function showHideMenuTexture_1(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_1"]').hide(); 
		$('[nameId="rp_block_wall_texture_1"]').show(); 		
	}
	else
	{
		$('[nameId="rp_catalog_texture_1"]').show(); 
		$('[nameId="rp_block_wall_texture_1"]').hide(); 		
	}
}





// переключаем вкладки правой панели 
function changeRightMenuUI_1(cdm)
{
	$('[nameId="wrap_catalog"]').hide();
	$('[nameId="wrap_object"]').hide();
	$('[nameId="wrap_plan"]').hide();
	
	
	var name = '';
	//var name_2 = infProject.ui.right_menu.active;
	
	if(cdm.el) { name = cdm.el.attributes.nameId.value; }
	else if(cdm.name) { name = cdm.name; }
	else if(cdm.current) { name = infProject.ui.right_menu.active; }
	
	
	
	if(name == "button_wrap_catalog") 
	{
		$('[nameId="wrap_catalog"]').show();
	}
	if(name == "button_wrap_object") 
	{
		$('[nameId="wrap_object"]').show(); 
	}
	if(name == "button_wrap_plan") 
	{
		$('[nameId="wrap_plan"]').show();
	}

	infProject.ui.right_menu.active = name;
}


// кликнули на obj, wd (показываем нужное меню и заполняем input)
function activeObjRightPanelUI_1(cdm) 
{
	$('[nameId="wrap_object_1"]').hide();
	
	$('[nameId="rp_bl_light"]').hide();
	$('[nameId="bl_object_3d"]').hide();
	$('[nameId="rp_menu_wall"]').hide();
	$('[nameId="rp_menu_point"]').hide();
	$('[nameId="rp_item_wd_h1"]').hide();
	$('[nameId="rp_menu_wd"]').hide();
	$('[nameId="rp_menu_room"]').hide();
	
	if(!cdm) { cdm = {}; }  
	
	var obj = cdm.obj;
	
	if(!obj) return;
	
	if(obj.userData.tag == 'point')
	{
		$('[nameId="rp_menu_point"]').show();
		$('[nameId="rp_obj_name"]').val('точка');
	}	
	else if(obj.userData.tag == 'wall')
	{
		console.log(cdm);
		if(cdm.side)
		{
			$('[nameId="rp_button_side_texture_1"]').hide();
			$('[nameId="but_back_catalog_texture_1"]').hide();
			$('[nameId="rp_catalog_texture_1"]').show();
		}
		else
		{
			$('[nameId="rp_button_side_texture_1"]').show();
			$('[nameId="but_back_catalog_texture_1"]').show();
			$('[nameId="rp_catalog_texture_1"]').hide();
			showHideMenuTexture_1({type: 1});
			
			changeTextureWall_UI_1({obj: obj});			

			if(obj.userData.wall.html.label)
			{
				obj.userData.wall.html.label[0].textContent = 'A';
				obj.userData.wall.html.label[1].textContent = 'B';
							
				upPosLabels_2({elem: obj.userData.wall.html.label[0]});
				upPosLabels_2({elem: obj.userData.wall.html.label[1]});
			}			
		}
		
		$('[nameId="rp_obj_name"]').val('стена');
		$('[nameId="rp_menu_wall"]').show();
		$('[nameId="size_wall_width_1"]').val(obj.userData.wall.width);				
	}
	else if(obj.userData.tag == 'door')
	{
		$('[nameId="rp_obj_name"]').val('дверь');
		$('[nameId="rp_menu_wd"]').show();
	}
	else if(obj.userData.tag == 'window')
	{
		$('[nameId="rp_obj_name"]').val('окно');
		$('[nameId="rp_item_wd_h1"]').show();
		$('[nameId="rp_menu_wd"]').show();
	}	
	else if(obj.userData.tag == 'obj')
	{
		if(obj.userData.obj3D.type == "light point")
		{
			$('[nameId="rp_bl_light"]').show();
			sliderSunIntensity({value: obj.children[1].intensity});			
		}
		
		$('[nameId="rp_obj_name"]').val(obj.userData.obj3D.nameRus);		
		$('[nameId="bl_object_3d"]').show();
		
		if( isCheckExsistFunction(window['getInfObjFromBD']) ) { getInfObjFromBD({obj: obj}); };
	}	
	else if(obj.userData.tag == 'room')
	{
		$('[nameId="rp_menu_room"]').show();
		
		$('[nameId="rp_obj_name"]').val('пол');
	}		

	$('[nameId="wrap_object_1"]').show(); 	
	
}





// устанавливаем значения в input для вкладки план (окно/дверь/толщина стены/высота этажа)
function startRightPlaneInput(cdm)
{
	
	$('[nameId="rp_wall_width_1"]').val(infProject.settings.wall.width);
	
	$('[nameId="rp_door_length_1"]').val(infProject.settings.door.width);
	$('[nameId="rp_door_height_1"]').val(infProject.settings.door.height);
	
	$('[nameId="rp_wind_length_1"]').val(infProject.settings.wind.width);
	$('[nameId="rp_wind_height_1"]').val(infProject.settings.wind.height);
	$('[nameId="rp_wind_above_floor_1"]').val(infProject.settings.wind.h1);
	
	$('[nameId="rp_floor_height"]').val(infProject.settings.height);
}


// после изменения input для плана (окно/дверь/толщина стены/высота этажа)
function upRightPlaneInput_1(cdm) 
{
	var el = cdm.el;
	var value = el.val();
	
	var inf = null;
	if(cdm.el[0] == $('[nameId="rp_wall_width_1"]')[0]) { var inf = { json: infProject.settings.wall, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_length_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_height_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'height' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_length_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_height_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'height' }; }	
	else if(cdm.el[0] == $('[nameId="rp_wind_above_floor_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'h1' }; }	
	else { return; }	
	
	var res = checkNumberInput({ value: value, unit: 1, limit: {min: 0.01, max: 5} });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num; 
}



// показываем текстыру у стены в правой панели
function changeTextureWall_UI_1(cdm) 
{
	$('[nameId="wall_texture_1img"]').attr('src', cdm.obj.userData.material[1].img);  
	$('[nameId="wall_texture_2img"]').attr('src', cdm.obj.userData.material[2].img);
}






// назначаем всем построеннным комнатам тип помещения
function assignListRoomTypesApi(cdm)
{
	var arr = cdm.arr;
	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < floor.length; i2++ )
		{
			if(arr[i].id !== floor[i2].userData.id) continue;
			
			if(arr[i].zone == undefined){ arr[i].zone = -1; };
			
			floor[i].userData.room.zone.id = arr[i].zone;
			
			if(infProject.settings.floor.label.visible)  
			{ 				 
				assignRoomType({id: floor[i].userData.room.zone.id, obj: floor[i]});			
			}
			
			break;
		}		
	}
	
	renderCamera();		
}



function assignRoomType(cdm)
{ 
	var type = infProject.settings.room.type;	
	
	var id = cdm.id;
	var obj = null;
	
	if(cdm.button) { obj = clickO.last_obj; }
	if(cdm.obj) { obj = cdm.obj; }
	
	var elem = obj.userData.room.html.label;
	elem.style.display = 'none';
	elem.userData.elem.show = false;
	
	
	
	if(!id) return;
	if(!obj) return;
	if(type.length == 0) return;	
	
	for(var i = 0; i < type.length; i++)
	{ 
		if(type[i].id !== id) continue;
		
		obj.userData.room.zone.id = type[i].id;
		obj.userData.room.zone.name = type[i].title;		
		
		elem.textContent = type[i].title;
		elem.style.display = 'block';
		elem.userData.elem.show = true;
		
		upPosLabels_2({elem: elem});
		
		break;
	}
	
	renderCamera();
}



