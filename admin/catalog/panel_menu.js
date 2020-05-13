

var admin_panel = {};
admin_panel.dragItem = {};
admin_panel.user_catalog = {};
admin_panel.user_catalog.groupItem = null;
admin_panel.bd_obj = {arr:[]};





addItemAdminPanel_1();


$(document).ready(function()
{
	$('[nameId="background_admin_panel"]').mousedown(function () 
	{	 
		$('[nameId="background_admin_panel"]').css({"display":"none"}); 
	});

				
	$('[nameId="button_close_admin_panel"]').mousedown(function () 
	{  
		$('[nameId="background_admin_panel"]').css({"display":"none"}); 
	});

	$('[nameId="window_admin_panel"]').mousedown(function (e) { e.stopPropagation(); });	
	
	
	document.querySelector('[ui_2]').addEventListener( 'mousemove', function (e)
	{
		moveDragDrop({event: e});
	});	
	
	document.addEventListener( 'mouseup', function (e)
	{
		clickUpDragDrop({event: e});
	});		
	
	
	$('[nameId="button_add_group_admin_panel"]').mousedown(function () { createGroupItemAdminPanel({addItems: true}); });
	$('[nameId="button_rename_group_admin_panel"]').mousedown(function () { actRenameItemGroupAdminCatalog(); });
	
	$('[nameId="save_admin_panel"]').mousedown(function () { saveJsonAdminPanel(); });
	$('[nameId="reset_admin_panel"]').mousedown(function () { resetAdminPanel(); });
});	






