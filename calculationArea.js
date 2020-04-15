

// подсчитываем площадь стены
function calculationSpaceWall( wall, index ) 
{
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	var h = v[1].y;	
	
	if(index == 1)
	{
		var x = v[v.length - 6].x - v[0].x;
	}
	else if(index == 2)
	{
		var x = v[v.length - 2].x - v[4].x;
	}	
	
	var space = Math.round((x * h) * 100) / 100;
	
	var length = x;
	var spaceArrO = 0;
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var v = wall.userData.wall.arrO[i].geometry.vertices;
		var h = v[1].y;
		var x = Math.abs(v[0].x * 2);
		spaceArrO += Math.round((x * h) * 100) / 100;
	}
	
	space = space - spaceArrO;	
	
	return { area : space, length : length }; 
}
 

 



// считаем и показываем длину стены
function upLabelPlan_1(arrWall, Zoom)
{
	for ( var i = 0; i < arrWall.length; i ++ )
	{
		var wall = arrWall[i];		
		
		if(Zoom) { var v = wall.userData.wall.v; }		// если это zoom, то берем старые значения	
		else { var v = wall.geometry.vertices; }
		
		if(wall.userData.wall.html.label)
		{
			var d1 = Math.abs( v[6].x - v[0].x );		
			var d2 = Math.abs( v[10].x - v[4].x );

			wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100;
			wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100;			
	
			 
			var p1 = wall.userData.wall.p[0].position;
			var p2 = wall.userData.wall.p[1].position;			 
			var dir = new THREE.Vector3().subVectors( p2, p1 );
			var rotY = Math.atan2(dir.x, dir.z);
			var pos = dir.divideScalar ( 2 ).add( p1 );
			
			if(rotY <= 0.001){ rotY += Math.PI / 2;  }
			else { rotY -= Math.PI / 2; }
			
			
			var x1 = p2.z - p1.z;
			var z1 = p1.x - p2.x;		 		 
			 
			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - 0.08 );
			var pos1 = new THREE.Vector3().addVectors( pos, dir );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + 0.08 );
			var pos2 = new THREE.Vector3().addVectors( pos, dir );
		 
			wall.userData.wall.html.label[0].userData.elem.pos = pos1;
			wall.userData.wall.html.label[1].userData.elem.pos = pos2;
			wall.userData.wall.html.label[0].userData.elem.rot = -rotY;
			wall.userData.wall.html.label[1].userData.elem.rot = -rotY;
			
			wall.userData.wall.html.label[0].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			wall.userData.wall.html.label[1].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			
			upPosLabels_2({elem: wall.userData.wall.html.label[0]});
			upPosLabels_2({elem: wall.userData.wall.html.label[1]});
			//console.log(wall.userData.wall.html.label[0], wall.userData.wall.html.label[0].style.transform);  
		 
		}

		if(!Zoom)	// если это не zoom, то обновляем значения
		{
			var v = wall.geometry.vertices; 
			wall.geometry.verticesNeedUpdate = true;
			
			for ( var i2 = 0; i2 < v.length; i2++ ) { wall.userData.wall.v[i2] = v[i2].clone(); }	// обновляем vertices		
		}
	}
	
}



function getCalcWall(cdm)
{
	var wall = cdm.wall;		
	var v = wall.userData.wall.v;
	//var v = wall.geometry.vertices;
	var d1 = Math.abs( v[6].x - v[0].x );		
	var d2 = Math.abs( v[10].x - v[4].x );

	if(wall.userData.wall.html.label)
	{
		wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100;
		wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100;
					
		upPosLabels_2({elem: wall.userData.wall.html.label[0]});
		upPosLabels_2({elem: wall.userData.wall.html.label[1]});
	}	
}



