

var arrImg_1 = null;
var arrImg_2 = null;



// screenshot
function createImageScene() 
{ 

	try 
	{	
		showHidePoint({visible: false});
		var background = scene.background.clone();
		scene.background = new THREE.Color( 0xffffff );
		infProject.scene.grid.visible = false;
		infProject.settings.shader.fxaaPass.enabled = true;
		renderer.render( scene, camera );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		showHidePoint({visible: true});
		scene.background = background;
		infProject.scene.grid.visible = true;
		infProject.settings.shader.fxaaPass.enabled = false;
		renderer.render( scene, camera );
 
				
		if(camera == camera3D)
		{
			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
		}
		else
		{	
			var svg = document.querySelector('#svgFrame');
			var canvas = document.createElement("canvas");
			canvas.width = svg.clientWidth;
			canvas.height = svg.clientHeight;
			var ctx = canvas.getContext("2d");
			var DOMURL = self.URL || self.webkitURL || self;
			var img = new Image(); 

			img.onload = function() 
			{
				arrImg_1 = img;
				assemblyImage();
			};
			img.src = imgData;
		}		
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}



function showHidePoint(cdm)
{
	if(camera == camera3D) return;
	
	var point = infProject.scene.array.point;
	
	for( var i = 0; i < point.length; i++ )
	{
		point[i].visible = cdm.visible;
	}
}





// открыть или сохранить screenshot
var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
}; 





// конвертация image в base64 (строка)
function convertImgToBase64(src, callback) 
{
	var image = new Image();
	image.crossOrigin = 'Anonymous';
 
	image.onload = function() {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.height = this.naturalHeight;
		canvas.width = this.naturalWidth;		
		context.fillStyle = '#fff';  /// set white fill style
		context.fillRect(0, 0, canvas.width, canvas.height);		
		context.drawImage(this, 0, 0);
		var dataURL = canvas.toDataURL('image/jpeg', 0.7);	 console.log(dataURL);	
		callback(dataURL);
	};

	image.src = src;
}




