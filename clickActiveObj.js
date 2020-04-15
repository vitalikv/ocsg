



function activeHover2D( event )
{
	if (camera != cameraTop) { return; }
	if (isMouseDown1) { return; }

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }		
	}
	
	var rayhit = null;
		
	

	if(!infProject.scene.block.hover.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	

	if ( rayhit ) 
	{
		// выделяем объект
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		//if ( clickO.last_obj == object ) { activeHover2D_2(); return; }	// объект активирован (крансый цвет), поэтому не подсвечиваем
		if ( clickO.hover == object ) { return; }				// объект уже подсвечен


		if ( tag == 'point' ) 
		{ 
			//object.material.color = new THREE.Color(infProject.listColor.hover2D); 
			object.material.opacity = 1;
			$('html,body').css('cursor', 'move');
		}

		
		activeHover2D_2();

		clickO.hover = object;
	}
	else
	{
		activeHover2D_2();
	}
}



// возращаем стандартный цвет
function activeHover2D_2()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if( tag == 'point' ) 
	{ 
		//object.material.color = object.userData.point.color;
		object.material.opacity = 0.75;
		$('html,body').css('cursor', 'default');
	}
	
	clickO.hover = null;
}





// выделяем/активируем объект
// кликнули на объект (выделение) (cameraTop)
function objActiveColor_2D(obj)
{ 
	if(camera != cameraTop) return;
	if(!obj) { return; }   
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'window'){ outlineAddObj({arr: [obj]}); }
	else if(tag == 'point'){ outlineAddObj({arr: [obj]}); }	 
	else if(tag == 'wall'){ outlineAddObj({arr: [obj]}); } 	
	else if(tag == 'door'){ outlineAddObj({arr: [obj]}); }	
	//else if(tag == 'room'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); console.log(555555);}
	
	//if(clickO.hover == obj) { clickO.hover = null; }
}
 

	
 
// возращаем стандартный цвет объекта
function objDeActiveColor_2D() 
{	
	if(camera != cameraTop) return;
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.rayhit)
	{    
		if(clickO.rayhit.object.userData.tag == 'controll_wd'){ if(clickO.rayhit.object.userData.controll_wd.obj == o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ outlineRemoveObj(); getCalcWall({wall: o}); }	
	else if(o.userData.tag == 'point'){ outlineRemoveObj(); }	
	else if(o.userData.tag == 'window'){ outlineRemoveObj(); }
	else if(o.userData.tag == 'door'){ outlineRemoveObj(); }	
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
} 










