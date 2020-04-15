


// кликнули на точку svg
function clickElementBoxScale(cdm)
{
	var event = cdm.event;
	var elem = cdm.elem;
	
	var pos = getScreenMousePosition(event);
	
	clickO.elem = elem;
	
	var circle = infProject.svg.furn.boxCircle.elem;
	
	// infProject.svg.furn.boxCircle.elem раположение точек масштаба на экране
	// 0 top-left
	// 1 top-center
	// 2 top-right
	
	// 3 bottom-left
	// 4 bottom-center
	// 5 bottom-right		
	
	// 6 left-center
	// 7 right-center		
	
	
	var inf = { };
	
	if(elem == circle[0])
	{
		inf.start = circle[5];
		inf.x = { o2: circle[3], o1: circle[5] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};
	}
	else if(elem == circle[1])
	{
		inf.start = circle[4];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[2])
	{
		inf.start = circle[3];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[3])
	{
		inf.start = circle[2];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[4])
	{
		inf.start = circle[1];
		inf.x = { o2: circle[3], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};			
	}
	else if(elem == circle[5])
	{
		inf.start = circle[0];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[3], o1: circle[0] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[6])
	{
		inf.start = circle[7];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[3], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	else if(elem == circle[7])
	{
		inf.start = circle[6];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	

	//var dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	//var rad = Math.atan2(dir.x, dir.y) - Math.PI/2;
	
	elem.userData.svg.circle.inf = {x: {}, z: {}, start: {}};
	
	elem.userData.svg.circle.inf.start.el = inf.start;
	elem.userData.svg.circle.inf.start.dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.x.el = inf.x.o2;
	elem.userData.svg.circle.inf.x.dir = new THREE.Vector2(inf.x.o2.cx.baseVal.value - inf.x.o1.cx.baseVal.value, inf.x.o2.cy.baseVal.value - inf.x.o1.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.z.el = inf.z.o2;
	elem.userData.svg.circle.inf.z.dir = new THREE.Vector2(inf.z.o2.cx.baseVal.value - inf.z.o1.cx.baseVal.value, inf.z.o2.cy.baseVal.value - inf.z.o1.cy.baseVal.value).normalize();

	elem.userData.svg.circle.inf.half = inf.half;
}




// перемещаем svg точку и меняем масштаб у объекта
function moveElementBoxScale2D(e)
{
	var elem = clickO.elem;
	var pos = getScreenMousePosition(e);
	
	var inf = elem.userData.svg.circle.inf;
	
	// равномерное перемещение точки, которую перетаскиваем по осям xz
	if(1==1)
	{
		var el = inf.start.el;
		var dir = inf.start.dir; 		
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = new THREE.Vector3(pos.x, 0, pos.y);
		
		var pos = spPoint(A,B,C);
		
		//console.log(new THREE.Vector3().subVectors( A, B ).normalize());
		
		elem.setAttributeNS(null, "cx", pos.x);
		elem.setAttributeNS(null, "cy", pos.z);						
	}

	// перемещаем соседние точки
	if(inf.x)
	{
		var el = inf.x.el;
		var dir = inf.x.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = spPoint(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	// перемещаем соседние точки
	if(inf.z)
	{
		var el = inf.z.el;
		var dir = inf.z.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = spPoint(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	// перемещаем соседние точки
	if(inf.half)
	{
		for ( var i = 0; i < inf.half.length; i++ )
		{
			var el = inf.half[i].el;
			
			var A = new THREE.Vector2(inf.half[i].p[0].cx.baseVal.value, inf.half[i].p[0].cy.baseVal.value);
			var B = new THREE.Vector2(inf.half[i].p[1].cx.baseVal.value, inf.half[i].p[1].cy.baseVal.value);
			
			var pos2 = new THREE.Vector2().subVectors( B, A ).divideScalar( 2 ).add(A);
			
			el.setAttributeNS(null, "cx", pos2.x);
			el.setAttributeNS(null, "cy", pos2.y);			
		}
	}
	
	
	// меняем масштаб объекта
	{
		var circle = infProject.svg.furn.boxCircle.elem;	

		var x = ( ( circle[2].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[2].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[3].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[3].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[5].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[5].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var C = new THREE.Vector3(x, y, -1);	
		
		//camera.updateProjectionMatrix();
		A.unproject(camera);
		B.unproject(camera);
		C.unproject(camera);
		
		var z = A.distanceTo( C );
		var x = B.distanceTo( C );
		
		
		var obj = clickO.last_obj;		
		obj.scale.x = x/obj.userData.obj3D.box.x;
		obj.scale.z = z/obj.userData.obj3D.box.z;		
	}
	
	
	// смещение объекта по центру box
	{
		var posCenter = new THREE.Vector3().subVectors( B, A ).divideScalar( 2 ).add(A);
		
		obj.position.x = posCenter.x;
		obj.position.z = posCenter.z;			
	}
	
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	infProject.tools.pivot.position.copy(pos);
	infProject.tools.gizmo.position.copy(pos);
	
	showSvgSizeObj({obj: obj});
	
	uiInfoObj({obj: obj});
	
	e.stopPropagation();	
}




// сняли клик после того, как меняли масштаб у svg box
function clickUpElementBoxScale() 
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	
	showSvgSizeObj({obj: obj, boxCircle: true});
	
	clickO.elem = null;
}





// кликнули на объект, показываем размеры объекта
function showSvgSizeObj(cdm)
{
	//if(camera != cameraTop) return;
	
	var obj = cdm.obj;
		
	
	if(cdm.resetPos)
	{
		infProject.calc.boxScale2D.pos2D = null;
		infProject.calc.boxScale2D.pos3D = null;		
	}
	
	if(cdm.setPos && 1==2)
	{
		offsetSvgSizeObj(cdm);
		
		return;
	}

	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	//obj.geometry.computeBoundingSphere()	
	
	// размеры объекта
	{
		var html = infProject.html.furn.size;
		
		if(infProject.svg.furn.size.show && camera == cameraTop)
		{
			showElementHtml(html);
			showElementSvg(infProject.svg.furn.size.elem);
		}
		
		var x1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var x2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var z1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.min.z) );
		var z2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.max.z) );	
		
		var sizeX = x1.distanceTo( x2 );
		var sizeZ = z1.distanceTo( z2 );
		
		updateSvgLine({el: infProject.svg.furn.size.elem[0], point: [x1, x2]});
		updateSvgLine({el: infProject.svg.furn.size.elem[1], point: [z1, z2]});
		
		
		var dir = new THREE.Vector3().subVectors( x2, x1 );
		var rotY = Math.atan2(dir.x, dir.z);		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }		
		
		var posLabel = new THREE.Vector3().subVectors( x2, x1 ).divideScalar( 2 ).add(x1); 
		html[0].userData.elem.pos = posLabel;	
		html[0].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
		html[0].textContent = Math.round(sizeX * 100) / 100 + '';
		html[0].userData.elem.rot = -rotY;
		upPosLabels_2({elem: html[0]});


		var dir = new THREE.Vector3().subVectors( z2, z1 );
		var rotY = Math.atan2(dir.x, dir.z);		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }
		
		var posLabel = new THREE.Vector3().subVectors( z2, z1 ).divideScalar( 2 ).add(z1); 
		html[1].userData.elem.pos = posLabel;	
		html[1].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
		html[1].textContent = Math.round(sizeZ * 100) / 100 + '';
		html[1].userData.elem.rot = -rotY;
		upPosLabels_2({elem: html[1]});		
	}
	
	
	// box1 
	{
		var v = [];
		v[0] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z) );	// bottom-left
		v[1] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z) );	// bottom-right
		v[2] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.min.z) );	// top-left
		v[3] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.min.z) );	// top-right	
		
		var box1 = infProject.svg.furn.box1;
		
		if(camera == cameraTop) { showElementSvg([box1]); }	
		
		updateSvgPath({el: box1, arrP: [v[0], v[1], v[3], v[2], v[0]]});		
	}
	
	
	
	// точки масштабирования 
	if(cdm.boxCircle)
	{
		var circle = infProject.svg.furn.boxCircle.elem;
		
		if(infProject.svg.furn.boxCircle.show && camera == cameraTop) { showElementSvg(circle); }
		
		// circle[0] top-left
		// circle[1] top-center
		// circle[2] top-right
		
		// circle[3] bottom-left
		// circle[4] bottom-center
		// circle[5] bottom-right		
		
		// circle[6] left-center
		// circle[7] right-center		
		
		// top
		updateSvgCircle({el: circle[0], pos: v[2]});
		updateSvgCircle({el: circle[1], pos: new THREE.Vector3().subVectors( v[3], v[2] ).divideScalar( 2 ).add(v[2])});
		updateSvgCircle({el: circle[2], pos: v[3]});
		
		// bottom
		updateSvgCircle({el: circle[3], pos: v[0]});
		updateSvgCircle({el: circle[4], pos: new THREE.Vector3().subVectors( v[1], v[0] ).divideScalar( 2 ).add(v[0])});
		updateSvgCircle({el: circle[5], pos: v[1]});		
		
		// left	center
		updateSvgCircle({el: circle[6], pos: new THREE.Vector3().subVectors( v[2], v[0] ).divideScalar( 2 ).add(v[0])});
		
		// right center
		updateSvgCircle({el: circle[7], pos: new THREE.Vector3().subVectors( v[3], v[1] ).divideScalar( 2 ).add(v[1])});		
	}	


	
	// box2 (внешний прямоугольник, который НЕ поворачивается)
	{
		var bound = { min : { x : 999999, z : 999999 }, max : { x : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}			
		
		
		var box2 = infProject.svg.furn.box2;
		
		var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	// top-left
		var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	// top-right		
		var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	// bottom-right				
		var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	// bottom-left		
		
		if(camera == cameraTop) { showElementSvg([box2]); }
		
		updateSvgPath({el: box2, arrP: [p1, p2, p3, p4, p1]});	
	}
	
	
	// определяем к какой комнате относится объект и показываем расстояние до стен и до объектов
	{
		var floor = null;
		
		for ( var i = 0; i < infProject.scene.array.floor.length; i++ )
		{
			var ray = new THREE.Raycaster();
			ray.set( new THREE.Vector3(obj.position.x, 1, obj.position.z), new THREE.Vector3(0, -1, 0) );
			
			var intersects = ray.intersectObject( infProject.scene.array.floor[i] );	
			
			if(intersects[0]) { floor = intersects[0].object; break; }							
		}
		
	
		// объект находится в помещении 
		if(floor)
		{	
			if(cdm.getObjRoom)
			{
				var arrO = getAllObjRoom({ignoreObj: obj, floor: floor});		// находим все объекты, которые принадлежат этой комнате	
				infProject.calc.boxScale2D.arrO = arrO;				
			}
			else
			{
				var arrO = infProject.calc.boxScale2D.arrO;
			}
			
			var arrN = [];
			
			var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	// top-left
			var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	// top-right		
			var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	// bottom-right				
			var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	// bottom-left				

			
			var posTop = new THREE.Vector3().subVectors( p2, p1 ).divideScalar( 2 ).add(p1); 
			var posBottom = new THREE.Vector3().subVectors( p3, p4 ).divideScalar( 2 ).add(p4);
			var posLeft = new THREE.Vector3().subVectors( p1, p4 ).divideScalar( 2 ).add(p4);
			var posRight = new THREE.Vector3().subVectors( p2, p3 ).divideScalar( 2 ).add(p3);
			
			var offsetLine = infProject.svg.furn.offset.elem;
			var offsetLabel = infProject.html.furn.offset;
			
			var contour = floor.userData.room.contour;
			
			var arr = [];
			
			arr[0] = {line: offsetLine[0], posStart: posTop, dir: new THREE.Vector3(0,0,-1), html: offsetLabel[0]};
			arr[1] = {line: offsetLine[1], posStart: posBottom, dir: new THREE.Vector3(0,0,1), html: offsetLabel[1]};
			arr[2] = {line: offsetLine[2], posStart: posLeft, dir: new THREE.Vector3(-1,0,0), html: offsetLabel[2]};
			arr[3] = {line: offsetLine[3], posStart: posRight, dir: new THREE.Vector3(1,0,0), html: offsetLabel[3]};
			
			var pos3 = new THREE.Vector3();
			
			for ( var n = 0; n < arr.length; n++ )
			{
				
				var dir = arr[n].dir;
				var posStart = arr[n].posStart;
				var line = arr[n].line;
				var html = arr[n].html;
				
				hideElementSvg([line]);
				hideElementHtml([html]);
				
				
				var min = 9999999;
				var pos2 = null;
				var posIntr = null;
				
				for ( var i = 0; i < contour.length; i++ )
				{
					var i2 = (contour.length - 1 == i) ? 0 : i+1;

					// находим точку пересечения
					var res = crossPointTwoLine_3(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
					
					if(!res[1])	// не параллельны 
					{
						var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
						
						// пересекаются ли линии
						if(CrossLine(posStart, posEnd, contour[i], contour[i2])) 
						{	
							var dist = res[0].distanceTo(posStart);
							
							if(min > dist)
							{
								pos2 = res[0];
								
								min = dist;
							}
						}
					}				
				}
				
				// объект находится в комнате, но не нашел ближайшую стену, занчит он находится в стене
				// находим ближайшую стену в противоположном направлении и получаем точку пересечения
				if(!pos2)
				{
					for ( var i = 0; i < contour.length; i++ )
					{
						var i2 = (contour.length - 1 == i) ? 0 : i+1;

						// находим точку пересечения
						var res = crossPointTwoLine_3(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
						
						if(!res[1])	// не параллельны 
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, -0.1) );
							
							// пересекаются ли линии
							if(CrossLine(posStart, posEnd, contour[i], contour[i2])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
					}

				}
				
				// смотрим есть ли объекты в комнате которые находятся по близости
				for ( var i = 0; i < arrO.length; i++ )
				{
					var v = arrO[i].v;
					
					for ( var i2 = 0; i2 < v.length; i2++ )
					{
						var i3 = (v.length - 1 == i2) ? 0 : i2+1;
						
						
						// находим точку пересечения
						var res = crossPointTwoLine_3(posStart, posStart.clone().add(dir), v[i2], v[i3]);								
						
						if(!res[1])	// не параллельны 
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
	
							// пересекаются ли линии
							if(CrossLine(posStart, posEnd, v[i2], v[i3])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
						
					}
				}


				// если можно провести прямую до стен/объектов, то показываем линию и размер, иначе скрываем
				if(pos2)
				{
					if(infProject.svg.furn.offset.show && camera == cameraTop)
					{
						showElementSvg([line]);					
						showElementHtml([html]);
					}
					updateSvgLine({el: line, point: [posStart, pos2]});
					
					var posLabel = new THREE.Vector3().subVectors( pos2, posStart ).divideScalar( 2 ).add(posStart); 
					html.userData.elem.pos = posLabel;					
					
					var dist = pos2.distanceTo(posStart);
					html.style.transform = 'translate(-50%, -50%)';
					html.textContent = Math.round(dist * 100) / 100 + '';
					
					upPosLabels_2({elem: html});
					
					
					// приклеивание к стенам/объектам
					if(dist < 0.1)
					{   
						pos3.add(pos2.clone().sub(posStart));
						arrN[arrN.length] = n;						
					}
					
				}
			}
			
			// произошло смщение 
			if(arrN.length > 0)
			{ 
					
				for ( var j = 0; j < arrN.length; j++ )
				{
					var num = arrN[j]; 
					
					//var pos3 = new THREE.Vector3().subVectors( pos2, posStart ); 
					var x1 = 0;
					var y1 = 0;
					
					var offsetLine = infProject.svg.furn.offset.elem;
		
					if(num==0 || num==1) 
					{
						var y1 = offsetLine[num].y2.baseVal.value - offsetLine[num].y1.baseVal.value;
						
						offsetLine[0].y1.baseVal.value += y1;
						offsetLine[1].y1.baseVal.value += y1;
						
						offsetLine[2].y1.baseVal.value += y1;
						offsetLine[2].y2.baseVal.value += y1;

						offsetLine[3].y1.baseVal.value += y1;
						offsetLine[3].y2.baseVal.value += y1;							
					}						
					else if(num==2 || num==3) 
					{
						var x1 = offsetLine[num].x2.baseVal.value - offsetLine[num].x1.baseVal.value;
						
						offsetLine[0].x1.baseVal.value += x1;
						offsetLine[0].x2.baseVal.value += x1;
						
						offsetLine[1].x1.baseVal.value += x1;
						offsetLine[1].x2.baseVal.value += x1;							

						offsetLine[2].x1.baseVal.value += x1;
						offsetLine[3].x1.baseVal.value += x1;
					}
					
					var lineSize = infProject.svg.furn.size.elem;
					lineSize[0].x1.baseVal.value += x1;
					lineSize[0].y1.baseVal.value += y1;					
					lineSize[0].x2.baseVal.value += x1;
					lineSize[0].y2.baseVal.value += y1;
					
					lineSize[1].x1.baseVal.value += x1;
					lineSize[1].y1.baseVal.value += y1;					
					lineSize[1].x2.baseVal.value += x1;
					lineSize[1].y2.baseVal.value += y1;					
						
					var circle = infProject.svg.furn.boxCircle.elem;
					
					for ( var i = 0; i < circle.length; i++ )
					{
						circle[i].cx.baseVal.value += x1;
						circle[i].cy.baseVal.value += y1;
					}					
					
					var box1 = infProject.svg.furn.box1;
					
					var path = 'M';
					for ( var i = 0; i < box1.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+',';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box1.setAttribute("d", path);
					
					
					var box2 = infProject.svg.furn.box2;
					
					var path = 'M';
					for ( var i = 0; i < box2.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box2.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+', ';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box2.setAttribute("d", path);						
				}
				
				
				// sizeLabel
				{
					upSvgLinePosScene({el: infProject.svg.furn.size.elem});
					
					var sizeLine = infProject.svg.furn.size.elem;
					var sizeLabel = infProject.html.furn.size;					
					
					for ( var i = 0; i < sizeLabel.length; i++ )
					{
						var p = sizeLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						sizeLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						sizeLabel[i].style.transform = 'translate(-50%, -50%)';
						sizeLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						upPosLabels_2({elem: sizeLabel[i]});

						if(dist < 0.01)
						{
							hideElementHtml([sizeLabel[i]]);
						}
					}									
				}
				
				
				// offsetLabel
				{
					upSvgLinePosScene({el: infProject.svg.furn.offset.elem});
					
					var offsetLine = infProject.svg.furn.offset.elem;
					var offsetLabel = infProject.html.furn.offset;
					
					for ( var i = 0; i < offsetLabel.length; i++ )
					{
						var p = offsetLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						offsetLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						offsetLabel[i].style.transform = 'translate(-50%, -50%)';
						offsetLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						upPosLabels_2({elem: offsetLabel[i]});

						if(dist < 0.01)
						{
							hideElementHtml([offsetLabel[i]]);
						}
					}
				}
				
				// смещение 3D объекта
				{
					//console.log(posCenter);
					
					obj.position.x += pos3.x;
					obj.position.z += pos3.z;
		

					infProject.tools.pivot.position.x += pos3.x;
					infProject.tools.pivot.position.z += pos3.z;					
					infProject.tools.gizmo.position.x += pos3.x;
					infProject.tools.gizmo.position.z += pos3.z;
				}
				
			}							
		}
		else
		{
			hideElementSvg(infProject.svg.furn.offset.elem);
			hideElementHtml(infProject.html.furn.offset);
		}
		
	}
}



// при перемещении объекта в 2D, когда показан boxScale2D, смещаем svg на заданное значение
function offsetSvgSizeObj(cdm)
{
	var offset_2D = new THREE.Vector2();
	var offset_3D = new THREE.Vector3();
	
	if(infProject.calc.boxScale2D.pos2D)
	{
		offset_2D = new THREE.Vector2().subVectors( cdm.setPos.pos2D, infProject.calc.boxScale2D.pos2D );
		offset_3D = new THREE.Vector3().subVectors( cdm.setPos.pos3D, infProject.calc.boxScale2D.pos3D );
	}
	
	infProject.calc.boxScale2D.pos2D = cdm.setPos.pos2D;
	infProject.calc.boxScale2D.pos3D = cdm.setPos.pos3D;
			
	
	{					
		var x1 = offset_2D.x;
		var y1 = offset_2D.y;
		
		//console.log(x1, y1);
		
		var offsetLine = infProject.svg.furn.offset.elem;

		for ( var i = 0; i < offsetLine.length; i++ )
		{
			offsetLine[i].x1.baseVal.value += x1;
			offsetLine[i].x2.baseVal.value += x1;				
			offsetLine[i].y1.baseVal.value += y1;
			offsetLine[i].y2.baseVal.value += y1;						
		}

		
		var lineSize = infProject.svg.furn.size.elem;
		
		for ( var i = 0; i < lineSize.length; i++ )
		{
			lineSize[i].x1.baseVal.value += x1;
			lineSize[i].y1.baseVal.value += y1;					
			lineSize[i].x2.baseVal.value += x1;
			lineSize[i].y2.baseVal.value += y1;				
		}							
			
		var circle = infProject.svg.furn.boxCircle.elem;
		
		for ( var i = 0; i < circle.length; i++ )
		{
			circle[i].cx.baseVal.value += x1;
			circle[i].cy.baseVal.value += y1;
		}
		
		var box1 = infProject.svg.furn.box1;
		
		for ( var i = 0; i < box1.pathSegList.length; i++ )
		{
			box1.pathSegList[i].x += x1;
			box1.pathSegList[i].y += y1;
		}						
		
		var box2 = infProject.svg.furn.box2;
		
		for ( var i = 0; i < box2.pathSegList.length; i++ )
		{
			box2.pathSegList[i].x += x1;
			box2.pathSegList[i].y += y1;
		}


		var offsetLabel = infProject.html.furn.offset;			
		
		for ( var i = 0; i < offsetLabel.length; i++ )
		{
			offsetLabel[i].style.left = offsetLabel[i].offsetLeft + x1 + "px";
			offsetLabel[i].style.top = offsetLabel[i].offsetTop + y1 + "px";
		}

		var sizeLabel = infProject.html.furn.size;			
		
		for ( var i = 0; i < sizeLabel.length; i++ )
		{
			sizeLabel[i].style.left = sizeLabel[i].offsetLeft + x1 + "px";
			sizeLabel[i].style.top = sizeLabel[i].offsetTop + y1 + "px";
		}			
	}		
	
}



// получаем список всех объектов находящихся в этой комнате
function getAllObjRoom(cdm)
{
	//if(!cdm) cdm = {};
	
	var arr = [];	// список объектов, которые принадлежат этой комнате
	
	var floor = cdm.floor;		// помещение в котором ищет объекты
	var obj = (cdm.ignoreObj) ? cdm.ignoreObj : null;	// объект который не должен попать в массив

	
	for ( var i = 0; i < infProject.scene.array.obj.length; i++ )
	{				
		var obj_2 = infProject.scene.array.obj[i];
		
		if(obj_2 == obj) continue;
		
		var ray = new THREE.Raycaster();
		ray.set( new THREE.Vector3(obj_2.position.x, 1, obj_2.position.z), new THREE.Vector3(0, -1, 0) );
		
		var intersects = ray.intersectObject( floor );	
		
		if(intersects[0]) 
		{
			// находим габариты (boundingBox) объекта 		
			{
				var v = [];
				v[0] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.max.z) );	// bottom-left
				v[1] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.max.z) );	// bottom-right
				
				v[2] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.min.z) );	// top-right
				v[3] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.min.z) );	// top-left				
			}

			arr[arr.length] = { o: obj_2, v: v };
		}					
	}


	return arr;
}



