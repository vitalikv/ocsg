

var dragObject = {};

//addGroupItemAdminPanel({name: 111});
//addGroupItemAdminPanel({name: 222});
//addGroupItemAdminPanel({name: 333});
addItemAdminPanel_2();			// наполняем admin каталог объектов UI


$(document).ready(function()
{
	
	document.querySelector('[ui_2]').addEventListener( 'mousemove', function (e)
	{
		moveDragDrop({event: e});
	});	
	
	document.addEventListener( 'mouseup', function (e)
	{
		clickUpDragDrop({event: e});
	});		
	
	
	
	$('[nameId="save_admin_panel"]').mousedown(function () { saveJsonAdminPanel(); });
	
	$('[nameId="button_add_new_item_admin_panel"]').mousedown(function () { addGroupItemAdminPanel(); });
	
});	






// добавляем объекты в каталог UI 
async function addItemAdminPanel_1(cdm) 
{
	var url = infProject.settings.api.list;
	
	var arr = [];
	
	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
	
	for(var i = 0; i < json.length; i++)
	{			
		arr[i] = { lotid: json[i].id, name: json[i].name };		
	}		

	
	for(var i = 0; i < arr.length; i++)
	{
		var o = arr[i];
		
		if(o.stopUI) continue;
		
		var str = 
		'<div class="right_panel_1_1_list_item" add_lotid="'+o.lotid+'" style="top:0px; left:0px">\
			<div class="right_panel_1_1_list_item_text">'
			+o.name+
			'</div>\
		</div>';
		
		
		var el = $(str).appendTo('[list_ui="admin_catalog"]');
		var n = o.lotid;
		(function(n) 
		{
			//el[0].userData = {id: i};
			el.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); });
		}(n));		
	}
	
}



// добавляем структурированный каталог Json 
async function addItemAdminPanel_2(cdm) 
{
	var url = 't/catalog_2.json';
	
	var arr = [];
	
	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
	
	
	for(var i = 0; i < json.length; i++)
	{
		json[i] = getItemChilds({json: json[i]});		
		
		json[i].elem.appendTo('[list_ui="admin_catalog"]');
	}
	
	console.log(json);
	
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
			
			var n = 1;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); });
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
			'<div class="right_panel_2_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px">\
				<div class="flex_1 relative_1" style="margin: auto;">\
					<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+json.name+'</div>\
					'+str_button+'\
				</div>\
				<div nameId="groupItem" style="display: block;">\
					'+groupItem+'\
				</div>\
			</div>';
			
			json.elem = $(json.html);
			
			var n = 1;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); });
			}(n));				
			
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



// клинули на пункт меню (html элемент), подготовка к перемещению
function clickDragDrop(cdm) 
{
	var e = cdm.event;

	if (e.which != 1) { return; }		// если клик правой кнопкой мыши, то он не запускает перенос

	var elem = cdm.elem;

	if (!elem) return; // не нашли, клик вне draggable-объекта

	// запомнить переносимый объект
	dragObject.elem = elem;
	var container = document.querySelector('[list_ui="admin_catalog"]');
	//dragObject.listItems = container.querySelectorAll('[add_lotid]');
	
	var listItems = [];	
	for ( var i = 0; i < container.children.length; i++ )
	{
		var item = container.children[i];
		
		listItems[listItems.length] = item;
	} 

	
	dragObject.listItems = container.querySelectorAll('[add_lotid]');
	
	var coordsY = getCoords_1({elem: elem}).top;
	//console.log(e.pageY, dragObject);

	dragObject.offsetY = e.pageY - coordsY;
	dragObject.startPosY = e.pageY;
}


// пермещаем пункт меню (html элемент)
function moveDragDrop(cdm)
{
	var e = cdm.event;
	
	if (!dragObject.elem) return; // элемент не зажат

	var elem = dragObject.elem;
	
	// элемент нажат, но пока не начали его двигать
	if (!dragObject.move) 
	{ 
		dragObject.move = true;
		
		//var top = parseInt(elem.style.top, 10);
		
		// запомнить координаты, с которых начат перенос объекта
		dragObject.downX = e.pageX;
		dragObject.downY = e.pageY;	
		
		elem.style.zIndex = 9999;
		elem.style.borderColor = '#ff0000';
	}
		//console.log(dragObject.downY);	
	
	elem.style.top = (e.pageY - dragObject.downY)+'px';
	//elem.style.left = (e.pageX - 0)+'px'; 
	
	sortDragDropAdminMenU({elem: elem, event: e});	
}


