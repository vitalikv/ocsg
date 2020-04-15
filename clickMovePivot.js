

function createPivot_2()
{
	var pivot = new THREE.Object3D();
	pivot.userData.pivot = {};
	pivot.userData.pivot.active = { axis: '', startPos: new THREE.Vector3(), dir: new THREE.Vector3(), qt: new THREE.Quaternion() };
	pivot.userData.pivot.obj = null;
	pivot.userData.pivot.axs = [];
	
	var param = [];
	param[0] = {axis: 'x', pos: new THREE.Vector3(0.6, 0.0, 0.0), rot: new THREE.Vector3(0, 0, 0)};
	param[1] = {axis: 'x', pos: new THREE.Vector3(-0.6, 0.0, 0.0), rot: new THREE.Vector3(0, Math.PI, 0)};
	param[2] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, -0.6), rot: new THREE.Vector3(0, Math.PI/2, 0)};
	param[3] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, 0.6), rot: new THREE.Vector3(0, -Math.PI/2, 0)};
	
	var geometry = createGeometryWD({x: 0.35, y: 0.01, z: 0.35});
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	
	for ( var i = 0; i < param.length; i++ )
	{
		var obj = new THREE.Mesh( geometry, material );
		obj.userData.tag = 'pivot';
		obj.userData.axis = param[i].axis;	
		obj.renderOrder = 2;
		
		if(param[i].pos) obj.position.set( param[i].pos.x, param[i].pos.y, param[i].pos.z );
		if(param[i].rot) obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );
		
		param[i].o = obj;
		
		pivot.add( obj );
	}
	
	var y = createCone({axis: 'y', pos: new THREE.Vector3(0,0.1,0), rot: new THREE.Vector3(0,0,0), color: 0xcccccc});
	pivot.add( y );
	
	pivot.visible = false;
	scene.add( pivot );
	
	
	pivot.userData.pivot.axs.x = param[0].o;
	pivot.userData.pivot.axs.y = y;
	pivot.userData.pivot.axs.z = param[2].o;	
		
	
	
	return pivot;
}




// создаем конусы для Pivot
function createCone(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
		v[n].y = 0.25;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.25;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshPhongMaterial( { color : cdm.color, depthTest: false, transparent: true, lightMap: lightMap_1 } ) ); 
	obj.userData.tag = 'pivot';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);
	//obj.visible = false;	
	scene.add( obj );
	
	return obj;
}



// кликнули на pivot
function clickPivot( intersect )
{
	var obj = clickO.move = intersect.object;  
	
	var pivot = infProject.tools.pivot;
	
	var pos = pivot.position.clone();
	
	pivot.userData.pivot.active.startPos = pos;
	
	clickO.offset = new THREE.Vector3().subVectors( pos, intersect.point );
	
	var axis = obj.userData.axis;
	pivot.userData.pivot.active.axis = axis;	
	pivot.updateMatrixWorld();	
	
	
	if(axis == 'x')
	{ 
		var axisO = pivot.userData.pivot.axs.x; 	
	}
	else if(axis == 'z')
	{ 
		var axisO = pivot.userData.pivot.axs.z; 	
	}
	else if(axis == 'y')
	{ 
		var axisO = pivot.userData.pivot.axs.y;	
	}	
		
	
	if(axis == 'xz' || axis == 'center')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
	}		 
	else
	{
		axisO.updateMatrixWorld();
		pivot.userData.pivot.active.dir = new THREE.Vector3().subVectors( pivot.position, axisO.getWorldPosition(new THREE.Vector3()) ).normalize();	
		pivot.userData.pivot.active.qt = quaternionDirection( pivot.userData.pivot.active.dir );	
		
		planeMath.quaternion.copy( pivot.userData.pivot.active.qt ); 
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));
	}
	
	planeMath.position.copy( intersect.point );
	
	getInfoObj_UndoRedo({obj: pivot.userData.pivot.obj});
} 





function movePivot( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var obj = pivot.userData.pivot.obj;
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );

	if(pivot.userData.pivot.active.axis == 'xz')
	{
		
	}		
	else
	{
		var subV = new THREE.Vector3().subVectors( pos, pivot.userData.pivot.active.startPos );
		var locD = localTransformPoint(subV, pivot.userData.pivot.active.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( pivot.userData.pivot.active.dir, locD.z );
		pos = new THREE.Vector3().addVectors( pivot.userData.pivot.active.startPos, v1 );			
	}
	
	
	var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
	pivot.position.add( pos2 );
	gizmo.position.add( pos2 );
	
	obj.position.add( pos2 );
	
	setScalePivotGizmo();
}



// масштаб Pivot/Gizmo
function setScalePivotGizmo()
{
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var pVis = false;
	
	if(gizmo.visible) { pVis = true; }
	if(!pVis) { return; }
	
	var obj = null;
	
	if(pVis) obj = pivot.userData.pivot.obj;
	if(!obj) return;
	
	if(camera == cameraTop)
	{		
		var scale = 1/camera.zoom+0.0;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );
	}
	else
	{
		var dist = camera.position.distanceTo(obj.position); 					
		var scale = dist/6;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );		
	}
}




function clickMouseUpPivot(cdm)
{	
	if(clickO.actMove)
	{	
		getInfoEvent23({obj: infProject.tools.pivot.userData.pivot.obj, type: 'move'});
		
		updateCubeCam({obj: infProject.tools.pivot.userData.pivot.obj});	// CubeCamera (material Reflection)
	}		
}

