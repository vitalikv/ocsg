


// добавляем структурированный каталог Json 
async function addObjInCatalogUI_1(cdm) 
{
	var url = infProject.path+'t/catalog_2.json';
	var url = infProject.path+'components_2/getListObjSql.php';	
	
	var response = await fetch(url, 
	{
		method: 'POST',
		body: 'select_list=id, name' ,
		headers: 
		{
			'Content-Type': 'application/x-www-form-urlencoded'
		},		
		
	});
	var json = await response.json(); 
	
	
	for(var i = 0; i < json.length; i++)
	{
		if(json[i].id == 10 || json[i].id == 11) continue;
		
		json[i] = getItemChilds({json: json[i]});		
		
		json[i].elem.appendTo('[list_ui="catalog"]');
	}
		
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var json = cdm.json;
		
		if(json.id != 'group') 
		{
			json.html = 
			'<div class="right_panel_1_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px">\
				<div class="right_panel_1_1_list_item_text">'
				+json.name+
				'</div>\
			</div>';
			
			json.elem = $(json.html);

			var n = json.id;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ clickInterface({button: 'add_lotid', value: n}); e.stopPropagation(); });	
			}(n));			
		}
		else
		{
			var groupItem = '';

			var str_button = 
			'<div nameId="shCp_1" style="display: block; width: 10px; height: 10px; margin: auto 0;">\
				<svg height="100%" width="100%" viewBox="0 0 100 100">\
					<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
				</svg>\
			</div>';
				
			json.html = 
			'<div class="right_panel_1_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px;">\
				<div class="flex_1 relative_1" style="margin: auto;">\
					<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+json.name+'</div>\
					'+str_button+'\
				</div>\
				<div nameId="groupItem" style="display: none;">\
					'+groupItem+'\
				</div>\
			</div>';
			
			json.elem = $(json.html); 

			// кликаем по названию объекта
			var n = json.id;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ clickInterface({button: 'add_lotid', value: n}); e.stopPropagation(); }); 	
			}(n));

			
			// назначаем кнопки треугольник событие
			var el_2 = $(json.elem[0].querySelector('[nameId="shCp_1"]'));
			var el_3 = json.elem[0].querySelector('[nameId="groupItem"]');
			var num = 0;
			(function(num) 
			{
				el_2.on('mousedown', function(e){ clickRtekUI_2({elem: this, elem_2: el_3}); e.stopPropagation(); });	
			}(num));

			
			
			var container = json.elem[0].querySelector('[nameid="groupItem"]');
			
			for ( var i = 0; i < json.child.length; i++ )
			{
				json.child[i] = getItemChilds({json: json.child[i]});
				
				json.child[i].elem.appendTo(container);
			}			
		}
		
		return json;
	}	
}





// кликнули на треугольник в меню  группы объекты (показываем/скрываем разъемы этого объекта)
function clickRtekUI_2(cdm)
{
	console.log(cdm, cdm.elem_2.style.display);
	
	var display = cdm.elem_2.style.display;
	
	var display = (display == 'none') ? 'block' : 'none';
	
	cdm.elem_2.style.display = display;
	
	var parentEl = cdm.elem_2.parentElement;	

	if(display == 'block') { parentEl.style.backgroundColor = '#ebebeb'; }
	else { parentEl.style.backgroundColor = '#ffffff'; }
	
}