// закончили перетаскивать пункт меню (html элемент)
function clickUpDragDrop(cdm)
{
	if(dragObject.move)
	{
		var elem = dragObject.elem;
		
		elem.style.zIndex = '';
		elem.style.borderColor = '';
	
		sortDragDropAdminMenU({elem: elem, event: cdm.event, resetOffset: true});
		
		
		for ( var i = 0; i < dragObject.listItems.length; i++ )
		{
			var item = dragObject.listItems[i];
			
			item.style.borderColor = '';
		}		
		
	}
	
	dragObject = {};
}


// сортеруем пункты меню и правильно расставляем 
function sortDragDropAdminMenU(cdm)
{
	var elem = cdm.elem;		
	
	// создаем массив из пунктов меню и определяем их положение на странице (coordsY)
	var sortList = [];	
	for ( var i = 0; i < dragObject.listItems.length; i++ )
	{
		var item = dragObject.listItems[i];
		
		item.userData = {offsetHeight: item.offsetHeight, coordsY: getCoords_1({elem: item}).top};
		
		sortList[sortList.length] = item;
		
		if(elem == item) { item.userData.id = i; if(cdm.event) { item.userData.coordsY = cdm.event.pageY - dragObject.offsetY; } }
		else { item.style.borderColor = ''; }
	} 
	
	
	var elemChilds = elem.querySelectorAll('[add_lotid]');	// находим у elem подразделы, если есть
	if(!elemChilds) elemChilds = [];
	
	
	function existChilds(cdm)
	{
		var exist = false;
		var list = cdm.list;
		var elem = cdm.elem;
		
		for ( var i = 0; i < list.length; i++ )
		{
			if(elem == list[i]) { exist = true; break; }
		}
		
		return exist;
	}
	

	console.log('--------');
	//elem.userData.coordsY = cdm.event.pageY;
	var elem_2 = null;
	
	for ( var i = 0; i < dragObject.listItems.length; i++ )
	{
		var item = dragObject.listItems[i];
		
		if(elem == item) { continue; }
		
		if(existChilds({elem: item, list: elemChilds})) { continue; }
		
		//console.log(i, item, elemChilds);
		if(elem.userData.coordsY + elem.offsetHeight > item.userData.coordsY && elem.userData.coordsY < item.userData.coordsY + item.offsetHeight)
		{
			//console.log(item.attributes.add_lotid.value, elemChilds, item);
			
			if(item.attributes.add_lotid.value == 'group')
			{
				
				
				var container = item.querySelector('[nameid="groupItem"]');
								
				
				if(container != elem.parentElement)
				{
					container.append(elem);
					
					// очщаем смещение 
					elem.style.top = '0px';
					elem.style.left = '0px';	

					//dragObject.downX = cdm.event.pageX;
					dragObject.downY = elem.userData.coordsY + dragObject.offsetY;
					if(cdm.event) dragObject.startPosY = cdm.event.pageY;
					
					var container = document.querySelector('[list_ui="admin_catalog"]');
					dragObject.listItems = container.querySelectorAll('[add_lotid]');
					
					if(cdm.event) { item.style.borderColor = '#00ff00'; }
					
					//return;
				}
			}
			else
			{
				if(cdm.event) { item.style.borderColor = '#00ff00'; }
				elem_2 = item;
			}
			
			//break;
		}
	} 
	
	var scroll = 0;
	if(cdm.event) { scroll = cdm.event.pageY - dragObject.startPosY; }	
	
	if(scroll > 0) { sortList.sort(function(a, b) { return (a.userData.coordsY + a.offsetHeight) - (b.userData.coordsY + b.offsetHeight); }); }
	else { sortList.sort(function(a, b) { return a.userData.coordsY - b.userData.coordsY; }); }
	
	//console.log(scroll);
	var flag = false;
	
	// определяем поменялся ли порядок html элементы в меню
	for ( var i = 0; i < sortList.length; i++ )
	{		
		if(sortList[i].userData.id != undefined) 
		{ 						
			if(sortList[i].userData.id != i)
			{				
				flag = true;
				break;
			}
		}
	}
	
	// изменился порядок расположений html элементов
	if(flag)
	{
		
		var container = document.querySelector('[list_ui="admin_catalog"]');
		var listItems = container.querySelectorAll('[add_lotid]');		
		
		for ( var i = 0; i < listItems.length; i++ )
		{
			if(elem_2 == listItems[i]) 
			{
				//console.log(elem_2, elem);
				//elem.remove();
				if(scroll < 0) { elem_2.before(elem); }
				else { elem_2.after(elem); }
				
				break;
			}
		}
		
		
		dragObject.listItems = container.querySelectorAll('[add_lotid]');

		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		if(cdm.event) dragObject.startPosY = cdm.event.pageY;
		dragObject.downY = elem.userData.coordsY + dragObject.offsetY;
	}
	
	if(cdm.resetOffset)
	{
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';			
	}
}


