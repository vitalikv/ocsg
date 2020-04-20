
var type_browser = detectBrowser();
var newCameraPosition = null;


function updateKeyDown() 
{
	//if(docReady) if(infProject.activeInput) return;
	if(infProject.settings.blockKeyCode) return;
	var flag = false;
	
	var keys = clickO.keys;  
	if(keys.length == 0) return;
	
	if ( camera == cameraTop )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.z -= 0.1;			
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.z += 0.1;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			flag = true;
		}
	}
	else if ( camera == camera3D ) 
	{
		var kof = (camera3D.userData.camera.type == 'fly') ? 0.1 : 0.1;
		
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( -x, 0, -z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		if ( keys[ 88 ] && 1==2 ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 67 ] && 1==2 ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
	}

	if(flag) 
	{ 
		if(camera == camera3D) 
		{ 
			infProject.camera.d3.targetO.position.add( dir );
		}			
		
		newCameraPosition = null;
		renderCamera(); 
	}
}


// первоначальные настройки при страте 
function startPosCamera3D(cdm)
{
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);	
}



function cameraMove3D( event )
{ 
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			newCameraPosition = null;
			var radious = infProject.camera.d3.targetO.position.distanceTo( camera.position );
			
			var theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + infProject.camera.d3.theta;
			var phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + infProject.camera.d3.phi;
			var phi = Math.min( 180, Math.max( -60, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( infProject.camera.d3.targetO.position );  
			camera.lookAt( infProject.camera.d3.targetO.position );			
			
			infProject.camera.d3.targetO.rotation.set( 0, camera.rotation.y, 0 );
			
			wallAfterRender_2();
		}
		if ( isMouseDown3 )    
		{
			newCameraPosition = null;
			
			var intersects = rayIntersect( event, planeMath, 'one' );
			var offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera.position.add( offset );
			infProject.camera.d3.targetO.position.add( offset );
			
			wallAfterRender_2();
		}
	}
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( isMouseDown2 )
		{
			newCameraPosition = null;
			var y = ( ( event.clientX - onMouseDownPosition.x ) * 0.006 );
			var x = ( ( event.clientY - onMouseDownPosition.y ) * 0.006 );

			camera.rotation.x -= x;
			camera.rotation.y -= y;
			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;
			
			infProject.camera.d3.targetO.position.set( camera.position.x, infProject.camera.d3.targetO.position.y, camera.position.z );

			infProject.camera.d3.targetO.rotation.set( 0, camera.rotation.y, 0 );
		}
	} 		
	
}