// меняем ширину/длину/высоту объекта через input
function inputScaleObjPop(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return; 
	
 	
	obj.geometry.computeBoundingBox();
	var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
	var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y));
	var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));
	// поправка на масштаб объекта
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z;		


	var x2 = $('[nameId="size-obj-length"]').val();
	var y2 = $('[nameId="size-obj-height"]').val();
	var z2 = $('[nameId="size-obj-width"]').val(); 

	x2 = x2.replace(",", ".");
	y2 = y2.replace(",", ".");
	z2 = z2.replace(",", ".");	
	
	x2 = (!isNumeric(x2)) ? x : Number(x2);
	y2 = (!isNumeric(y2)) ? y : Number(y2);
	z2 = (!isNumeric(z2)) ? z : Number(z2);		

	
	//var limit = obj.userData.obj3D.sizeMinMaxLimit;
	
	if(!limit)
	{		
		var limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };				
	}
	
	if(x2 < limit.x_min) { x2 = limit.x_min; }
	else if(x2 > limit.x_max) { x2 = limit.x_max; }
	
	if(y2 < limit.y_min) { y2 = limit.y_min; }
	else if(y2 > limit.y_max) { y2 = limit.y_max; }

	if(z2 < limit.z_min) { z2 = limit.z_min; }
	else if(z2 > limit.z_max) { z2 = limit.z_max; }			
	
	
	var box = obj.userData.obj3D.box; 
	 
	obj.scale.set(x2/box.x, y2/box.y, z2/box.z);	
	obj.updateMatrixWorld();
	
	if(camera == cameraTop)
	{
		showSvgSizeObj({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	}
	
	uiInfoObj({obj: obj});
	
	renderCamera();
}