// получаем объекты из BD добавляем в список объектов UI 
async function addItemAdminPanel_1(cdm) 
{
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
	
	
	var arr = [];
	
	for(var i = 0; i < json.length; i++)
	{			
		arr[i] = { lotid: json[i].id, name: json[i].name };
	}		

	var list = document.querySelector('[list_ui="admin_obj_bd"]');
	
	for(var i = 0; i < arr.length; i++)
	{
		var o = arr[i];		
		
		var elem = createItemAdminPanel({lotid: o.lotid, name: o.name, addImem: true});
		
		var el_1 = elem.querySelector('[nameId="addImem"]');
		
		(function(elem) 
		{
			el_1.onmousedown = function(e){ transitItemToCatalogAdminPanel({elem: elem}); e.stopPropagation(); };	
		}(elem));		
		
		list.append(elem);	// добавить в конец списка
		
		admin_panel.bd_obj.arr[i] = { elem: elem, lotid: o.lotid, name: o.name };
	}
	
	addItemAdminPanel_2();			// наполняем каталог 
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
	
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var json = cdm.json;
		
		if(json.id != 'group') 
		{
			json.elem = createItemAdminPanel({lotid: json.id, name: json.name, delItem: true});			
			
			// кликнули на elem
			json.elem.onmousedown = function(e)
			{ 
				clickDragDrop({event: e, elem: this}); 
				showRenameItemGroupAdminCatalog({elem: null});
				e.stopPropagation(); 
			};

	
			var el_1 = json.elem.querySelector('[nameId="delItem"]');
			el_1.onmousedown = function(e){ removeItemAdminPanel({elem: json.elem}); e.stopPropagation(); };			
		}
		else
		{			
			json.elem = createGroupItemAdminPanel({name: json.name});			
			
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
	admin_panel.dragItem.elem = elem;
	
	var container = document.querySelector('[list_ui="admin_catalog"]');
	admin_panel.dragItem.listItems = container.querySelectorAll('[idItem]');

	admin_panel.dragItem.offsetY = e.pageY - getCoords_1({elem: elem}).top;
	admin_panel.dragItem.startPosY = e.pageY;
	
	console.log('previousElementSibling', elem.previousElementSibling);
	console.log('nextElementSibling', elem.nextElementSibling);
}


// пермещаем пункт меню (html элемент)
function moveDragDrop(cdm)
{
	var e = cdm.event;
	
	if (!admin_panel.dragItem.elem) return; // элемент не зажат

	var elem = admin_panel.dragItem.elem;
	
	// элемент нажат, но пока не начали его двигать
	if (!admin_panel.dragItem.move) 
	{ 
		admin_panel.dragItem.move = true;
		
		//var top = parseInt(elem.style.top, 10);
		
		// запомнить координаты, с которых начат перенос объекта
		admin_panel.dragItem.downX = e.pageX;
		admin_panel.dragItem.downY = e.pageY;	
		
		elem.style.zIndex = 9999;
		elem.style.borderColor = '#ff0000';
	}	
	
	elem.style.top = (e.pageY - admin_panel.dragItem.downY)+'px';
	//elem.style.left = (e.pageX - 0)+'px'; 
	
	sortDragDropAdminMenU({elem: elem, event: e});	
}


// закончили перетаскивать пункт меню (html элемент)
function clickUpDragDrop(cdm)
{
	if(admin_panel.dragItem.move)
	{
		var elem = admin_panel.dragItem.elem;
		
		elem.style.zIndex = '';
		elem.style.borderColor = '';
	
		//sortDragDropAdminMenU({elem: elem, event: cdm.event, resetOffset: true});
		
		var container = document.querySelector('[list_ui="admin_catalog"]');
		admin_panel.dragItem.listItems = container.querySelectorAll('[idItem]');
		
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		if(cdm.event) admin_panel.dragItem.startPosY = cdm.event.pageY;
		admin_panel.dragItem.downY = elem.userData.coordsY + admin_panel.dragItem.offsetY;			
		
		
		for ( var i = 0; i < admin_panel.dragItem.listItems.length; i++ )
		{
			var item = admin_panel.dragItem.listItems[i];
			
			item.style.borderColor = '';
		}		
		
	}
	
	admin_panel.dragItem = {};
}


// сортеруем пункты меню и правильно расставляем 
function sortDragDropAdminMenU(cdm)
{
	var elem = cdm.elem;		
	
	// создаем массив из пунктов меню и определяем их положение на странице (coordsY)	
	for ( var i = 0; i < admin_panel.dragItem.listItems.length; i++ )
	{
		var item = admin_panel.dragItem.listItems[i];
		
		item.userData = { coordsY: getCoords_1({elem: item}).top };
	} 
	

	var scroll = 0;
	if(cdm.event) { scroll = cdm.event.pageY - admin_panel.dragItem.startPosY; }	
	
	
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
					var itemGroup = parent.parentElement;	// 'group'
					
					item = itemGroup;
					
					if(cdm.type == 'prev') { elem.userData.exitGroupPrev = true; }	// группа
					if(cdm.type == 'next') { elem.userData.exitGroupNext = true; }	// группа
				}				
			}
		}

		return item;
	}
	
	
	

	if(scroll < 0)	// тащим вверх
	{
		if(prevElem)
		{
			var flag = true;
			if(prevElem.attributes.idItem.value == 'group')
			{
				if(prevElem.querySelector('[nameid="groupItem"]').style.display == 'none') { flag = false; }	// группа скрыта/сложина
			}
			
			if(elem.userData.exitGroupPrev && flag)	// группа/объект находятся внутри группы и мы вытаскиваем из группы
			{
				if(elem.userData.coordsY < prevElem.userData.coordsY)
				{
					prevElem.before(elem);
					resetElem({elem: elem});
				}				
			}
			else if(prevElem.attributes.idItem.value == 'group' && flag)	// группа
			{
				if(elem.userData.coordsY < prevElem.userData.coordsY + prevElem.offsetHeight)
				{
					var container = prevElem.querySelector('[nameid="groupItem"]');
					
					container.append(elem);	// добавить в конец списка
					
					resetElem({elem: elem});					
				}				
			}
			else	// объект
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
			var flag = true;
			if(nextElem.attributes.idItem.value == 'group')
			{
				if(nextElem.querySelector('[nameid="groupItem"]').style.display == 'none') { flag = false; }	// группа скрыта/сложина
			}			
			
			if(elem.userData.exitGroupNext && flag)	// группа/объект находятся внутри группы и мы вытаскиваем из группы
			{
				if(elem.userData.coordsY + elem.offsetHeight > nextElem.userData.coordsY + nextElem.offsetHeight)
				{
					nextElem.after(elem);
					resetElem({elem: elem});
				}							
			}			
			else if(nextElem.attributes.idItem.value == 'group' && flag)	// группа
			{
				if(elem.userData.coordsY + elem.offsetHeight > nextElem.userData.coordsY)
				{
					var container = nextElem.querySelector('[nameid="groupItem"]');
					
					container.prepend(elem);	// добавить в начала списка
					
					resetElem({elem: elem});					
				}
			}
			else	// объект
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
		admin_panel.dragItem.listItems = container.querySelectorAll('[idItem]');
		
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		if(cdm.event) admin_panel.dragItem.startPosY = cdm.event.pageY;
		admin_panel.dragItem.downY = elem.userData.coordsY + admin_panel.dragItem.offsetY;		
	}
	

}


