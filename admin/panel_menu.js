

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
	
	$('[nameId="button_add_new_item_admin_panel"]').mousedown(function () { addGroupItemAdminPanel({addItems: true}); });
	
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
	
	var list = document.querySelector('[list_ui="admin_catalog"]');
	
	for(var i = 0; i < json.length; i++)
	{
		json[i] = getItemChilds({json: json[i]});		
		
		//json[i].elem.appendTo('[list_ui="admin_catalog"]');
		list.append(json[i].elem);		// добавить в конец списка
	}
	
	console.log(json);
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var json = cdm.json;
		
		if(json.id != 'group') 
		{
			var html = 
			'<div class="right_panel_1_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px">\
				<div class="right_panel_1_1_list_item_text">'
				+json.name+
				'</div>\
			</div>';
			

			// создаем из str -> html элемент
			var div = document.createElement('div');
			div.innerHTML = html;
			json.elem = div.firstChild;
			
			
			// кликнули на elem
			json.elem.onmousedown = function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); };			
		}
		else
		{			
			json.elem = addGroupItemAdminPanel({name: json.name});			
			
			var container = json.elem.querySelector('[nameid="groupItem"]');
			
			for ( var i = 0; i < json.child.length; i++ )
			{
				json.child[i] = getItemChilds({json: json.child[i]});
				
				container.append(json.child[i].elem);	// добавить в конец списка
			}			
		}
		
		return json;
	}	
}




