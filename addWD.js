

// создаем форму окна/двери/балкона (free_dw)
function createEmptyFormWD_1(cdm)
{
	if(!cdm) { cdm = {} };
	
	var type = (cdm.type) ? cdm.type : 'door';
	
	var color = infProject.listColor.door2D;
	
	if(type == 'window'){ color = infProject.listColor.window2D; }
	else if(type == 'door'){ color = infProject.listColor.door2D; }
	
	var material = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 1.0, depthTest: false });
	
	
	if(camera == cameraTop)
	{ 
		material.depthTest = false;		
		material.opacity = 1.0; 	
	}
	else if(1 == 2)
	{ 		
		material.depthTest = true;
		material.opacity = 0;					
	}	
	
	var spline = [];			
	
	if(cdm.size)
	{
		var x = cdm.size.x/2;
		var y = cdm.size.y/2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );			
	}
	else if(type == 'window')
	{
		var x = infProject.settings.wind.width / 2;
		var y = infProject.settings.wind.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else if(type == 'door')
	{  
		var x = infProject.settings.door.width / 2;
		var y = infProject.settings.door.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else
	{
		return;
	}
	
	var shape = new THREE.Shape( spline );
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material );	
	
	var v = obj.geometry.vertices;
	
	var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
	
	for ( var i = 0; i < v.length; i++ )
	{
		v[i].z = Math.round(v[i].z * 100) / 100;
		if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
		if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
	}
	
	obj.geometry.computeBoundingBox();	
	
	for ( var i = 0; i < v.length; i++ )
	{
		if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
		if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
		if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
		if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
	}
	
	
	var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
	
	var form = { type : '' , v : arr };	
	
	obj.userData.tag = 'free_dw';
	obj.userData.door = {};
	obj.userData.door.type = type;
	obj.userData.door.size = new THREE.Vector3();
	obj.userData.door.form = form;
	obj.userData.door.bound = {}; 
	obj.userData.door.width = 0.2;
	obj.userData.door.h1 = 0;		// высота над полом
	obj.userData.door.color = obj.material.color; 
	obj.userData.door.wall = null;
	obj.userData.door.controll = {};
	obj.userData.door.ruler = {};
	obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
	obj.userData.door.topMenu = true;
	obj.userData.door.lotid = (cdm.lotid)? cdm.lotid : null;
	obj.userData.door.obj3D = null;
	obj.userData.door.openId = (cdm.openId !== undefined) ? cdm.openId : 0;
	obj.userData.door.svg = {};
	obj.userData.door.svg.el = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color, fill: '#ffffff', stroke_width: "1px"})[0];
	
	var fillColor = (type == 'door') ? '#e0e0e0' : '#ffffff';	
	obj.userData.door.svg.path = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color, fill: fillColor, stroke_width: "1px"})[0];
	
	if(type == 'door')
	{
		obj.userData.door.svg.arc = createSvgArc({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
	}
	
	//obj.userData.door.active = { click: true, hover: true };
	
	
	//обновляем svg форму
	calcSvgFormWD({obj: obj});
	
	
	//default размеры
	if(1==1)
	{
		obj.geometry.computeBoundingBox();		
		var dX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var dY = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;			
		
		obj.userData.door.form.size = new THREE.Vector3(dX, dY, 1);
		
		var h1 = (type == 'window') ? infProject.settings.wind.h1 : 0;
		 
		obj.userData.door.h1 = h1 - obj.geometry.boundingBox.min.y; 

		if(cdm.pos) { obj.userData.door.h1 = cdm.pos.y - obj.geometry.boundingBox.min.y; }
	}
		
	//default vertices
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.door.form.v2 = v2;		
	}
	
	upUvs_4( obj );
	
	scene.add( obj );
	
	
	if(cdm.status)
	{
		obj.userData.id = cdm.id;
		obj.position.copy(cdm.pos);
		
		obj.position.y += (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2; 	
		
		changeWidthWD(obj, cdm.wall);		// выставляем ширину окна/двери равную ширине стены
		addWD({ obj: obj });
	}
	else
	{
		clickO.move = obj; 
		clickO.last_obj = obj;		
	}
}


// перетаскиваем free_dw
function dragWD_2( event, obj ) 
{ 
	var arrDp = [];
	
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = rayIntersect( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	obj.material.color = obj.userData.door.color;
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall')
			{ 
				wall = object; 
				obj.rotation.copy( wall.rotation ); 
				pos = intersects[i].point; 
			}
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); } 
		}
	}

	if(obj.material.color == new THREE.Color(infProject.listColor.active2D)) { obj.userData.door.wall = null; calcSvgFormWD({obj: obj}); return; }
	if(!wall) { obj.userData.door.wall = null; calcSvgFormWD({obj: obj}); return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	  
	if(camera == camera3D || camera == cameraWall) 
	{ 
		obj.position.set( pos.x, pos.y, pos.z ); 
	}
	else 
	{ 
		obj.position.set( pos.x, obj.userData.door.h1, pos.z ); 
	}		

	changeWidthWD(obj, wall);

	calcSvgFormWD({obj: obj});
}


