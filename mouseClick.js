

var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';





function mouseDownRight()
{
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	var obj = clickO.move;
	
	if(obj)
	{
		if(obj.userData.tag == 'free_dw') 
		{ 
			deleteWinDoor({wd: obj, upWall: false}); 
		}		
		else if(obj.userData.tag == 'point') 
		{ 	
			if(obj.w.length == 0){ deleteOnePoint(obj); }  
			else 
			{ 
				if(obj.userData.point.type == 'continue_create_wall')
				{
					var point = obj.p[0]; 
					deleteWall_3({wall: obj.w[0]}); 
					//upLabelPlan_1([point.w[0]]);					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { deletePoint( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if(obj.userData.tag == 'obj')
		{
			deleteObjectPop({obj: obj, undoRedo: false}); 
		}		

		clickO = resetPop.clickO();
	}	
	
	clickO.move = null;	
}



function onDocumentMouseDown( event ) 
{
	//event.preventDefault();

	if (window.location.hostname == 'ocsg'){} 
	else if (window.location.hostname == 'ocsg.ru'){}
	else if (window.location.hostname == '3d-rooms.ru'){} 	
	else { return; }
 
	long_click = false;
	lastClickTime = new Date().getTime();

	if(selectionBoxDown(event)) { return; }		// selectionBox
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right'; /*middle*/ break;
		case 2: vk_click = 'right'; break;
	}


	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;

	clickSetCamera2D( event, vk_click );
	clickSetCamera3D( event, vk_click );


	if ( vk_click == 'right' ) { mouseDownRight( event ); return; } 


	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'point') 
		{			
			if(clickO.move.userData.point.type) { clickCreateWall( clickO.move ); return; }  
		}
	}
	 
	clickO.obj = null; 	
	clickO.actMove = false;	
	clickO.selectBox.drag = false;
	clickO.rayhit = clickRayHit(event); 
	
	clickMouseActive({type: 'down'});
	
	renderCamera();
}





