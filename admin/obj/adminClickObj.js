

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
</div>`; 
 

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
	
	var lotid = obj.userData.obj3D.lotid;
	if(!lotid) return;	
	
	//var response = await fetch(infProject.path+'components_2/getObjSql.php?id='+lotid, { method: 'GET' });
	var response = await fetch(infProject.path+'components_2/getObjSql.php', 
	{
		method: 'POST',
		body: 'id='+lotid+'&select_list=id, name, type, properties' ,
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
}