// кликнули на стену или окно/дверь, когда к мышки привязана вставляемая дверь 
function clickToolWD(obj)
{ 
	  
	if(obj)
	{    
		// кликнули на стену, когда добавляем окно
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			addWD({ obj : obj });  
			return true; 
		}
	}

	return false;
}



// добавляем на выбранную стену окно/дверь (вырезаем форму в стене)
// obj 		готовая дверь/окно
// wall		стену на которую кликнули
function addWD( cdm )
{	
	var obj = cdm.obj;
	var wall = obj.userData.door.wall;
	var pos = obj.position;
	obj.userData.tag = obj.userData.door.type;
	
	//pos.y -= 0.001;		// делаем чуть ниже уровня пола
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	
	
	if(camera == cameraTop)
	{ 
		obj.material.depthTest = false;
		obj.material.transparent = true;
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	//changeWidthWD(obj, wall);		// выставляем ширину окна/двери равную ширине стены
	
	// обновляем(пересчитываем) размеры двери/окна/двери (если измениалась ширина)
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
  
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { infProject.scene.array.window[infProject.scene.array.window.length] = obj; }
	else if(obj.userData.tag == 'door') { infProject.scene.array.door[infProject.scene.array.door.length] = obj; }

	
	//--------
	
	obj.updateMatrixWorld();
	
	
	// создаем клон двери/окна, чтобы вырезать в стене нужную форму
	if(1==1)
	{  
		objsBSP = { wall : wall, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 
	}	


	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	
	
	if(obj.userData.door.lotid)
	{
		loadObjServer({type: 'wd', wd: obj, lotid: obj.userData.door.lotid});
	}
	
	//обновляем svg форму
	calcSvgFormWD({obj: obj});	
 	
	clickO.obj = null;
	clickO.last_obj = null;
	clickO.move = null;
	
	renderCamera();
}



// переключаем положение(вращаем) wd 
function swSetDW_1(cdm)
{
	var obj = cdm.obj;
	var type = cdm.type;
	
	if(!obj.userData.door) return;
	
	if(type == 'r-l')
	{		
		if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 0) ? 1 : 0;
		}
		else if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 3) ? 2 : 3;
		}		
	}
	else if(type == 't-b')
	{
		if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 2) ? 0 : 1;
		}
		else if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 0) ? 2 : 3;
		}		
	}
	
	calcSvgFormWD({obj: obj});
	
	renderCamera();
}