// находим глобальное положение html элементов на странице
function getCoords_1(cdm) 
{ 
	var elem = cdm.elem;
	var box = elem.getBoundingClientRect();

	return { top: box.top + document.body.scrollTop, left: box.left + document.body.scrollLeft };
}




function showHideItemFromBdAdminPanel(cdm)
{
	var lotid = cdm.lotid;
	var arr = admin_panel.bd_obj.arr;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		if(arr[i].lotid == lotid)
		{
			arr[i].elem.style.display = cdm.display;
		}
	}
}


// создаем пункт (при старте/по кнопке)
function createItemAdminPanel(cdm)
{
	var lotid = cdm.lotid;
	var name = cdm.name;
	
	showHideItemFromBdAdminPanel({lotid: lotid, display: 'none'});
	
	var delItem = '';
	var addImem = '';
	
	if(cdm.delItem)
	{
		delItem = 
		'<div nameId="delItem" class="x_close" style="position: absolute; width: 15px; height: 15px; top: 5px; left: 10px; font-size: 25px; z-index: 1;">\
			+\
		</div>';
	}
	
	if(cdm.addImem)
	{
		addImem = 
		'<div nameId="addImem" style="position: absolute; width: 15px; height: 15px; top: 5px; left: 10px; z-index: 1;">\
			<svg height="100%" width="100%" viewBox="0 0 100 100">\
				<polygon points="0,50 100,0 100,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
			</svg>\
		</div>';		
	}
	
	var html = 
	'<div class="right_panel_1_1_list_item" idItem="'+lotid+'" style="top:0px; left:0px">\
		'+delItem+'\
		'+addImem+'\
		<div class="right_panel_1_1_list_item_text" nameId="nameItem">'
			+name+
		'</div>\
	</div>';
	

	// создаем из str -> html элемент
	var div = document.createElement('div');
	div.innerHTML = html;
	var elem = div.firstChild;

	return elem;
}



// удаляем пункт из списка админ каталога
function removeItemAdminPanel(cdm)
{
	var elem = cdm.elem;
	
	var lotid = elem.attributes.idItem.value;
	showHideItemFromBdAdminPanel({lotid: lotid, display: 'block'});
	
	elem.remove();
}


// перенести пункт из правого каталога в левый(основной для пользователей)
function transitItemToCatalogAdminPanel(cdm)
{
	var elem = cdm.elem;
	
	var container = elem.querySelector('[nameId="nameItem"]');
	var id = elem.attributes.idItem.value;
	var name = container.innerText;	
	
	showHideItemFromBdAdminPanel({lotid: elem.attributes.idItem.value, display: 'none'});
	
	var elem = createItemAdminPanel({lotid: id, name: name, delItem: true});			
	
	// кликнули на elem
	elem.onmousedown = function(e)
	{ 
		clickDragDrop({event: e, elem: this}); 
		showRenameItemGroupAdminCatalog({elem: null});
		e.stopPropagation(); 
	};

	var el_1 = elem.querySelector('[nameId="delItem"]');
	el_1.onmousedown = function(e){ removeItemAdminPanel({elem: elem}); e.stopPropagation(); };
	
	
	var list = document.querySelector('[list_ui="admin_catalog"]');	
	list.append(elem);	// добавить в конец списка	
}




