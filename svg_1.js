



// создаем svg line елемент
function createSvgLine(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	var x1 = (cdm.x1) ? cdm.x1 : 100;
	var y1 = (cdm.y1) ? cdm.y1 : 300;
	var x2 = (cdm.x2) ? cdm.x2 : 600;
	var y2 = (cdm.y2) ? cdm.y2 : 300;	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var line  = document.createElementNS(infProject.settings.svg.tag, "line");

		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);

		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
		line.setAttribute("stroke-width", "2px");
		line.setAttribute("stroke", "rgb(255, 162, 23)");
		line.setAttribute("display", "none");
		
		if(cdm.dasharray)
		{
			line.setAttribute("stroke-dasharray", "20 10");
		}		
		
		if(cdm.color)
		{ 
			line.setAttribute("stroke", cdm.color); 
		}	
		
		if(cdm.display)
		{
			line.setAttribute("display", cdm.display);
		}
		
		line.userData = {};
		line.userData.svg = {};
		line.userData.svg.line = {};
		line.userData.svg.line.p = [new THREE.Vector3(), new THREE.Vector3()];		
		
		svg.appendChild(line);
		
		infProject.svg.arr[infProject.svg.arr.length] = line;
		arr[arr.length] = line;
	}
	
	return arr;
}


// создаем svg circle елемент
function createSvgCircle(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var circle = document.createElementNS(infProject.settings.svg.tag, "circle");

		circle.setAttribute("cx", 600);
		circle.setAttribute("cy", 600);

		circle.setAttribute("r", 4.2);
		circle.setAttribute("stroke-width", "2px");
		
		if(cdm.color){ circle.setAttribute("stroke", cdm.color); }
		else { circle.setAttribute("stroke", "rgb(255, 162, 23)"); }	
		
		circle.setAttribute("fill", "#fff");
		
		//circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
		circle.setAttribute("display", "none");
		
		circle.userData = {};
		circle.userData.svg = {};
		circle.userData.svg.circle = {};
		//circle.userData.svg.circle.r = 300;
		circle.userData.svg.circle.pos = new THREE.Vector3();		

		svg.appendChild(circle);
		
		infProject.svg.arr[infProject.svg.arr.length] = circle;
		arr[arr.length] = circle;		
	}
	
	return arr;		
}



// создаем svg контур из линий
function createSvgPath(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var el  = document.createElementNS(infProject.settings.svg.tag, "path");

		el.setAttribute("d", 'M100 100, 300 100, 300 600, 200 600');
		el.setAttribute("stroke-width", "2px");		
		el.setAttribute("fill", "none");
		el.setAttribute("stroke", "rgb(255, 162, 23)");
		el.setAttribute("display", "none");
		
		
		if(cdm.arrS)
		{
			var path = 'M';
			
			for ( var i2 = 0; i2 < cdm.arrS.length; i2++ )
			{
				path += cdm.arrS[i2].x+' '+cdm.arrS[i2].y+','; 
			}

			el.setAttribute("d", path);
		}
		
		if(cdm.dasharray)
		{
			el.setAttribute("stroke-dasharray", "20 10");
		}
		
		if(cdm.stroke_width)
		{
			el.setAttribute("stroke-width", cdm.stroke_width);
		}		

		if(cdm.fill)
		{
			el.setAttribute("fill", cdm.fill); 
		}
		
		if(cdm.color)
		{ 
			el.setAttribute("stroke", cdm.color); 
		}	
		
		if(cdm.display)
		{
			el.setAttribute("display", cdm.display);
		}		
		
		el.userData = {};
		el.userData.svg = {};
		el.userData.svg.path = {};
		el.userData.svg.path.arrP = [];		
		el.userData.svg.path.arrS = (cdm.arrS) ? cdm.arrS : [];
		
		svg.appendChild(el);
		
		infProject.svg.arr[infProject.svg.arr.length] = el;
		arr[arr.length] = el;
	}
	
	return arr;
}



// создаем svg дугу
function createSvgArc(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var el  = document.createElementNS(infProject.settings.svg.tag, "path");

		//<path d=\"M$x1,$y1 A$R1,$R1 0 0,0 $x2,$y2\"/>
		var p1 = new THREE.Vector2(0, 0);
		var p2 = new THREE.Vector2(0, 0);
		var r = 0;
		el.setAttribute("d", 'M'+p1.x+','+p1.y+'A'+r+','+r+' 0 0,0 '+p2.x+','+p2.y);
		el.setAttribute("stroke-width", "1px");		
		el.setAttribute("fill", "none");
		el.setAttribute("stroke", "rgb(255, 162, 23)");
		
		if(cdm.dasharray)
		{
			el.setAttribute("stroke-dasharray", "20 10");
		}
		
		if(cdm.stroke_width)
		{
			el.setAttribute("stroke-width", cdm.stroke_width);
		}		

		if(cdm.fill)
		{
			el.setAttribute("fill", cdm.fill); 
		}
		
		if(cdm.color){ el.setAttribute("stroke", cdm.color); }	
		
		el.setAttribute("display", "none");
		
		el.userData = {};
		el.userData.svg = {};
		el.userData.svg.arc = {};
		el.userData.svg.arc.param = {};
		el.userData.svg.arc.param.p1 = p1;
		el.userData.svg.arc.param.p2 = p2;
		el.userData.svg.arc.param.r = r;		
		
		svg.appendChild(el);
		
		infProject.svg.arr[infProject.svg.arr.length] = el;
		arr[arr.length] = el;
	}
	
	return arr;	
}



