

    


// переключение камеры
function changeCamera(cam)
{  
	deActiveSelected();
	
	camera = cam;
	renderPass.camera = cam;
	outlinePass.renderCamera = cam;
	if(saoPass) saoPass.camera = cam;
	outlineRemoveObj();
	
	if(camera == cameraTop)
	{				
		infProject.camera.d3.targetO.visible = false;
		blockActiveObj({visible_1: false, visible_2: false});
		
		changeDepthColor();			
		cameraZoomTop( camera.zoom );

		showAllWallRender();	// показываем стены, которые были спрятаны
		
		changeRightMenuUI_1({current: true});
	}
	else if(camera == camera3D)
	{	
		infProject.camera.d3.targetO.visible = true;
		blockActiveObj({visible_1: true, visible_2: true});
				 
		cameraZoomTop( cameraTop.zoom );
		changeDepthColor();
		
		for( var i = 0; i < infProject.scene.array.cubeCam.length; i++ )
		{
			//updateCubeCam({obj: infProject.scene.array.cubeCam[i]});
		}		
		
		// прячем стены
		getInfoRenderWall();
		wallAfterRender_2();
		
		changeRightMenuUI_1({current: true});
	}
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	

	clickO = resetPop.clickO();
	
	renderCamera();
}






// меняем уровень отрисовки объектов 
function changeDepthColor()
{
	if(camera == cameraTop)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
		var visible_2 = true;
		var visible_3 = false;
	}
	else if(camera == camera3D)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
		var visible_3 = true;
	}
	else { return; } 
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	
	
	
	
	var label = [];
	for ( var i = 0; i < wall.length; i++ )
	{
		if(!wall[i].userData.wall.html.label) continue;
		
		for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
		{
			label[label.length] = wall[i].userData.wall.html.label[i2];  
		}
	}		

	if(infProject.settings.floor.label.visible)
	{
		for ( var i = 0; i < floor.length; i++ )
		{ 
			if(visible)
			{
				if(floor[i].userData.room.zone.id !== undefined)
				{
					label[label.length] = floor[i].userData.room.html.label; 
				}
			}
			else
			{
				label[label.length] = floor[i].userData.room.html.label;
			}			 
		}		
	}
	
	if(visible) { showElementHtml(label); }
	else 
	{ 
		hideElementHtml(label); 
		hideElementHtml(infProject.html.furn.size);
		hideElementHtml(infProject.html.furn.offset);		
	}

	//hideElementSvg(infProject.svg.arr);
	
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	var svg = [];
	
	for ( var i = 0; i < door.length; i++ )
	{  
		svg[svg.length] = door[i].userData.door.svg.el;
		
		if(door[i].userData.door.svg.path) { svg[svg.length] = door[i].userData.door.svg.path; }
		if(door[i].userData.door.svg.arc) { svg[svg.length] = door[i].userData.door.svg.arc; }
		
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible_3;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		svg[svg.length] = window[i].userData.door.svg.el;
		
		if(window[i].userData.door.svg.path) { svg[svg.length] = window[i].userData.door.svg.path; }
		
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible_3;		
	}
	
	if(camera == cameraTop)
	{
		showElementSvg(svg);
	}
	else if(camera == camera3D)
	{
		hideElementSvg(svg);
	}	
	
	showHideArrObj(window, visible_2);
	showHideArrObj(door, visible_2);
	
}


// скрываем/показываем объекты
function showHideArrObj(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].material.visible = visible; }				
}




// переключаем в 3D режиме полёт/вид от первого лица
function switchCamera3D(cdm)
{
	if(camera != camera3D) return;
	
	if(!cdm) { cdm = {}; }
	
	if(cdm.type)
	{
		camera3D.userData.camera.type = cdm.type;
	}
	else
	{
		if(camera3D.userData.camera.type == 'first')
		{
			camera3D.userData.camera.type = 'fly';
		}
		else
		{
			camera3D.userData.camera.type = 'first';
		}
	}

	
	var posCenter = infProject.camera.d3.targetO.position;
	
	if(camera3D.userData.camera.type == 'first')
	{		
		camera3D.userData.camera.save.pos = camera3D.position.clone();
		camera3D.userData.camera.save.radius = posCenter.distanceTo(camera.position);
		 
		camera3D.userData.camera.dist = posCenter.distanceTo(camera.position);
		camera3D.userData.camera.type = 'first';		
		
		newCameraPosition = { positionFirst: new THREE.Vector3(posCenter.x, 1.5, posCenter.z) };

		// показываем стены, которые были спрятаны
		showAllWallRender();	
	}
	else
	{
		var radius = camera3D.userData.camera.save.radius;
		var pos = new THREE.Vector3();		
		
		var radH = Math.acos(camera3D.userData.camera.save.pos.y/radius);
		
		camera3D.updateMatrixWorld();
		var dir = camera3D.getWorldDirection(new THREE.Vector3());
		dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
		
		var radXZ = Math.atan2(dir.z, dir.x);		
	
		pos.x = -radius * Math.sin(radH) * Math.cos(radXZ) + posCenter.x; 
		pos.z = -radius * Math.sin(radH) * Math.sin(radXZ) + posCenter.z;
		pos.y = radius * Math.cos(radH);					
		
		newCameraPosition = { positionFly: pos };

		// прячем стены
		getInfoRenderWall();
		wallAfterRender_2();		 
	}
}






// блокируем/разблокируем объекты
function blockActiveObj(cdm)
{
	var visible_1 = cdm.visible_1;
	var visible_2 = cdm.visible_2;
	
	//infProject.scene.block.click.wall = visible_1;
	//infProject.scene.block.hover.wall = visible_1;

	infProject.scene.block.click.point = visible_1;
	infProject.scene.block.hover.point = visible_1;

	infProject.scene.block.click.window = visible_1;
	infProject.scene.block.hover.window = visible_1;

	infProject.scene.block.click.door = visible_1;
	infProject.scene.block.hover.door = visible_1;

	infProject.scene.block.click.room = visible_1;
	infProject.scene.block.hover.room = visible_1;

	infProject.scene.block.click.controll_wd = visible_1;
	infProject.scene.block.hover.controll_wd = visible_1;	
}