//обновляем форму и положение wd svg
function calcSvgFormWD(cdm)
{
	if(camera != cameraTop) return;
	
	var obj = cdm.obj;
	var openId = obj.userData.door.openId;	// положение открытие wd (в какую сторону повернут obj3D)
	
	obj.updateMatrixWorld();
	
	// базовая форма svg
	{
		var v = [];
		var bound = obj.geometry.boundingBox;
		
		v[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.max.z) );	
		v[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.max.z) );	
		v[2] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.min.z) );	
		v[3] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.min.z) );	
		 
		showElementSvg([obj.userData.door.svg.el]);	
		updateSvgPath({el: obj.userData.door.svg.el, arrP: [v[0], v[1], v[3], v[2], v[0]]}); 
	}

	// центр открытия двери 
	if(obj.userData.door.svg.arc)
	{
		var posArcStart = new THREE.Vector3().subVectors( v[0], v[2] ).divideScalar( 2 ).add(v[2]);
		
		if(openId == 2 || openId == 3)
		{
			var posArcStart = new THREE.Vector3().subVectors( v[1], v[3] ).divideScalar( 2 ).add(v[3]);
		}
	}

	// svg полотно
	if(obj.userData.door.svg.path)
	{
		var minZ = (bound.min.z < -0.05) ? -0.05 : bound.min.z;
		var maxZ = (bound.max.z > 0.05) ? 0.05 : bound.max.z;
		
		v[0] = new THREE.Vector3(bound.min.x, 0, maxZ);	
		v[1] = new THREE.Vector3(bound.max.x, 0, maxZ);	
		v[2] = new THREE.Vector3(bound.min.x, 0, minZ);	
		v[3] = new THREE.Vector3(bound.max.x, 0, minZ); 
		
		// поворачиваем полотно
		if(obj.userData.tag == 'door')
		{
			var dist = [];
			dist[0] = bound.max.x - bound.min.x;
			dist[1] = (maxZ - minZ)/2;
			dist[2] = bound.max.x - bound.min.x;
			dist[3] = (maxZ - minZ)/2;
			
			var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
			var v1 = (maxZ - minZ)/2;
			var offX = 0;
			
			if(openId == 2 || openId == 3)
			{
				var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
				var v1 = -(maxZ - minZ)/2;
				var offX = bound.min.x * 2;
			}
			
			
			for(var i = 0; i < v.length; i++)
			{				
				var radXZ = Math.atan2(v[i].x - v0.x, v[i].z - v0.z);
				
				if(openId == 0) { radXZ += Math.PI/2; }
				else if(openId == 1) { radXZ -= Math.PI/2; }
				else if(openId == 2) { radXZ += Math.PI/2; }
				else if(openId == 3) { radXZ -= Math.PI/2; }
				
				v[i].x = Math.sin(radXZ)*dist[i] + v0.x - v1 + offX;
				v[i].z = Math.cos(radXZ)*dist[i] + v0.z;
			}
		}
		
		for(var i = 0; i < v.length; i++)
		{
			v[i] = obj.localToWorld( v[i].clone() );
		}				
		
		showElementSvg([obj.userData.door.svg.path]); 		
		updateSvgPath({el: obj.userData.door.svg.path, arrP: [v[0], v[1], v[3], v[2], v[0]]});
		
		
		var posArcEnd = v[2].clone();
		
		if(openId == 1 || openId == 2)
		{
			var posArcEnd = v[0].clone();
		}
	}
	
	// svg дуга
	if(obj.userData.door.svg.arc)
	{
		var param = {p2: posArcEnd, p1: posArcStart};
		
		if(openId == 0 || openId == 3) { var param = {p2: posArcEnd, p1: posArcStart}; }
		else if(openId == 1 || openId == 2) { var param = {p2: posArcStart, p1: posArcEnd}; }
		
		showElementSvg([obj.userData.door.svg.arc]);
		updateSvgArc({el: obj.userData.door.svg.arc, param: param});
	}
	
	setPosWD_Obj3D({wd: obj});
}



// устанавливаем (поварачиваем) 3D объект wd 
function setPosWD_Obj3D(cdm)
{
	var wd = cdm.wd;		
	var obj3D = wd.userData.door.obj3D;
	
	if(!obj3D) return;
		
	//wd.geometry.computeBoundingBox();	
	var openId = wd.userData.door.openId;	
	
	//if(openId == 0 || openId == 1) { obj3D.scale.x = Math.abs(obj3D.scale.x); }	
	//else { obj3D.scale.x = -Math.abs(obj3D.scale.x); }

	if(openId == 0)
	{
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 1) 
	{ 
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 2) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 3) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}			
}



// вставляем в wd(форму) 3D объект окна/двери
function setObjInWD(inf, cdm)
{
	var wd = cdm.wd;
	var obj3D = inf.obj;
	
	obj3D.material.visible = false;
	
	wd.add( obj3D );
	
	// CubeCamera
	checkReflectionMaterial({obj: wd});	
	
	wd.userData.door.obj3D = obj3D;
	
	wd.updateMatrixWorld();
	var centerWD = wd.geometry.boundingSphere.center.clone();	

	obj3D.updateMatrixWorld();
	obj3D.geometry.computeBoundingBox();
	obj3D.geometry.computeBoundingSphere();
	
	var center = obj3D.geometry.boundingSphere.center;	
	
	obj3D.position.set(0,0,0);
	obj3D.rotation.set(0,0,0);
	//obj3D.position.set(center.x/objPop.scale.x, center.y/objPop.scale.y, center.z/objPop.scale.z);
	//obj3D.position.copy(centerWD);
	
	if(camera == cameraTop)
	{
		obj3D.visible = false;
	}

	// изменяем у ПОП объекта ширину/высоту/центрируем 
	if(1==1)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		obj3D.geometry.computeBoundingBox();		
		var dX = obj3D.geometry.boundingBox.max.x - obj3D.geometry.boundingBox.min.x;
		var dY = obj3D.geometry.boundingBox.max.y - obj3D.geometry.boundingBox.min.y;				
		
		obj3D.scale.set(x/dX, y/dY, 1);			
	}
	
	setPosWD_Obj3D({wd: wd});
}



// изменение ширины формы окна/двери
function changeWidthWD(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	//if(obj.userData.door.width == wall.userData.wall.width) return;
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;
	obj.userData.door.wall = wall;	
} 
 


 