//площадь помещения ( номер зон получаем из массива )
function getYardageSpace( room ) 
{	 
	if(!infProject.settings.floor.o) { return; }	
	
	var contour = [];	// положение точек переметра комнаты
	
	for (var u = 0; u < room.length; u++)
	{  
		var arrW = room[u].userData.room.w; 
		var arrP = room[u].userData.room.p;  
		var arrS = room[u].userData.room.s;
		var n = room[u].userData.room.w.length;
		var res = 0;
		
		contour[u] = [];
		
		if(infProject.settings.floor.areaPoint == 'inside')
		{
			for (var i = 0; i < n; i++) { arrW[i].updateMatrixWorld(); }
			
			for (var i = 0; i < n; i++) 
			{
				var ch = (arrS[i] == 0) ? 4 : 6;				
				var p1 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );						
				
				if (i == 0) 
				{
					var num2 = n-1;
					var num3 = i+1;
				}
				else if (i == n-1)
				{
					var num2 = i-1;
					var num3 = 0;					
				}
				else
				{
					var num2 = i-1;
					var num3 = i+1;					
				}
				
				var ch1 = (arrS[ num2 ] == 0) ? 4 : 6;
				var ch2 = (arrS[ num3 ] == 0) ? 4 : 6;
				
				var p2 = arrW[num2].localToWorld( arrW[num2].userData.wall.v[ ch1 ].clone() );
				var p3 = arrW[num3].localToWorld( arrW[num3].userData.wall.v[ ch2 ].clone() );							

				contour[u][contour[u].length] = p1;
				
				var ch = (arrS[i] == 0) ? 10 : 0;					
				var p4 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );	
				
				// если первая и вторая не имеют точки соприкосновения. значит у них разные ширина
				// тогда высчитваем конец первой стены и добавляем эту точку в массив
				if(!comparePos(p3, p4, {kof: 0.001}))
				{					
					contour[u][contour[u].length] = p4;
				}
			}
		}
		else
		{
			for (i = 0; i < arrW.length; i++)
			{
				var p1 = (arrS[i] == 0) ? arrW[i].userData.wall.p[0].position : arrW[i].userData.wall.p[1].position;	
				
				if (i == 0) 
				{
					var p2 = (arrS[ n-1 ] == 0) ? arrW[n-1].userData.wall.p[0].position : arrW[n-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position;						
				}
				else if (i == n-1) 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position;
					var p3 = (arrS[ 0 ] == 0) ? arrW[0].userData.wall.p[0].position : arrW[0].userData.wall.p[1].position;								
				}
				else 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position; 						
				}
				
				contour[u][contour[u].length] = p1;				
			}			
		}
		
		room[u].userData.room.contour = contour[u];

		for (i = 0; i < contour[u].length; i++)
		{
			if (i == 0) 
			{
				var num2 = contour[u].length - 1;
				var num3 = i+1;
			}
			else if (i == contour[u].length - 1)
			{
				var num2 = i-1;
				var num3 = 0;					
			}
			else
			{
				var num2 = i-1;
				var num3 = i+1;					
			}
			
			var p1 = contour[u][i];
			var p3 = contour[u][num2];
			var p2 = contour[u][num3];
			
			var sum = p1.x*(p2.z - p3.z); 
			sum = Math.round(sum * 100) * 10;
			res += sum;				
		}
		
		res = Math.abs( res ) / 2;
		res = Math.round(res / 10) / 100;	
		
		room[u].updateMatrixWorld();
		room[u].geometry.computeBoundingSphere();
		var pos = room[u].localToWorld( room[u].geometry.boundingSphere.center.clone() );
					
		
		room[u].userData.room.areaTxt = res;
		
		if(res < 0.5) { res = ''; }
		
		if(infProject.settings.floor.label.visible) 
		{		
			var elem = room[u].userData.room.html.label;
			
			elem.userData.elem.pos = new THREE.Vector3(pos.x, 0.2, pos.z);			
			elem.style.transform = 'translate(-50%, -50%) rotate(0deg)';
			
			upPosLabels_2({elem: elem});						
		}
	}

	return contour;
}



//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
function checkClockWise( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
	{
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	res = Math.round(res * 10) / 10;
	
	return res;
}





 