// находим глобальное положение html элементов на странице
function getCoords_1(cdm) 
{ 
	var elem = cdm.elem;
	var box = elem.getBoundingClientRect();

	return { top: box.top + document.body.scrollTop, left: box.left + document.body.scrollLeft };
}



// сохранем структуру меню в json
function saveJsonAdminPanel()
{
	var container = document.querySelector('[list_ui="admin_catalog"]');

	
	var listItems = [];	
	for ( var i = 0; i < container.children.length; i++ )
	{
		var item = container.children[i];
		
		var value = item.attributes.add_lotid.value;
		
		var inf = getItemChilds({item: item});
		
		listItems[listItems.length] = inf;
	}	
	
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var inf = {};
		var item = cdm.item;
		
		var value = item.attributes.add_lotid.value;
		
		if(value != 'group') 
		{
			inf.id = item.attributes.add_lotid.value;
			inf.name = item.innerText;
			
			return inf;
		}
		
		var container = item.querySelector('[nameid="nameItem"]');
		
		inf.id = item.attributes.add_lotid.value;
		inf.name = container.innerText;
		inf.child = [];
			
		var container = item.querySelector('[nameid="groupItem"]');
		
		for ( var i = 0; i < container.children.length; i++ )
		{
			inf.child[i] = getItemChilds({item: container.children[i]});
		}
		
		return inf;
	}
	
	console.log(listItems);
	
	//return; 
	
	
	var json = JSON.stringify( listItems );
	
	
	$.ajax
	({
		url: infProject.path+'admin/savePanelJson.php',
		type: 'POST',
		data: {json: json},
		dataType: 'json',
		success: function(json) 
		{ 			
			console.log(json); 
		},
		error: function(json){ console.log(json);  }
	});			
}



function addGroupItemAdminPanel(cdm)
{	
	if(!cdm) cdm = {};
	//var button = document.querySelector('[nameId="add_new_item_admin_panel"]');
	
	var listItems = document.querySelector('[list_ui="admin_catalog"]');
	
	var inf = {};
	inf.name = (cdm.name) ? cdm.name : $('[nameId="input_add_group_admin_panel"]').val();
	inf.lotid = 'group';
	
	
	var str_button = 
	'<div nameId="shCp_1" style="display: block; width: 10px; height: 10px; margin: auto 0;">\
		<svg height="100%" width="100%" viewBox="0 0 100 100">\
			<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
		</svg>\
	</div>';
		
	var item = 
	'<div class="right_panel_2_1_list_item" add_lotid="'+inf.lotid+'" style="top:0px; left:0px">\
		<div class="flex_1 relative_1" style="margin: auto;">\
			<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+inf.name+'</div>\
			'+str_button+'\
		</div>\
		<div nameId="groupItem" style="display: block;">\
		</div>\
	</div>';
	
	
	var el = $(item).prependTo('[list_ui="admin_catalog"]');
	//listItems.appendChild(item);
	
	//el.onmousedown = function(e) { console.log(222222); }
	
	
	var n = 1;
	(function(n) 
	{
		el.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); });
	}(n));		
}






