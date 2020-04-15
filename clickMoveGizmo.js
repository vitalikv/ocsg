

function createGizmo360_2()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.99 );
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0.01;
		n++;		
	}	

	var gizmo = new THREE.Object3D();
	gizmo.userData.gizmo = {};
	gizmo.userData.gizmo.obj = null;
	gizmo.userData.gizmo.active = { axis: '', startPos: new THREE.Vector3(), rotY: 0 };
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var cdm = {axis: 'x', pos: new THREE.Vector3(0,0.0,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
	
	var obj = new THREE.Mesh( createGeometryCircle(v), material ); 
	obj.userData.tag = 'gizmo';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);		
	gizmo.add( obj );
	
	gizmo.visible = false;
	scene.add( gizmo );
	
	return gizmo;
}	



// кликнули на gizmo
function clickGizmo( intersect )
{			
	var gizmo = infProject.tools.gizmo;
	
	clickO.move = intersect.object; 	// gizmo

	var obj = gizmo.userData.gizmo.obj;			
	var axis = intersect.object.userData.axis;
	gizmo.userData.gizmo.active.axis = axis;
	
	
	// объект
	obj.updateMatrixWorld();
	gizmo.userData.gizmo.active.startPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			

	
	if(axis == 'y')
	{
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = -Math.PI/2;
	}	
	else if(axis == 'z')
	{	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI;
	}
	else if(axis == 'x')
	{
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	planeMath.position.copy( gizmo.position );		
	
	if(camera == cameraTop)
	{
		planeMath.rotation.set(Math.PI/2, 0, 0);
	}
	else
	{
		setPlaneQ(obj, dr, rotY, false);
	}
	
	
	function setPlaneQ(obj, dr, rotY, global)
	{
		if(global)	// глобальный gizmo
		{
			planeMath.quaternion.copy( new THREE.Quaternion().setFromAxisAngle( dr, rotY ) );
		}
		else		// локальный gizmo
		{
			var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );							// создаем Quaternion повернутый на выбранную ось	
			var q2 = obj.getWorldQuaternion(new THREE.Quaternion()).clone().multiply( quaternion );			// умножаем на предведущий Quaternion			
			planeMath.quaternion.copy( q2 );																		
		}
	}

	
	planeMath.updateMatrixWorld();
	var dir = planeMath.worldToLocal( intersect.point.clone() );	
	gizmo.userData.gizmo.active.rotY = Math.atan2(dir.x, dir.y);

	getInfoObj_UndoRedo({obj: gizmo.userData.gizmo.obj});
}




function moveGizmo( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' );	 	 
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}	
	
	
	var gizmo = infProject.tools.gizmo;
	var pivot = infProject.tools.pivot;
	
	var obj = gizmo.userData.gizmo.obj;  
	var axis = gizmo.userData.gizmo.active.axis;
	
	if(axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
	else if(axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
	else if(axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
	
	
	
	var dir = planeMath.worldToLocal( intersects[ 0 ].point.clone() );	
	var rotY = Math.atan2(dir.x, dir.y);
	
	
	
	if(camera == cameraTop) 
	{ 
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - gizmo.userData.gizmo.active.rotY);

		showSvgSizeObj({obj: obj, boxCircle: true});
	}
	else 
	{ 		
		rotateO({obj: [obj], dr: dr, rotY: rotY, centerO: obj});		 
	}		
	
	// вращение объекта или объектов 
	function rotateO(cdm)
	{
		var centerO = cdm.centerO;
		var arr = cdm.obj;
		var dr = cdm.dr;
		var rotY = cdm.rotY;		
		
		centerO.updateMatrixWorld();		
		var v1 = centerO.localToWorld( dr.clone() );
		var v2 = centerO.getWorldPosition(new THREE.Vector3());
		var dir = new THREE.Vector3().subVectors(v1, v2).normalize();	// локальный dir , глобальный -> dr new THREE.Vector3( 0, 1, 0 )								

		for(var i = 0; i < arr.length; i++)
		{
			arr[i].position.sub(gizmo.userData.gizmo.active.startPos);
			arr[i].position.applyAxisAngle(dir, rotY - gizmo.userData.gizmo.active.rotY); // rotate the POSITION
			arr[i].position.add(gizmo.userData.gizmo.active.startPos);				
			
			arr[i].rotateOnWorldAxis(dir, rotY - gizmo.userData.gizmo.active.rotY);								
		}		
	}
	
			
	
	gizmo.userData.gizmo.active.rotY = rotY; 
	
	gizmo.rotation.copy( obj.rotation );
	pivot.rotation.copy( obj.rotation );

	
}



function clickMouseUpGizmo(cdm)
{	
	if(clickO.actMove)
	{	
		getInfoEvent23({obj: infProject.tools.gizmo.userData.gizmo.obj, type: 'move'});
	}		
}


