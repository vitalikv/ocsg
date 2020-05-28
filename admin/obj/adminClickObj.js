

var block = document.querySelector('[nameId="sp_block_drt"]');


var html = 
`<div class="button1 button_gradient_1" nameId="button_save_obj" style="margin-top: 40px;">
	сохранить
</div>
<div class="rp_obj_name">
	<input type="text" nameId="bd_input_obj_id" value="">					
</div>
<div class="rp_obj_name">
	<input type="text" nameId="bd_input_type" value="">					
</div>
<div class="rp_obj_name">
	<div nameId="bd_input_properties" contenteditable="true" spellcheck="true" style='display: block; min-height: 50px; margin: auto auto 10px auto; width: 99%; font-family: arial,sans-serif; font-size: 14px; text-align: center; color: #666; text-decoration: none; line-height: 2em; padding: 0; border: 1px solid #ccc; border-radius: 3px; background-color: #fff;'></div>
</div>
<div style="margin: auto; width: 200px; min-height: 100px; max-height: 150px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
	<img src="#" nameId="bd_img_prew" alt="" style="display: block; width: 200px; min-height: 100px; max-height: 150px; margin: auto; object-fit: contain;">
</div>
<div class="button1 button_gradient_1" nameId="button_save_img_prew" style="margin-top: 0px;">
	сохранить img
</div>
`; 
 




// создаем из str -> html элемент
var div = document.createElement('div');
div.innerHTML = html;
var elem = div;
	

block.append(elem); 


var el_2 = block.querySelector('[nameId="button_save_obj"]');	
el_2.onmousedown = function(e){ saveObjSql({obj: clickO.last_obj}); }; 



// получаем инфо из базы по выделенному объекту и заполняем этими данными UI
async function getInfObjFromBD(cdm)
{ 
	var obj = cdm.obj;
	
	$('[nameId="rp_obj_name"]').val('');
	$('[nameId="bd_input_obj_id"]').val(null);
	$('[nameId="bd_input_type"]').val(null);	
	$('[nameId="bd_input_properties"]').text('');
	$('[nameId="bd_img_prew"]').attr('src', infProject.path+'img/f0.png');
	
	var lotid = obj.userData.obj3D.lotid;
	if(!lotid) return;	
	
	//var response = await fetch(infProject.path+'components_2/getObjSql.php?id='+lotid, { method: 'GET' });
	var response = await fetch(infProject.path+'components_2/getObjSql.php', 
	{
		method: 'POST',
		body: 'id='+lotid+'&select_list=id, name, type, properties, preview' ,
		headers: 
		{
			'Content-Type': 'application/x-www-form-urlencoded'
		},		
		
	});
	var json = await response.json();

	if(json.error)
	{
		return; 
	}

	var res = json;
		
	if(res.name) $('[nameId="rp_obj_name"]').val(res.name);
	if(res.id) $('[nameId="bd_input_obj_id"]').val(res.id);
	if(res.type) $('[nameId="bd_input_type"]').val(res.type);
	if(res.properties) $('[nameId="bd_input_properties"]').text(JSON.stringify(res.properties));
	if(res.preview) $('[nameId="bd_img_prew"]').attr('src', res.preview);
}





// сохраняем объект на сервере в BD
function saveObjSql(cdm)
{
	var obj = cdm.obj;
	//console.log(cdm); return;
	if(!obj) return;
		
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeBoundingSphere();

	var bound = obj.geometry.boundingBox;
	var size = {x: bound.max.x-bound.min.x, y: bound.max.y-bound.min.y, z: bound.max.z-bound.min.z};
 
	
	var lotid = $('[nameId="bd_input_obj_id"]').val();
	lotid = lotid.trim();
	if(lotid == '') { lotid = 0; }	
	
	var name = $('[nameId="rp_obj_name"]').val();
	name = name.trim();
	if(name == '') { name = null; }
	
	var type = $('[nameId="bd_input_type"]').val();
	type = type.trim();
	if(type == '') { type = null; }

	var properties = $('[nameId="bd_input_properties"]').text();
	properties = properties.trim();
	if(properties == '') { properties = null; }
	else { properties = JSON.parse(properties); }	
	


	var lotid = obj.userData.obj3D.lotid;
	var name = (name) ? JSON.stringify( name ) : null;
	var type = (type) ? JSON.stringify( type ) : null;
	var size = (size) ? JSON.stringify( size ) : null;		
	var properties = (properties) ? JSON.stringify( properties ) : null;
	var preview = saveAsImagePreview();
	
	{
		var pos = obj.position.clone();
		var rot = obj.rotation.clone();
		
		obj.position.set(0, 0, 0);
		obj.rotation.set(0, 0, 0);
		obj.updateMatrixWorld();
		
		var model = JSON.stringify( obj );  		
	}
	
	$.ajax
	({
		type: "POST",					
		url: infProject.path+'admin/obj/saveObjSql.php',
		data: { id: lotid, name: name, type: type, size: size, model: model, properties: properties, preview: preview },
		dataType: 'json',
		success: function(data)
		{  
			console.log(data);

			obj.position.copy(pos);
			obj.rotation.copy(rot);				
		}
	});	
	

}



// preview сохраняем в bd
function saveAsImagePreview() 
{ 
	try 
	{		
		var rd = 200/containerF.clientWidth;
		
		renderer.setSize( 200, containerF.clientHeight *rd );
		if(camera == camera3D) { infProject.camera.d3.targetO.visible = false; }
		
		var arrObj = infProject.scene.array.obj;
		for ( var i = 0; i < arrObj.length; i++ )
		{
			if(clickO.last_obj == arrObj[i]) continue;
			arrObj[i].visible = false;
		}		
		
		infProject.tools.pivot.visible = false;
		infProject.tools.gizmo.visible = false;
		infProject.scene.grid.visible = false;
		infProject.settings.shader.fxaaPass.enabled = true;
		renderer.render( scene, camera );
		
		var imgData = renderer.domElement.toDataURL("image/jpeg", 0.7);	

		renderer.setSize( containerF.clientWidth, containerF.clientHeight );
		if(camera == camera3D) { infProject.camera.d3.targetO.visible = true; }
		
		var arrObj = infProject.scene.array.obj;
		for ( var i = 0; i < arrObj.length; i++ )
		{
			if(clickO.last_obj == arrObj[i]) continue;
			arrObj[i].visible = true;
		}
		
		infProject.tools.pivot.visible = true;
		infProject.tools.gizmo.visible = true;
		infProject.scene.grid.visible = true;
		infProject.settings.shader.fxaaPass.enabled = false;
		renderer.render( scene, camera );
		
		return imgData;
	} 
	catch (e) 
	{
		console.log(e);
		return null;
	}
}

