

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
	
	var name = $('[nameId="rp_obj_name"]').val();
	name = name.trim();
	
	var type = $('[nameId="bd_input_type"]').val();
	type = type.trim();

	var properties = $('[nameId="bd_input_properties"]').text();
	properties = properties.trim();
	properties = JSON.parse(properties);

	
	saveObjSql({lotid: 0, name: name, size: size, type: type, json: clone, properties: properties, preview: preview}); 	
}





// сохраняем объект в базе 
function saveObjSql(cdm)
{  
	var name = JSON.stringify( cdm.name );
	var size = JSON.stringify( cdm.size );
	var type = JSON.stringify( cdm.type );
	var json = JSON.stringify( cdm.json );
	var properties = JSON.stringify( cdm.properties );
	var preview = cdm.preview;
	
	$.ajax 
	({
		type: "POST",					
		url: infProject.path+'components_2/saveObjSql.php', 
		data: { id: cdm.lotid, name: name, type: type, size: size, json: json, properties: properties, preview: preview },
		dataType: 'json',
		success: function(data)
		{  
			console.log(data);			
		}
	});	
}



// получаем инфо из базы по выделенному объекту и заполняем этими данными UI
async function getInfObjFromBD(cdm)
{
	var obj = cdm.obj;
	
	$('[nameId="rp_obj_name"]').val('');
	$('[nameId="bd_input_obj_id"]').val(null);
	$('[nameId="bd_input_type"]').val(null);	
	
	var res = await getObjSql({lotid: obj.userData.obj3D.lotid}); 
	
	if(!res) return;
		
	if(res.name) $('[nameId="rp_obj_name"]').val(res.name);
	if(res.id) $('[nameId="bd_input_obj_id"]').val(res.id);
	if(res.type) $('[nameId="bd_input_type"]').val(res.type);
	if(res.properties) $('[nameId="bd_input_properties"]').text(JSON.stringify(res.properties)); 
}



// делаем запрос к базе, ищем объект по lotid
async function getObjSql(cdm)
{  
	console.log(44444, cdm); 
	var lotid = cdm.lotid;
	if(!lotid) return;
	if(!isNumeric(lotid)) return; 
	
	var response = await fetch(infProject.path+'components_2/getObjSql.php?id='+lotid, { method: 'GET' });
	var json = await response.json();		
	
	if(!json.error)
	{
		console.log(json);
		return json; 
	}
	
	return;
}