function clickRayHit(event)
{ 
	var rayhit = null;	
				
	
	if(infProject.tools.pivot.visible)
	{
		var ray = rayIntersect( event, infProject.tools.pivot.children, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}
	
	if(infProject.tools.gizmo.visible)
	{
		var arr = [];
		for ( var i = 0; i < infProject.tools.gizmo.children.length; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
		
		var ray = rayIntersect( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}

	if(!infProject.scene.block.click.controll_wd)
	{
		var ray = rayIntersect( event, [infProject.tools.controllWD[0], infProject.tools.controllWD[1]], 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.door)
	{
		var ray = rayIntersect( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.window)
	{
		var ray = rayIntersect( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.click.wall)
	{
		var arr = [];
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{ 
			if(!infProject.scene.array.wall[i].userData.wall.show) continue;
			arr[arr.length] = infProject.scene.array.wall[i]; 
		}		
		
		var ray = rayIntersect( event, arr, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	
	if(!infProject.scene.block.click.obj)
	{
		var ray = rayIntersect( event, infProject.scene.array.obj, 'arr', true );
		
		if(ray.length > 0)
		{   	
			rayhit = null;
			
			for (var i = 0; i < ray.length; i++)
			{
				if(ray[i].object.userData.obj3D) continue;
				
				rayhit = ray[i]; console.log(i, rayhit );
				break;
			}
			
			var object = null; 
			
			if(rayhit) { object = getParentObj({obj: rayhit.object}); }
			
			if(!object) { rayhit = null; }
			else { rayhit.object = object; }
		}			
	}
	
	if(!rayhit)
	{
		var ray = rayIntersect( event, infProject.scene.array.floor, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }			
	}	
	
	
	return rayhit;
}



// находим родитель у дочернего объекта
function getParentObj(cdm)
{
	var obj = cdm.obj;	
	var next = true;
	
	while(next) 
	{
		if(obj.userData)
		{
			if(obj.userData.tag)
			{
				if(obj.userData.tag == 'obj')
				{
					next = false;
					return obj;					
				}
				else
				{
					if(obj.parent)
					{
						obj = obj.parent;
					}
					else
					{
						next = false;
						return null;
					}
				}
			}
			else if(obj.parent)
			{ 
				obj = obj.parent;
			}
			else
			{
				next = false;
				return null;
			}
			
		}
		else if(obj.parent)
		{ 
			obj = obj.parent;
		}
		else
		{
			next = false;
			return null;
		}
	}
}


function clickMouseActive(cdm)
{ 
	if(!clickO.rayhit) { hideMenuObjUI_2D(cdm); return; }

	var obj = clickO.obj = clickO.rayhit.object;
	hideMenuObjUI_2D(cdm);
	
	
	var tag = obj.userData.tag;
	var rayhit = clickO.rayhit;
	var flag = true;
	
	if(cdm.type == 'down')
	{  
		if(clickToolWD(clickO.move)) { flag = false; }
		else if( tag == 'pivot' ) { clickPivot( rayhit ); }
		else if( tag == 'gizmo' ) { clickGizmo( rayhit ); } 
		else if( tag == 'wall' && camera == cameraTop ) { clickWall_2D( rayhit ); }
		else if( tag == 'point' ) { clickPoint( rayhit ); }
		else if( tag == 'window' ) { clickWD( rayhit ); }
		else if( tag == 'door' ) { clickWD( rayhit ); }
		else if( tag == 'controll_wd' ) { clickToggleChangeWin( rayhit ); }
		else if( tag == 'obj' && camera == cameraTop ) { clickObject3D({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && camera == camera3D && infProject.tools.pivot.userData.pivot.obj == obj) { clickObject3D({obj: obj, rayhit: rayhit}); }
		else { flag = false; }
	}
	else if(cdm.type == 'up')
	{	
		if( tag == 'wall' && camera == camera3D ) { clickWall_3D({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && camera == camera3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { clickObject3D({obj: obj, rayhit: rayhit}); }
		else if( tag == 'room' && camera == cameraTop ) { clickFloor({obj: obj}); }
		else if( tag == 'room' && camera == camera3D ) { clickFloor({obj: obj}); }
		else { flag = false; }
	}	

	
	if(flag) 
	{
		if(camera == cameraTop)
		{
			objActiveColor_2D(obj);
		}		

		if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
		else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }		
		
		clickO.last_obj = obj;
		
		consoleInfo( obj );
	}
}


function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}
	
	if(selectionBoxMove(event)) { return; }		// selectionBox 
	
	if(clickO.elem) { moveElementBoxScale2D(event); }

	clickButton( event );
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	var obj = clickO.move;
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
			
		if ( tag == 'pivot' ) { movePivot( event ); }
		else if ( tag == 'gizmo' ) { moveGizmo( event ); }
		else if ( tag == 'wall' ) { moveWall( event, obj ); }
		else if ( tag == 'window' ) { moveWD( event, obj ); }
		else if ( tag == 'door' ) { moveWD( event, obj ); }
		else if ( tag == 'controll_wd' ) { moveToggleChangeWin( event, obj ); }
		else if ( tag == 'point' ) { movePoint( event, obj ); }
		else if ( tag == 'room' ) { cameraMove3D( event ); }		
		else if ( tag == 'free_dw' ) { dragWD_2( event, obj ); }
		else if ( tag == 'obj' ) { moveObjectPop( event ); }
		else if ( tag == 'obj_spot' ) { moveObjectPop( event ); }
	}
	else if(camera == cameraTop && clickO.selectBox.drag) 
	{		
		moveSelectionBox(event); 
	}	
	else 
	{
		if ( camera == camera3D ) { cameraMove3D( event ); }
		else if ( camera == cameraTop ) { moveCameraTop( event ); }
		else if ( camera == cameraWall ) { moveCameraWall2D( event ); }
	}
	
	activeHover2D( event );

	renderCamera();
}


function onDocumentMouseUp( event )  
{

	if(selectionBoxUp(event)) { return; }		// selectionBox	
	
	if(!long_click) 
	{ 
		clickMouseActive({type: 'up'}); 
	}	
	
	var obj = clickO.move;		
	
	
	if(clickO.elem)
	{
		clickUpElementBoxScale();
	}
	
	if(obj)  
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') 
		{  		
			var point = clickO.move;
			clickPointMouseUp(point); 
			if(!clickO.move.userData.point.type) { clickCreateWall(clickO.move); }						
		}
		else if(tag == 'wall') { clickWallMouseUp(obj); }
		else if(tag == 'window' || obj.userData.tag == 'door') { clickWDMouseUp(obj); }	
		else if(tag == 'controll_wd') { clickMouseUpToggleWD(obj); } 
		else if(tag == 'obj') { clickMouseUpObject(obj); }
		else if(tag == 'pivot') { clickMouseUpPivot(); }
		else if(tag == 'gizmo') { clickMouseUpGizmo(); }
		
		if(tag == 'free_dw') {  }
		else if (tag == 'point') 
		{
			if(obj.userData.point.type) {  } 
			else { clickO.move = null; }
		}		
		else { clickO.move = null; }		
	}
	else if(clickO.selectBox.drag)
	{		
		upSelectionBox();
	}	
	
	
	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	clickO.elem = null;
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	
	
	clickO.offset = new THREE.Vector3();
	
	renderCamera();
}





function hideMenuObjUI_2D(cdm)
{
	if(objDeActiveColor_2D_selectBox(clickO.obj)) { return; }
	
	var obj = clickO.last_obj;
	if(!cdm) { cdm = {type: ''}; }
	
	var flag = true;
	
	if(obj)
	{ 
		objDeActiveColor_2D(); 
		console.log(obj.userData.tag);

		var tag = obj.userData.tag;
		
		if(cdm.type == 'down')
		{
			if(tag == 'wall' && camera == cameraTop) { hideMenuUI(obj); }
			else if(tag == 'point' && camera == cameraTop) { hideMenuUI(obj); }
			else if(tag == 'window' && camera == cameraTop) { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'door' && camera == cameraTop) { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'obj' && camera == cameraTop) { hidePivotGizmo(obj); }			
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{
			if(tag == 'wall' && camera == camera3D) { hideMenuUI(obj); outlineRemoveObj(); }
			else if(tag == 'room' && camera == cameraTop) { hideMenuUI(obj); outlineRemoveObj(); }
			else if(tag == 'room' && camera == camera3D) { hideMenuUI(obj); outlineRemoveObj(); }
			else if(tag == 'obj' && camera == camera3D) { hidePivotGizmo(obj); }
			else { flag = false; }
		}
		else
		{
			if(tag == 'wall') { hideMenuUI(obj); }
			else if(tag == 'point') { hideMenuUI(obj); }
			else if(tag == 'window') { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'door') { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'room') { hideMenuUI(obj); }
			else if(tag == 'obj') { hidePivotGizmo(obj); }
			else { flag = false; }
		}
	}
	
	if(flag) clickO.last_obj = null;
}




function hideMenuUI(obj) 
{
	if(!obj) return;  console.log('hideMenuUI', obj);
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { activeObjRightPanelUI_1(); }
	else if(tag == 'point') { activeObjRightPanelUI_1(); }
	else if(tag == 'window') { activeObjRightPanelUI_1(); }
	else if(tag == 'door') { activeObjRightPanelUI_1(); }
	else if(tag == 'room') { activeObjRightPanelUI_1(); }
}




// по клику получаем инфу об объекте
function consoleInfo( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	console.log(obj.userData.tag);
	if ( tag == 'room' ) 
	{
		var txt = '';
		//for ( var i = 0; i < obj.w.length; i++ ) { txt += '| ' + obj.w[i].userData.id; }
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		console.log( "room id : " + obj.userData.id + " | point : " + txt, " | userData : ", obj.userData, obj );
	}
	else if( tag == 'wall' )
	{ 
		console.log(obj);
		console.log( "wall id : " + obj.userData.id + " index : " + clickO.index + " | point : " + obj.userData.wall.p[0].userData.id + " | " + obj.userData.wall.p[1].userData.id + " | userData : ", obj.userData ); 
	}
	else if( tag == 'point' )
	{ 
		console.log( "point id : " + obj.userData.id + " | userData : ", obj.userData, obj ); 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};		
		console.log( tag + " id : " + obj.userData.id + " | lotid : " + obj.userData.door.lotid + " | " + " type : " + obj.userData.door.type, txt, " | userData : ", obj.userData, obj ); 
	}
	else if ( tag == 'controll_wd' ) 
	{
		console.log( "controll_wd number : " + obj.userData.controll_wd.id, obj );
	}
	else if ( tag == 'obj' ) 
	{
		console.log( "obj : " + obj.userData.id + " | lotid : " + obj.lotid  + " | userData : ", obj.userData, obj );
	}		
	else 
	{
		console.log( "pr_id : " + obj.userData.id + " | lotid : " + obj.lotid + " | caption : " + obj.caption, obj );
	}	
}

