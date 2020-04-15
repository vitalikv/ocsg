

function coords(e)
{
    var posx = 0;
    var posy = 0;
    if (e.pageX || e.pageY)     
	{
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    
	{
        posx = e.clientX + containerF.scrollLeft + containerF.documentElement.scrollLeft;
        posy = e.clientY + containerF.scrollTop + containerF.documentElement.scrollTop;
    }

    return {x: posx, y : posy};
}


function selectionBoxDown(event) 
{ 
	if(camera == cameraTop && clickO.keys[16]){} 
	else { return false; }

	clickO.rayhit = null;
	hideMenuObjUI_2D();
	
	infProject.tools.selectionBox.msdown = true;
	infProject.tools.selectionBox.coords = coords(event);

	infProject.tools.selectionBox.mStart.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mStart.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return true;
}
 
function selectionBoxMove(event)
{
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	var x1=0;
	var x2=0;
	var y1=0;
	var y2=0;
	var mousexy = coords(event);  
	x1 = infProject.tools.selectionBox.coords.x;
	y1 = infProject.tools.selectionBox.coords.y;
	x2 = mousexy.x;
	y2 = mousexy.y;
	if (x1==x2){return;}
	if (y1==y2){return;}
	if (x1>x2){
		x1 = x1+x2;
		x2 = x1-x2;
		x1 = x1-x2;
	}
	if (y1>y2){
		y1 = y1+y2;
		y2 = y1-y2;
		y1 = y1-y2;
	}
	var sframe = document.getElementById('selectBoxFrame'); 
	sframe.style.top = y1+'px';
	sframe.style.left = x1+'px';
	sframe.style.width = x2-x1+'px';
	sframe.style.height = y2-y1+'px'; 
	sframe.style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';		
	
	return true;
}


// закончили выделение 
function selectionBoxUp(event)
{ 
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';

	infProject.tools.selectionBox.mEnd.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mEnd.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	

	getBoundSelectionBox();
	//objDeActiveColor_2D();
	
	renderCamera();
	
	return true;
}


function selectionBoxHide() 
{  
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden'; 
}	





// границы selectionBox, ищем объекты которые попали selectionBox
function getBoundSelectionBox()
{
	var pos1 = new THREE.Vector3( infProject.tools.selectionBox.mStart.x, infProject.tools.selectionBox.mStart.y, -1 ).unproject( camera ); 	
	var pos2 = new THREE.Vector3( infProject.tools.selectionBox.mEnd.x, infProject.tools.selectionBox.mEnd.y, -1 ).unproject( camera ); 		
	
	var bound = { min : {x:0,z:0}, max : {x:0,z:0} };
	
	if(pos1.x < pos2.x) { bound.min.x = pos1.x; bound.max.x = pos2.x; }
	else { bound.min.x = pos2.x; bound.max.x = pos1.x; }
	
	if(pos1.z < pos2.z) { bound.min.z = pos1.z; bound.max.z = pos2.z; }
	else { bound.min.z = pos2.z; bound.max.z = pos1.z; }


	// возращаем стандартный цвет, тем объектам которые были выделены
	clickO.obj = null;
	
	var arr = [];
	
	// объекты попавшие в область выделения
	for(var i = 0; i < infProject.scene.array.obj.length; i++)
	{
		var obj = infProject.scene.array.obj[i];

		if(bound.min.x < obj.position.x && bound.max.x > obj.position.x)
		{
			if(bound.min.z < obj.position.z && bound.max.z > obj.position.z)
			{
				arr[arr.length] = obj;
			}
		}
	}	
	
	clickO.selectBox.arr = arr;
	
	outlineAddObj({arr: arr});	
}



// кликнули, на что-то что попало в selectBox (собираем данные)
function clickWall_2D_selectBox( intersect )
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);

	var obj = intersect.object;	 
	clickO.pos.clickDown = intersect.point.clone();		// позиция от которой начнется перемещение 

	
	// проверяем клинкули ли на объект из массива selectBox  
	var flag = false;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		if(obj == arr[i]) 
		{ 
			flag = true; 
			clickO.selectBox.drag = true;
			clickO.selectBox.move = false;
			break; 
		}	
	}
	
	outlineAddObj({arr: arr});
	
	return flag;
}




// перетаскиваем объекты, которые попались SelectionBox
function moveSelectionBox(event) 
{
	if(!clickO.selectBox.move) 
	{
		clickO.selectBox.move = true;
	}	
	
	var intersect = rayIntersect( event, planeMath, 'one' );
	var pos2 = new THREE.Vector3().subVectors( intersect[0].point, clickO.pos.clickDown );		
	
	
	for ( var i = 0; i < clickO.selectBox.arr.length; i++ ){ clickO.selectBox.arr[i].position.add(pos2); }	
	
	
	clickO.pos.clickDown = intersect[0].point.clone();
}
 


// прекращаем перетаскивать SelectionBox
function upSelectionBox(cdm) 
{
	clickO.selectBox.drag = false;
	
	if(!clickO.selectBox.move) return;	
		
	clickO.selectBox.move = false;	
}




// возращаем стандартный цвет объектам
function objDeActiveColor_2D_selectBox(obj)  
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	if(obj)
	{
		for ( var i = 0; i < arr.length; i++ )
		{
			if(obj == arr[i]) { return true; }	
		}		
	}
	 

	outlineRemoveObj();
	clickO.selectBox.arr = [];
	
	return false;
}





