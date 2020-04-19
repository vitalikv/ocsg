

// получаем габариты объекта и строим box-форму
function getBoundObject(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return;
	
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeBoundingSphere();

	var bound = obj.geometry.boundingBox;
	
	var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 });
	var size = {x: bound.max.x-bound.min.x, y: bound.max.y-bound.min.y, z: bound.max.z-bound.min.z};
	var geometry = createGeometryCube(size.x, size.y, size.z);
	
	var v = geometry.vertices;
	//v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
	//v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
	var box = new THREE.Mesh( geometry, material ); 	
	//box.position.copy(centP);
	scene.add(box);
	
	box.position.copy(obj.position);
	box.rotation.copy(obj.rotation);
	
	box.updateMatrixWorld();
	box.geometry.computeBoundingBox();	
	box.geometry.computeBoundingSphere();	
	
	
	var pos1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	var pos2 = box.localToWorld( box.geometry.boundingSphere.center.clone() );
	
	
	console.log(pos1);
	//box.position.copy(obj.position);
	box.position.add(pos1.clone().sub(pos2)); 

	var clone = obj.children[0].clone();
	var preview = null;		//var preview = saveAsImagePreview();
	
	saveObjSql({id: 0, name: 'объект 1', size: size, json: clone, preview: preview}); 	
}





// получаем с сервера список проектов принадлежащих пользователю
function saveObjSql(cdm)
{  
	var name = JSON.stringify( cdm.name );
	var size = JSON.stringify( cdm.size );
	var json = JSON.stringify( cdm.json );
	var preview = cdm.preview;
	
	$.ajax
	({
		type: "POST",					
		url: infProject.path+'components_2/saveObjSql.php',
		data: { id: cdm.id, name: name, size: size, json: json, preview: preview },
		dataType: 'json',
		success: function(data)
		{  
			console.log(data);			
		}
	});	
}



function getObjSql(cdm)
{  
	
	$.ajax
	({
		type: "POST",					
		url: infProject.path+'components_2/getObjSql.php',
		data: { id: cdm.id },
		dataType: 'json',
		success: function(data)
		{  
			console.log(JSON.parse(data.id), JSON.parse(data.name), JSON.parse(data.size), JSON.parse(data.json));			
		}
	});	
}





