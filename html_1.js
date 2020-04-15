




// показываем html элементы
function showElementHtml(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'block'; 
		arr[i].userData.elem.show = true;		
	}	
}


// скрываем html элементы
function hideElementHtml(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'none'; 
		arr[i].userData.elem.show = false; 
	}	
}





function createHtmlLabelWall(cdm)
{
	var arr = [];
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var labelContainerElem = document.querySelector('#htmlBlock');
		var elem = document.createElement('div');
		elem.textContent = '';
		elem.style.cssText = 'position: absolute; text-align: center;';
		elem.style.cssText += infProject.settings.html.fonts.wall.size; 
		elem.style.cssText += infProject.settings.html.fonts.wall.type;
		elem.style.cssText += infProject.settings.html.fonts.wall.color;
		elem.style.cssText += 'z-index: 1;';
		if(cdm.style) { elem.style.cssText += (cdm.style); }
		
		labelContainerElem.appendChild(elem); 
		
		elem.userData = {};
		elem.userData.tag = cdm.tag;
		elem.userData.elem = {};
		elem.userData.elem.pos = new THREE.Vector3();
		elem.userData.elem.rot = 0;
		elem.userData.elem.show = true;
		
		infProject.html.label[infProject.html.label.length] = elem;	

		arr[arr.length] = elem;
		
		if(cdm.display)
		{
			elem.style.display = cdm.display;
			elem.userData.elem.show = false;
		}
	}
	
	return arr;
}






