// создаем группу (при старте или по кнопке)
function createGroupItemAdminPanel(cdm)
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
	'<div class="right_panel_2_1_list_item" idItem="'+json.id+'" style="top:0px; left:0px; background: rgb(235, 235, 235);">\
		<div nameId="delGroupItem" class="x_close" style="position: absolute; width: 15px; height: 15px; top: 5px; left: 10px; font-size: 25px; z-index: 1;">\
			+\
		</div>\
		<div class="flex_1 relative_1" style="margin: auto;">\
			<div class="right_panel_1_1_list_item_text" nameId="nameItem">'+json.name+'</div>\
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
	
	var el_1 = json.elem.querySelector('[nameId="nameItem"]');
	
	// кликнули на elem
	json.elem.onmousedown = function(e)
	{ 
		clickDragDrop({event: e, elem: this});
		showRenameItemGroupAdminCatalog({elem: el_1});
		e.stopPropagation(); 
	};


	// назначаем кнопки треугольник событие
	var el_2 = json.elem.querySelector('[nameId="shCp_1"]');
	var el_3 = json.elem.querySelector('[nameId="groupItem"]');
	
	el_2.onmousedown = function(e){ clickAdminRtekUI_2({elem: this, elem_2: el_3}); e.stopPropagation(); };
	
	
	var el_4 = json.elem.querySelector('[nameId="delGroupItem"]');
	el_4.onmousedown = function(e){ removeGroupItemAdminPanel({groupItem: el_3, parentElem: json.elem}); e.stopPropagation(); };


	if(cdm.addItems)
	{
		var list = document.querySelector('[list_ui="admin_catalog"]');
		
		list.prepend(json.elem);	// добавить в начала списка
	}

	return json.elem;
}



// показываем название группы (или сбрасываем, если это объект)
function showRenameItemGroupAdminCatalog(cdm)
{
	var elem = cdm.elem;
	
	admin_panel.user_catalog.groupItem = elem;
	
	var divRename = document.querySelector('[nameId="input_rename_group_admin_panel"]');
	
	if(elem)
	{
		divRename.value = elem.innerText;		
	}
	else
	{
		divRename.value = '';
	}
}


// нажали кнопку переименовываем группу
function actRenameItemGroupAdminCatalog()
{
	var elem = admin_panel.user_catalog.groupItem;
	
	if(!elem) return;
	
	var divRename = document.querySelector('[nameId="input_rename_group_admin_panel"]');
	
	elem.innerText = divRename.value;
}


// удаляем группу из списка админ каталога
function removeGroupItemAdminPanel(cdm)
{
	var groupItem = cdm.groupItem;
	var parentElem = cdm.parentElem;
	
	var arr = groupItem.querySelectorAll('[idItem]');
	
	//var container = document.querySelector('[list_ui="admin_catalog"]');
	
	for(var i = arr.length - 1; i > -1; i--)
	{
		parentElem.after(arr[i]);
	}
	
	parentElem.remove();
	
	showRenameItemGroupAdminCatalog({elem: null});
}




// сохранем структуру меню в json
function saveJsonAdminPanel()
{
	var container = document.querySelector('[list_ui="admin_catalog"]');

	
	var listItems = [];	
	for ( var i = 0; i < container.children.length; i++ )
	{
		var item = container.children[i];
		
		var value = item.attributes.idItem.value;
		
		var inf = getItemChilds({item: item});
		
		listItems[listItems.length] = inf;
	}	
	
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var inf = {};
		var item = cdm.item;
		
		var value = item.attributes.idItem.value;
		
		if(value != 'group') 
		{
			var container = item.querySelector('[nameId="nameItem"]');
			inf.id = item.attributes.idItem.value;
			inf.name = container.innerText;
			
			return inf;
		}
		
		var container = item.querySelector('[nameId="nameItem"]');
		
		inf.id = item.attributes.idItem.value;
		inf.name = container.innerText;
		inf.child = [];
			
		var container = item.querySelector('[nameId="groupItem"]');
		
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



// очищаем admin каталог
function resetAdminPanel()
{
	var list = document.querySelector('[list_ui="admin_catalog"]');
	var arrElem = list.querySelectorAll('[idItem]');
	
	for ( var i = 0; i < arrElem.length; i++ )
	{
		showHideItemFromBdAdminPanel({lotid: arrElem[i].attributes.idItem.value, display: 'block'});
	}	
	
	
	list.innerHTML = '';
}