// кликнули на треугольник в меню  группы объекты (показываем/скрываем разъемы этого объекта)
function clickAdminRtekUI_2(cdm)
{
	console.log(cdm, cdm.elem_2.style.display);
	
	var display = cdm.elem_2.style.display;
	
	var display = (display == 'none') ? 'block' : 'none';
	
	cdm.elem_2.style.display = display;
	
	var parentEl = cdm.elem_2.parentElement;	

	if(display == 'block') { parentEl.style.backgroundColor = '#ebebeb'; }
	else { parentEl.style.backgroundColor = '#ffffff'; }
	
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
	dragObject.listItems = container.querySelectorAll('[add_lotid]');

	dragObject.offsetY = e.pageY - getCoords_1({elem: elem}).top;
	dragObject.startPosY = e.pageY;
	
	console.log('previousElementSibling', elem.previousElementSibling);
	console.log('nextElementSibling', elem.nextElementSibling);
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
	
		//sortDragDropAdminMenU({elem: elem, event: cdm.event, resetOffset: true});
		
		var container = document.querySelector('[list_ui="admin_catalog"]');
		dragObject.listItems = container.querySelectorAll('[add_lotid]');
		
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		if(cdm.event) dragObject.startPosY = cdm.event.pageY;
		dragObject.downY = elem.userData.coordsY + dragObject.offsetY;			
		
		
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
	for ( var i = 0; i < dragObject.listItems.length; i++ )
	{
		var item = dragObject.listItems[i];
		
		item.userData = { coordsY: getCoords_1({elem: item}).top };
	} 
	

	var scroll = 0;
	if(cdm.event) { scroll = cdm.event.pageY - dragObject.startPosY; }	
	
	
	var prevElem = getParentElement({elem: elem, type: 'prev'});	// сосед сверху
	var nextElem = getParentElement({elem: elem, type: 'next'});	// сосед снизу
	
	//console.log('prevElem', prevElem);
	//console.log('nextElem', nextElem);
	
	// находим для elem соседа сверху и снизу
	function getParentElement(cdm)
	{
		var elem = cdm.elem;
		var item = null;
		
		if(cdm.type == 'prev') { item = elem.previousElementSibling; }
		if(cdm.type == 'next') { item = elem.nextElementSibling; }
		
		if(!item)
		{
			var parent = elem.parentElement;
			if(parent.attributes.nameid)
			{
				if(parent.attributes.nameid.value == 'groupItem')
				{
					var itemGroup = parent.parentElement;	// add_lotid = 'group'
					
					item = itemGroup;
					
					if(cdm.type == 'prev') { elem.userData.exitGroupPrev = true; }
					if(cdm.type == 'next') { elem.userData.exitGroupNext = true; }
				}				
			}
		}

		return item;
	}
	
	
	

	if(scroll < 0)	// тащим вверх
	{
		if(prevElem)
		{
			if(elem.userData.exitGroupPrev)
			{
				if(elem.userData.coordsY < prevElem.userData.coordsY)
				{
					prevElem.before(elem);
					resetElem({elem: elem});
				}				
			}
			else if(prevElem.attributes.add_lotid.value == 'group')
			{
				if(elem.userData.coordsY < prevElem.userData.coordsY + prevElem.offsetHeight)
				{
					var container = prevElem.querySelector('[nameid="groupItem"]');
					
					container.append(elem);	// добавить в конец списка
					
					resetElem({elem: elem});					
				}				
			}
			else
			{
				if(checkScrollElement({elem: elem, item: prevElem, scroll: scroll}))
				{
					prevElem.before(elem);						
					resetElem({elem: elem});
				}
			}
		}
		else
		{
			resetElem({elem: elem});
		}		
	}
	else	// тащим вниз
	{
		if(nextElem)
		{
			if(elem.userData.exitGroupNext)
			{
				if(elem.userData.coordsY + elem.offsetHeight > nextElem.userData.coordsY + nextElem.offsetHeight)
				{
					nextElem.after(elem);
					resetElem({elem: elem});
				}							
			}			
			else if(nextElem.attributes.add_lotid.value == 'group')
			{
				if(elem.userData.coordsY + elem.offsetHeight > nextElem.userData.coordsY)
				{
					var container = nextElem.querySelector('[nameid="groupItem"]');
					
					container.prepend(elem);	// добавить в начала списка
					
					resetElem({elem: elem});					
				}
			}
			else
			{
				if(checkScrollElement({elem: elem, item: nextElem, scroll: scroll}))
				{
					nextElem.after(elem);
					 
					resetElem({elem: elem});
				}
			}
		}
		else
		{
			resetElem({elem: elem});
		}
	}

	
	function checkScrollElement(cdm)
	{
		var elem = cdm.elem;
		var item = cdm.item;
		var scroll = cdm.scroll;
		
		var result = null;
		
		if(scroll < 0)	// тащим вверх
		{	
			if(elem.offsetHeight > item.offsetHeight)
			{
				if(elem.userData.coordsY < item.userData.coordsY && elem.userData.coordsY + elem.offsetHeight > item.userData.coordsY + item.offsetHeight)
				{
					result = item;
				}
			}
			if(!result)
			{
				if(elem.userData.coordsY + elem.offsetHeight > item.userData.coordsY)
				{
					if(elem.userData.coordsY + elem.offsetHeight < item.userData.coordsY + item.offsetHeight)
					{
						result = item;
					}				
				}				
			}
		}
		else	// тащим вниз
		{ 
			if(elem.offsetHeight > item.offsetHeight)
			{ 
				if(elem.userData.coordsY < item.userData.coordsY && elem.userData.coordsY + elem.offsetHeight > item.userData.coordsY + item.offsetHeight)
				{
					result = item; 
				}
			}		
			if(!result)
			{
				if(elem.userData.coordsY > item.userData.coordsY)
				{
					if(elem.userData.coordsY < item.userData.coordsY + item.offsetHeight)
					{
						result = item;
					}				
				}				
			}
		}

		return result;
	}
	
	
	// после того, как elem знаял новое место сбрасываем настройки
	function resetElem(cdm)
	{
		var elem = cdm.elem;
		
		var container = document.querySelector('[list_ui="admin_catalog"]');
		dragObject.listItems = container.querySelectorAll('[add_lotid]');
		
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		if(cdm.event) dragObject.startPosY = cdm.event.pageY;
		dragObject.downY = elem.userData.coordsY + dragObject.offsetY;		
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
	
	var json = {};
	json.name = (cdm.name) ? cdm.name : $('[nameId="input_add_group_admin_panel"]').val();
	json.id = 'group';

	var groupItem = '';

	var str_button = 
	'<div nameId="shCp_1" style="display: block; width: 10px; height: 10px; margin: auto 0;">\
		<svg height="100%" width="100%" viewBox="0 0 100 100">\
			<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
		</svg>\
	</div>';
		
	var html = 
	'<div class="right_panel_2_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px; background: rgb(235, 235, 235);">\
		<div class="flex_1 relative_1" style="margin: auto;">\
			<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+json.name+'</div>\
			'+str_button+'\
		</div>\
		<div nameId="groupItem" style="display: block;">\
			'+groupItem+'\
		</div>\
	</div>';
	
	// создаем из str -> html элемент
	var div = document.createElement('div');
	div.innerHTML = html;
	json.elem = div.firstChild;
	
	// кликнули на elem
	json.elem.onmousedown = function(e){ clickDragDrop({event: e, elem: this}); e.stopPropagation(); };


	// назначаем кнопки треугольник событие
	var el_2 = json.elem.querySelector('[nameId="shCp_1"]');
	var el_3 = json.elem.querySelector('[nameId="groupItem"]');
	
	el_2.onmousedown = function(e){ clickAdminRtekUI_2({elem: this, elem_2: el_3}); e.stopPropagation(); };


	if(cdm.addItems)
	{
		var list = document.querySelector('[list_ui="admin_catalog"]');
		
		list.prepend(json.elem);	// добавить в начала списка
	}

	return json.elem;
}






