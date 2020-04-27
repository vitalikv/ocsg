

var dragObject = {};

addObjInCatalogUI_2();			// наполняем admin каталог объектов UI


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
	
	
});	






// добавляем объекты в каталог UI 
async function addObjInCatalogUI_2(cdm) 
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
			el.on('mousedown', function(e){ clickDragDrop({event: e}); });
		}(n));		
	}
	
}





// клинули на пункт меню (html элемент), подготовка к перемещению
function clickDragDrop(cdm) 
{
	var e = cdm.event;

	if (e.which != 1) { return; }		// если клик правой кнопкой мыши, то он не запускает перенос

	var elem = e.target;

	if (!elem) return; // не нашли, клик вне draggable-объекта

	// запомнить переносимый объект
	dragObject.elem = elem;
	var container = document.querySelector('[list_ui="admin_catalog"]');
	dragObject.listItems = container.querySelectorAll('[add_lotid]');
	
	console.log(dragObject, elem.offsetTop);
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
		
		item.userData = {offsetTop: item.offsetTop};
		
		sortList[sortList.length] = item;
		
		if(elem == item) { item.userData.id = i; }
	} 
	
	sortList.sort(function(a, b) { return a.userData.offsetTop - b.userData.offsetTop; });
	
	
	var flag = false;
	
	// определяем поменялся ли порядок html элементы в меню
	for ( var i = 0; i < sortList.length; i++ )
	{		
		if(sortList[i].userData.id != undefined) 
		{ 						
			if(sortList[i].userData.id != i)
			{				
				flag = true;
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
		
		if(cdm.event)
		{
			dragObject.downX = cdm.event.pageX;
			dragObject.downY = cdm.event.pageY;
		}		
	}
	
	if(cdm.resetOffset)
	{
		// очщаем смещение 
		elem.style.top = '0px';
		elem.style.left = '0px';			
	}
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
		inf.id = i;
		inf.name = items[i].innerText;
		
		list[list.length] = inf;
	}

	console.log(items, list);
	
	//return;
	
	
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