// обновляем положение svg на экране (конвертируем из 3D в screen)
function updateSvgLine(cdm)
{
	var el = cdm.el;	
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.point)
	{
		el.userData.svg.line.p = cdm.point;
	}
	
	var p = el.userData.svg.line.p;
	
	//camera.updateProjectionMatrix();
	var tempV = p[0].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x1", x);
	el.setAttribute("y1", y);
	
	var tempV = p[1].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x2", x);
	el.setAttribute("y2", y);		
	
}



// обновляем положение svg на экране (конвертируем из 3D в screen)	
function updateSvgCircle(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.pos)
	{
		el.userData.svg.circle.pos = cdm.pos;
	}
	
	var pos = el.userData.svg.circle.pos;
	
	var tempV = pos.clone().project(camera);
	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("cx", x);
	el.setAttribute("cy", y);			
}



// обновляем положение svg на экране (конвертируем из 3D в screen)
function updateSvgPath(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.arrP)
	{
		el.userData.svg.path.arrP = cdm.arrP;
	}
	
	var path = 'M';
	var arrP = el.userData.svg.path.arrP;
	var arrS = [];
	
	if(arrP.length == 0) return;
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var tempV = arrP[i].clone().project(camera);
		var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
		var y = (tempV.y * -.5 + .5) * canvas.clientHeight;
		
		path += x+' '+y+',';
		
		arrS[arrS.length] = new THREE.Vector2(x, y);
	}
	
	el.userData.svg.path.arrS = arrS;

	el.setAttribute("d", path);			
}





// обновляем svg дугу (конвертируем из 3D в screen)
function updateSvgArc(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	
	if(cdm.param)
	{
		el.userData.svg.arc.param = cdm.param;
	}
	
	var p1 = el.userData.svg.arc.param.p1;
	var p2 = el.userData.svg.arc.param.p2;
	//var r = el.userData.svg.arc.param.r;
	
	//camera.updateProjectionMatrix();
	var tempV = p1.clone().project(camera);
	var x1 = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y1 = (tempV.y * -.5 + .5) * canvas.clientHeight;

	
	var tempV = p2.clone().project(camera);
	var x2 = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y2 = (tempV.y * -.5 + .5) * canvas.clientHeight;	

	var r = new THREE.Vector2(x1, y1).distanceTo( new THREE.Vector2(x2, y2) );

	el.setAttribute("d", 'M'+x1+','+y1+'A'+r+','+r+' 0 0,0 '+x2+','+y2);		
}



 

// конвертируем позицию svg из screen в 3D сцену
function upSvgLinePosScene(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		var x = ( ( el[i].x1.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y1.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		A.unproject(camera);
		
		var x = ( ( el[i].x2.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y2.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		B.unproject(camera);					
		
		el[i].userData.svg.line.p = [A, B];
	}				
}



// конвертируем позицию svg из screen в 3D сцену
function upSvgPathPosScene(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		var arrP = [];
		
		for ( var i2 = 0; i2 < el[i].userData.svg.path.arrS.length; i2++ )
		{
			var arrS = el[i].userData.svg.path.arrS[i2];
			
			var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
			var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
			var A = new THREE.Vector3(x, y, -1);
			A.unproject(camera);

			arrP[arrP.length] = A;
		}	
				
		//arrP[arrP.length] = arrP[0];
		
		el[i].userData.svg.path.arrP = arrP;	 
	}

}




// показываем svg элементы
function showElementSvg(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "block");
	}	
}


// скрываем svg элементы
function hideElementSvg(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "none");
	}	
}






// назначаем события для svg элемнтов (точеки масшатабирования объекта)
function assignEventSvgScaleSizeObj(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		
		el[i].addEventListener('mouseover', 		
			function() 
			{ 
				this.setAttribute("r", 6);				
			}
		);
		
		el[i].addEventListener('mouseout', 		
			function() 
			{ 
				this.setAttribute("r", 4.2);
			}
		);
		
		el[i].addEventListener('mousedown', 		
			function(event) 
			{ 
				clickElementBoxScale({event: event, elem: this});
				event.stopPropagation();
			}
		);			
	}
 
}














