

var dragObject = {};

addItemAdminPanel_1();			// наполняем admin каталог объектов UI


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
			el.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); });
		}(n));		
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

	dragObject.listItems = listItems;
	
	var coordsY = getCoords_1({elem: elem}).top;
	console.log(e.pageY, coordsY, (e.pageY - coordsY));

	dragObject.offsetY = e.pageY - coordsY;
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
	
		sortDragDropAdminMenU({elem: elem, resetOffset: true});
	}
	
	dragObject = {};
}


// сортеруем пункты меню и правильно расставляем 
function sortDragDropAdminMenU(cdm)
{
	var elem = cdm.elem;		
	
	// создаем массив из пунктов меню
	var sortList = [];	
	for ( var i = 0; i < dragObject.listItems.length; i++ )
	{
		var item = dragObject.listItems[i];
		
		item.userData = {offsetTop: item.offsetTop, offsetHeight: item.offsetHeight, coordsY: getCoords_1({elem: item}).top};
		
		sortList[sortList.length] = item;
		
		if(elem == item) { item.userData.id = i; }
		else { item.style.borderColor = ''; }
	} 
	

	//elem.userData.coordsY = cdm.event.pageY;
	
	for ( var i = 0; i < dragObject.listItems.length; i++ )
	{
		var item = dragObject.listItems[i];
		
		if(elem == item) continue;
		
		
		if(elem.userData.coordsY + elem.offsetHeight > item.userData.coordsY && elem.userData.coordsY < item.userData.coordsY + item.offsetHeight)
		{
			if(cdm.event) { item.style.borderColor = '#00ff00'; }
			
			if(item.attributes.add_lotid.value == 'group')
			{
				//console.log(item);
				
				var container = item.querySelector('[nameid="groupItem"]');
				
				container.appendChild(elem);
				
				// очщаем смещение 
				elem.style.top = '0px';
				elem.style.left = '0px';	

				//dragObject.downX = cdm.event.pageX;
				dragObject.downY = elem.userData.coordsY + dragObject.offsetY;					
			}
			
		}
	} 
	
	var scroll = 0;
	if(cdm.event) { scroll = cdm.event.pageY - dragObject.downY; }	
	
	if(scroll > 0) { sortList.sort(function(a, b) { return (a.userData.coordsY + a.offsetHeight) - (b.userData.coordsY + b.offsetHeight); }); }
	else { sortList.sort(function(a, b) { return a.userData.coordsY - b.userData.coordsY; }); }
	
	
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
		var list = document.querySelector('[list_ui="admin_catalog"]');
		
		// очищаем меню от html элементов
		list.innerHTML = "";

		dragObject.listItems = [];
		
		// добавляем html элементы в меню
		for ( var i = 0; i < sortList.length; i++ )
		{
			list.appendChild(sortList[i]);
			
			dragObject.listItems[i] = sortList[i];
		}

		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';

		dragObject.downY = elem.userData.coordsY + dragObject.offsetY;
	}
	
	if(cdm.resetOffset)
	{
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';			
	}
}



function getCoords_1(cdm) 
{ 
	var elem = cdm.elem;
	var box = elem.getBoundingClientRect();

	return { top: box.top + document.body.scrollTop, left: box.left + document.body.scrollLeft };
}



function saveJsonAdminPanel()
{
	var list = [];
	var container = document.querySelector('[list_ui="admin_catalog"]');
	var items = container.querySelectorAll('[add_lotid]');
	
	// добавляем html элементы в меню
	for ( var i = 0; i < items.length; i++ )
	{
		
		var item = items[i];
		
		var inf = {};
		inf.id = item.attributes.add_lotid.value;
		inf.name = items[i].innerText;
		
		list[list.length] = inf;
	}

	console.log(items, list);
	
	return; 
	
	
	var json = JSON.stringify( list );
	
	
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



function addGroupItemAdminPanel()
{	
	//var button = document.querySelector('[nameId="add_new_item_admin_panel"]');
	
	var listItems = document.querySelector('[list_ui="admin_catalog"]');
	
	var inf = {};
	inf.name = $('[nameId="input_add_group_admin_panel"]').val();
	inf.lotid = 'group';
	
	
	var str_button = 
	'<div nameId="shCp_1" style="width: 20px; height: 20px;">\
		<div style="width: 10px; height: 10px; right: 0px;">\
			<svg height="100%" width="100%" viewBox="0 0 100 100">\
				<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
			</svg>\
		</div>\
	</div>';
		
	var item = 
	'<div class="right_panel_2_1_list_item" add_lotid="'+inf.lotid+'" style="top:0px; left:0px">\
		<div class="flex_1 relative_1" style="margin: auto;">\
			<div class="right_panel_1_1_list_item_text">'+inf.name+'</div>\
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
		el.on('mousedown', function(e){ clickDragDrop({event: e, elem: this}); });
	}(n));		
}