// кликаем левой кнопокой мыши (собираем инфу для перемещения камеры в 2D режиме)
function clickSetCamera2D( event, click )
{
	if ( camera == cameraTop || camera == cameraWall) { }
	else { return; }

	isMouseDown1 = true;
	isMouseRight1 = true;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
	

	if(camera == cameraTop) 
	{
		planeMath.position.set(camera.position.x,0,camera.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		var intersects = rayIntersect( event, planeMath, 'one' );
		
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.z = intersects[0].point.z;	 		
	}
	if(camera == cameraWall) 
	{
		var dir = camera.getWorldDirection();
		dir = new THREE.Vector3().addScaledVector(dir, 10);
		planeMath.position.copy(camera.position);  
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 
		planeMath.updateMatrixWorld();

		var intersects = rayIntersect( event, planeMath, 'one' );	
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.y = intersects[0].point.y;
		onMouseDownPosition.z = intersects[0].point.z;		 		
	}	
}


// 1. кликаем левой кнопокой мыши (собираем инфу для вращения камеры в 3D режиме)
// 2. кликаем правой кнопокой мыши (собираем инфу для перемещения камеры в 3D режиме и устанавливаем мат.плоскость)
function clickSetCamera3D( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				// 1
	{
		//var dir = camera.getWorldDirection();
		var dir = new THREE.Vector3().subVectors( infProject.camera.d3.targetO.position, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    			
		
		isMouseDown2 = true;
		infProject.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		infProject.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		// 2
	{
		isMouseDown3 = true;
		planeMath.position.copy( infProject.camera.d3.targetO.position );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();

		var intersects = rayIntersect( event, planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}





function moveCameraTop( event ) 
{
	if(isMouseRight1 || isMouseDown1) {}
	else { return; }


	newCameraPosition = null;	
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;	
}


// перемещение cameraWall
function moveCameraWall2D( event )
{
	if ( !isMouseRight1 ) { return; }

	var intersects = rayIntersect( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.y += onMouseDownPosition.y - intersects[0].point.y;	
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;
	
	newCameraPosition = null;	
}


// cameraZoom
function onDocumentMouseWheel( e )
{
	
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	if(camera == cameraTop) 
	{ 
		cameraZoomTop( camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) ) ); 
	}
	else if(camera == camera3D) 
	{ 
		cameraZoom3D( delta, 1 ); 
	}
	
	setScalePivotGizmo();
	
	renderCamera();
}





var zoomLoop = '';
function cameraZoomTopLoop() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoomTop( camera.zoom - ( 0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoomTop( camera.zoom - ( -0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
	}
	else if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoom3D( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoom3D( -0.3, 0.3 ); flag = true; }
	}
	else if ( camera == cameraWall )
	{
		if ( zoomLoop == 'zoomOut' ) { camera.zoom = camera.zoom - ( 0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { camera.zoom = camera.zoom - ( -0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		camera.updateProjectionMatrix();
	}
	
	if(flag) { renderCamera(); }
}






function cameraZoomTop( delta )
{
	if(camera == cameraTop)
	{		
		camera.zoom = delta;
		camera.updateProjectionMatrix();		
	}

	
	infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
	infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
	
	// zoom label
	var k = 1 / delta;
	if(k <= infProject.settings.camera.limitZoom && 1==2) 
	{		
		// point geometry
		var point = infProject.tools.point;	
		var v = point.geometry.vertices;
		var v2 = point.userData.tool_point.v2;
			
		for ( var i = 0; i < v2.length; i++ )
		{
			v[i].x = v2[i].x * 1/delta;
			v[i].z = v2[i].z * 1/delta;
		}	

		infProject.tools.point.geometry.verticesNeedUpdate = true;
		infProject.tools.point.geometry.elementsNeedUpdate = true;


		// wd рулетки 
		for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
	}
}



function cameraZoom3D( delta, z )
{
	if ( camera != camera3D ) return;

	if(camera3D.userData.camera.type == 'fly')
	{
		var vect = ( delta < 0 ) ? z : -z;

		var pos1 = infProject.camera.d3.targetO.position;
		var pos2 = camera.position.clone();
		
		var dir = new THREE.Vector3().subVectors( pos1, camera.position ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, vect );
		dir.addScalar( 0.001 );
		var pos3 = new THREE.Vector3().addVectors( camera.position, dir );	


		var qt = quaternionDirection( new THREE.Vector3().subVectors( pos1, camera.position ).normalize() );
		var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


		var offset = new THREE.Vector3().subVectors( pos3, pos2 );
		var pos2 = new THREE.Vector3().addVectors( pos1, offset );

		var centerCam_2 = pos1.clone();
		
		if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
		
		if ( v1.z >= 0.5) 
		{ 
			infProject.camera.d3.targetO.position.copy(centerCam_2);
			camera.position.copy( pos3 ); 	
		}			
	}
	if(camera3D.userData.camera.type == 'first')
	{
		
	}
}




// центрируем камеру cameraTop
function centerCamera2D()
{
	if ( camera != cameraTop ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		//for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		//pos.divideScalar( obj_point.length );
		
		var minX = obj_point[0].position.x; 
		var maxX = obj_point[0].position.x;
		var minZ = obj_point[0].position.z; 
		var maxZ = obj_point[0].position.z;		

		for ( var i = 0; i < obj_point.length; i++ )
		{
			if(obj_point[i].position.x < minX) { minX = obj_point[i].position.x; }
			if(obj_point[i].position.x > maxX) { maxX = obj_point[i].position.x; }
			if(obj_point[i].position.z < minZ) { minZ = obj_point[i].position.z; }
			if(obj_point[i].position.z > maxZ) { maxZ = obj_point[i].position.z; }
		}				
		
		pos = new THREE.Vector3((maxX - minX)/2 + minX, 0, (maxZ - minZ)/2 + minZ);		
	}

			
	if(1==2)
	{
		newCameraPosition = {position2D: new THREE.Vector3(pos.x, cameraTop.position.y, pos.z)};
	}
	else
	{
		cameraTop.position.x = pos.x;
		cameraTop.position.z = pos.z;
		newCameraPosition = null;
	}
}


function centerCamera3D()
{
	if ( camera != camera3D ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	newCameraPosition = { position3D: new THREE.Vector3( pos.x, 0, pos.z )};

}


function moveCameraToNewPosition()
{

	if ( !newCameraPosition ) return;
	
	if ( camera == camera3D && newCameraPosition.positionFirst || camera == camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		
		if(newCameraPosition.positionFirst)
		{
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.add( newCameraPosition.positionFirst );	
			camera.lookAt( dir );
		}
		if(newCameraPosition.positionFly)
		{
			var radius_1 = camera3D.userData.camera.save.radius;
			var radius_2 = infProject.camera.d3.targetO.position.distanceTo(camera.position);
			
			var k = Math.abs((radius_2/radius_1) - 1);
			
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.x *= 15*k;
			dir.z *= 15*k;
			dir.add( infProject.camera.d3.targetO.position );	
			
			camera.lookAt( dir ); 
		}		
		
		
		if(comparePos(camera.position, pos)) 
		{ 	
			newCameraPosition = null; 
		};		
	}
	else
	{
		newCameraPosition = null;
	}
	
	renderCamera();
}





function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}


console.log( detectBrowser() );