function createImageSvg() 
{
	if(camera == camera3D) return;
		
	var arr_2 = [];
	var svg = document.querySelector('#svgFrame');

	var wall = infProject.scene.array.wall;
	var floor = infProject.scene.array.floor;
	
	{
		var arr = [];
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			if(wall[i].userData.wall.html.label)
			{
				for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
				{
					arr[arr.length] = wall[i].userData.wall.html.label[i2];
				}
			}					
		}
		
		for ( var i = 0; i < floor.length; i++ )
		{
			arr[arr.length] = floor[i].userData.room.html.label;
		}
		

		
		for ( var i = 0; i < arr.length; i++ )
		{
			var label = arr[i];
			
			var txt = document.createElementNS(infProject.settings.svg.tag, "text");								
			
			var x = label.userData.elem.x;
			var y = label.userData.elem.y;				
			
			//var translate = 'translate('+ ((label.clientWidth/2)*-1) +','+ ((label.clientHeight/2)*1) +')';
			var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+x+','+y+')';
			
			txt.setAttribute('x', x);
			txt.setAttribute('y', y);
			//txt.setAttribute('dx', (label.clientWidth/2)*-1);
			//txt.setAttribute('dy', label.clientHeight/2);				
			//txt.setAttribute('fill', '#ff0000');
			txt.setAttribute('fill', 'rgba(0,0,0,0.4)');
			txt.setAttribute('transform', rotate);
			txt.setAttribute('dominant-baseline', 'middle');
			txt.setAttribute('text-anchor', 'middle');

			txt.style.cssText += infProject.settings.html.fonts.wall.size; 
			txt.style.cssText += infProject.settings.html.fonts.wall.type;
			
			txt.textContent = label.innerText;

			svg.appendChild(txt);
			
			arr_2[arr_2.length] = txt;
		}	
	}

	{
		var arr = [];
		
		var size = infProject.html.furn.size;
		var offset = infProject.html.furn.offset;
		
		for ( var i = 0; i < size.length; i++ )
		{
			arr[arr.length] = size[i];
		}
		
		for ( var i = 0; i < offset.length; i++ )
		{
			arr[arr.length] = offset[i];
		}

		for ( var i = 0; i < arr.length; i++ )
		{
			var label = arr[i];
			var x = label.userData.elem.x;
			var y = label.userData.elem.y;			
			
			
			if(1==2)
			{
				//<rect x="0" y="0" width="200" height="100" stroke="red" stroke-width="3px" fill="white"/>
				
				var txt = document.createElementNS(infProject.settings.svg.tag, "rect");
				
				var translate = 'translate('+ ((label.clientWidth/2)*-1) +','+ ((label.clientHeight/2)*-1) +')';
				var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+(x)+','+(y)+')';
				
				txt.setAttribute('x', x);
				txt.setAttribute('y', y);
				txt.setAttribute('transform', translate+rotate);				
				txt.setAttribute('width', label.clientWidth);
				txt.setAttribute('height', label.clientHeight);
				txt.setAttribute('stroke', '#ff0000');
				txt.setAttribute('fill', '#ffffff');
				//txt.setAttribute('transform-origin', '50% 50%');
				//txt.style.transformOrigin = '50% 50%';
				
				
				//console.log(txt.style);
				
				svg.appendChild(txt); 
				arr_2[arr_2.length] = txt;
			}
			
			var txt = document.createElementNS(infProject.settings.svg.tag, "text");															
			
			//var translate = 'translate('+ ((label.clientWidth/2)*-1) +','+ ((label.clientHeight/2)*1) +')';
			var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+x+','+y+')';
			
			txt.setAttribute('x', x);
			txt.setAttribute('y', y);
			//txt.setAttribute('dx', (label.clientWidth/2)*-1);
			//txt.setAttribute('dy', label.clientHeight/2);				
			//txt.setAttribute('fill', '#ff0000');
			txt.setAttribute('fill', 'rgba(0,0,0,0.4)');
			txt.setAttribute('transform', rotate);
			txt.setAttribute('dominant-baseline', 'middle');
			txt.setAttribute('text-anchor', 'middle');

			txt.style.cssText += infProject.settings.html.fonts.wall.size; 
			txt.style.cssText += infProject.settings.html.fonts.wall.type;
			
			txt.textContent = label.innerText;

			svg.appendChild(txt);
			
			arr_2[arr_2.length] = txt;
		}		
	}
	

	console.log(txt);
	console.log(label);

 //return;
	
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	console.log(svgString);

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{				
		if(1==2)
		{
			ctx.drawImage(img, 0, 0);
			
			var strMime = "image/png";
			var imgData = canvas.toDataURL(strMime);	
			console.log(imgData);

			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

			DOMURL.revokeObjectURL(imgData);
		}
		else
		{
			arrImg_2 = img;
			assemblyImage();			
		}
	};
	img.src = url;	
	

	for ( var i = 0; i < arr_2.length; i++ )
	{
		arr_2[i].remove();
	}	
}


// собираем 2 изображение в одно
function assemblyImage() 
{	
	if(arrImg_1 && arrImg_2)
	{
		console.log(arrImg_1);
		console.log(arrImg_2);
		
		var svg = document.querySelector('#svgFrame');
		var canvas = document.createElement("canvas");
		canvas.width = svg.clientWidth;
		canvas.height = svg.clientHeight;
		var ctx = canvas.getContext("2d");

		ctx.drawImage(arrImg_1, 0, 0);
		ctx.drawImage(arrImg_2, 0, 0);

		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		var DOMURL = self.URL || self.webkitURL || self;
		DOMURL.revokeObjectURL(imgData);

		arrImg_1 = null;
		arrImg_2 = null;
	}
}



// создаем изображение из svg элемнтов на странице
function createImageFromSvg() 
{

	var svg = document.querySelector('#svgFrame');
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	console.log(svgString);

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{
		ctx.drawImage(img, 0, 0);
		
		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	
		console.log(imgData);

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		DOMURL.revokeObjectURL(imgData);
	};
	img.src = url;	

}








