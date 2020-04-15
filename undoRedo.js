





 

function assignArrUR( o, ur )
{
	
	if(ur == 'down')
	{
		if(infProject.ur.back.length - 1 > infProject.ur.count)
		{
			var d = infProject.ur.back.length - (infProject.ur.count + 1);  
			infProject.ur.back.splice(infProject.ur.count + 1, d);  		
		}		
		
		infProject.ur.count += 1; 
		infProject.ur.back[infProject.ur.count] = o; 
		console.log('Undo', infProject.ur.back[infProject.ur.count]);
	}
	else if(ur == 'up')
	{ 
		infProject.ur.forward[infProject.ur.count] = o;
		console.log('Redo', infProject.ur.forward[infProject.ur.count]);
	}		
}



// перемещение popObj
function getInfoEvent23(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'objPop_move' };

	ar.id = obj.userData.id;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone();
	
	assignArrUR( ar, 'down' );
	
	
	var ar = { cdm : 'objPop_move' };
	
	ar.id = obj.userData.id;
	ar.pos = obj.position.clone();
	ar.q = obj.quaternion.clone(); 

	assignArrUR( ar, 'up' );
}



// удаление Obj
function getInfoEvent24(cdm)
{
	var arr = cdm.arr;
	
	var inf = { cdm: 'delete_obj', arr: [] };

	for(var i = 0; i < arr.length; i++)
	{
		inf.arr[i] = {};
		inf.arr[i].id = arr[i].userData.id;
		inf.arr[i].lotid = arr[i].userData.obj3D.lotid;
		inf.arr[i].pos = arr[i].position.clone();
		inf.arr[i].q = arr[i].quaternion.clone(); 	
	}
	
	assignArrUR( inf, 'down' );
	
	
	var inf = { cdm: 'delete_obj', arr: [] };

	for(var i = 0; i < arr.length; i++)
	{
		inf.arr[i] = {};
		inf.arr[i].id = arr[i].userData.id; 
	}
	
	assignArrUR( inf, 'up' );
}



// добавили объект в сцену
function getInfoEvent25(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'add_objPop' };
	
	ar.id = obj.userData.id;

	assignArrUR( ar, 'down' );
	
	
	
	var ar = { cdm : 'add_objPop' };

	ar.id = obj.userData.id;
	ar.lotid = obj.userData.obj3D.lotid;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone(); 
	
	assignArrUR( ar, 'up' );
}






// восстанавливаем 
function setInfoEvent1( cdm )
{		  
	var n = (cdm == 'redo') ? infProject.ur.count + 1 : infProject.ur.count;	
	
	if(n < 0 | n > (infProject.ur.back.length - 1)){ return; }
	
	infProject.ur.count = n; 
	
	deActiveSelected();
	
	
	if(infProject.ur.back[n].cdm == 'objPop_move'){ setInfoEvent23(cdm); }
	else if(infProject.ur.back[n].cdm == 'delete_obj'){ setInfoEvent24(cdm); }
	else if(infProject.ur.back[n].cdm == 'add_objPop'){ setInfoEvent25(cdm); }
	
		
	if(cdm == 'undo') { console.log('undo', infProject.ur.back[infProject.ur.count]); }			// удаляем окно/дверь
	else if(cdm == 'redo') { console.log('redo', infProject.ur.forward[infProject.ur.count]); }		// восстанавливаем окно/дверь				
	
	if(cdm == 'undo'){ infProject.ur.count -= 1; }		
}




// восстанавливаем положение объекта 
function setInfoEvent23(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }			// восстанавливаем положение до переноса
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		// восстанавливаем положение после переноса		
	
	var obj = findObjFromId( 'obj', ar.id ); 		
	
	obj.userData.obj3D.ur.pos = ar.pos;
	obj.userData.obj3D.ur.q = ar.q;
	
	obj.position.copy(ar.pos);
	obj.quaternion.copy(ar.q);
	
	renderCamera();
}



// восстанавливаем popObj, после того как мы его удалили 
function setInfoEvent24(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var inf = infProject.ur.back[n]; }				// до undo/redo  (восстанавливаем)
	else if(cdm == 'redo') { var inf = infProject.ur.forward[n]; }		// после undo/redo	(удаляем)
	
	
	if(cdm == 'undo')	
	{ 		
		for(var i = 0; i < inf.arr.length; i++)
		{
			loadObjServer({id: inf.arr[i].id, lotid: inf.arr[i].lotid, pos: inf.arr[i].pos, q: inf.arr[i].q});
		}
	}
	else if(cdm == 'redo')	
	{ 
		for(var i = 0; i < inf.arr.length; i++)
		{
			deleteObjectPop({obj: findObjFromId( 'obj', inf.arr[i].id ), undoRedo: false});
		}		
	}	
	
	renderCamera();
}



// удаляем popObj, после того как мы его добавили в сцену
function setInfoEvent25(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }				// удаляем popObj
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		// восстанавливаем	popObj
	
	
	if(cdm == 'undo')	
	{ 				
		deleteObjectPop({obj: findObjFromId( 'obj', ar.id ), undoRedo: false});
	}
	else if(cdm == 'redo')	
	{ 
		loadObjServer({id: ar.id, lotid: ar.lotid, pos: ar.pos, q: ar.q});
	}
	
	renderCamera();
}







