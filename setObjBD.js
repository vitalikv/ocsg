

// получаем габариты объекта и строим box-форму
function getBoundObject(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return;
	
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeBoundingSphere();

	var bound = obj.geometry.boundingBox;
	
	var size = {x: bound.max.x-bound.min.x, y: bound.max.y-bound.min.y, z: bound.max.z-bound.min.z};
	
	
	// создаем box-форму
	if(1==1)
	{
		var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 });
		var geometry = createGeometryCube(size.x, size.y, size.z);
		
		var box = new THREE.Mesh( geometry, material ); 	
		scene.add(box);
		
		box.position.copy(obj.position);
		box.rotation.copy(obj.rotation);
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();

		var pos1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
		var pos2 = box.localToWorld( box.geometry.boundingSphere.center.clone() );
		box.position.add(pos1.clone().sub(pos2));  		
	}
	
	
	
	var lotid = $('[nameId="bd_input_obj_id"]').val();
	lotid = lotid.trim();
	if(lotid == '') { lotid = 0; }	
	
	var name = $('[nameId="rp_obj_name"]').val();
	name = name.trim();
	if(name == '') { name = null; }
	
	var type = $('[nameId="bd_input_type"]').val();
	type = type.trim();
	if(type == '') { type = null; }
	
	var clone = obj.children[0].clone();

	var properties = $('[nameId="bd_input_properties"]').text();
	properties = properties.trim();
	if(properties == '') { properties = null; }
	else { properties = JSON.parse(properties); }
	
	var preview = null;		
	//var preview = saveAsImagePreview();


	if(!name) { console.log('name empty'); return; }
	
	saveObjSql({lotid: lotid, name: name, size: size, type: type, json: clone, properties: properties, preview: preview}); 	
}





// сохраняем объект в базе 
function saveObjSql(cdm)
{  
	var name = (cdm.name) ? JSON.stringify( cdm.name ) : null;
	var size = (cdm.size) ? JSON.stringify( cdm.size ) : null;
	var type = (cdm.type) ? JSON.stringify( cdm.type ) : null;
	var json = (cdm.json) ? JSON.stringify( cdm.json ) : null;
	var properties = (cdm.properties) ? JSON.stringify( cdm.properties ) : null;
	var preview = cdm.preview;
	
	$.ajax 
	({
		type: "POST",					
		url: infProject.path+'components_2/saveObjSql.php', 
		data: { id: cdm.lotid, name: name, type: type, size: size, properties: properties, json: json, preview: preview },
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





