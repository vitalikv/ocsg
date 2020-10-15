
var containerF = document.getElementById( 'canvasFrame' );
//var containerF = document;


var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );


//renderer.gammaInput = true;
//renderer.gammaOutput = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
//renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( containerF.clientWidth, containerF.clientHeight );
//renderer.setClearColor (0xffffff, 1);
//renderer.setClearColor (0x9c9c9c, 1);
containerF.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
//scene.fog = new THREE.Fog('lightblue', 100, 200);

var aspect = containerF.clientWidth/containerF.clientHeight;
var d = infProject.settings.cam2D;

//----------- cameraTop
var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.zoom = infProject.settings.camera.zoom;
cameraTop.updateMatrixWorld();
cameraTop.updateProjectionMatrix();
cameraTop.userData.camera = { save: { pos: cameraTop.position.clone(), zoom: cameraTop.zoom } };
//----------- cameraTop


//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 65, containerF.clientWidth / containerF.clientHeight, 0.01, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type: 'fly', height: camera3D.position.y, startProject: true };
camera3D.userData.camera.click = { pos: new THREE.Vector3() };
camera3D.userData.camera.save = {}; 
camera3D.userData.camera.save.pos = camera3D.position.clone();
camera3D.userData.camera.save.radius = 0;
//----------- camera3D




//----------- cameraWall
var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2;
//----------- cameraWall





var cube = new THREE.Mesh( createGeometryCube(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );
//scene.add( cube ); 




//----------- render
function animate() 
{
	requestAnimationFrame( animate );	

	cameraZoomTopLoop();	
	moveCameraToNewPosition();
	
	updateKeyDown();
}


function renderCamera()
{
	camera.updateMatrixWorld();	
	upPosLabels_1();
	composer.render();
}
//----------- render


//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = containerF.clientWidth / containerF.clientHeight;
	var d = infProject.settings.cam2D;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	cameraWall.left = -d * aspect;
	cameraWall.right = d * aspect;
	cameraWall.top = d;
	cameraWall.bottom = -d;
	cameraWall.updateProjectionMatrix();
	
	renderer.setSize(containerF.clientWidth, containerF.clientHeight);
	upPosLabels_1({resize: true});
	
	renderCamera();
}
//----------- onWindowResize





//----------- start


var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;

var kof_rd = 1;

var countId = 2;
var camera = cameraTop;
var obj_point = [];
var room = [];
var ceiling = [];
var arr_obj_3d = [];
var arrWallFront = [];
//var lightMap_1 = new THREE.TextureLoader().load(infProject.path+'img/lightMap_1.png');
var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;
infProject.settings.active = { pg: 'pivot' };
infProject.settings.door = { width: 1, height: 2.2 };
infProject.settings.wind = { width: 1, height: 1, h1: 1.0 };
infProject.settings.room = { type: [] };
infProject.settings.blockKeyCode = false;
infProject.scene.grid = backgroundPlane();
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.block = { key : { scroll : false } };		// блокировка действий/клавишь
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : createCircleSpline() };
infProject.geometry.cone = [createGeometryCone_1({r1: 0.003, r2: 0.03, h: 0.25}), createGeometryCone_1({r1: 0.001, r2: 0.04, h: 0.1})];
infProject.scene.size = { wd_1: {} };	// wd_1 линейки для окон/мебели
infProject.scene.size.wd_1.line = createRulerWin({count : 6, color : 0x616161});	
infProject.html = {};
infProject.html.label = [];	// хранятся все html label
infProject.html.wd = createHtmlLabelWall({count: 6, display: 'none', tag: 'elem_wd_size'});
infProject.html.furn = {};
infProject.html.furn.size = createHtmlLabelWall({count: 2, display: 'none', tag: 'elem_furn_size', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.html.furn.offset = createHtmlLabelWall({count: 4, display: 'none', tag: 'elem_furn_offset', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.svg = {furn: {}};
infProject.svg.arr = []; 	// хранятся все svg
infProject.svg.furn.size = {};
infProject.svg.furn.size.elem = createSvgLine({count: 2, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.size.show = infProject.settings.obj.cam2D.show.size;
infProject.svg.furn.offset = {};
infProject.svg.furn.offset.elem = createSvgLine({count: 4, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.offset.show = infProject.settings.obj.cam2D.show.offset;
infProject.svg.furn.box2 = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color, dasharray: true})[0];
infProject.svg.furn.box1 = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
infProject.svg.furn.boxCircle = {};
infProject.svg.furn.boxCircle.elem = createSvgCircle({count: 8, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.boxCircle.show = infProject.settings.obj.cam2D.show.scale; 
infProject.camera = { d3: { theta: 0, phi: 75 } };
infProject.camera.d3.targetO = createCenterCamObj();
// controllWD контроллеры для изменения ширины/длины wd
infProject.tools = { pivot: createPivot_2(), gizmo: createGizmo360_2(), cutWall: [], point: createToolPoint(), axis: createLineAxis(), controllWD: createControllWD() }; 
infProject.tools.floorPl = createPlaneOutlineFloor();
infProject.catalog = { texture: infoListTexture() }; 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 

// хранятся данные для расчета
infProject.calc = {};
infProject.calc.boxScale2D = {sizeLine: null, boxCircle: null, box1: null, box2: null, offsetLine: null};
infProject.calc.boxScale2D.pos2D = new THREE.Vector2();
infProject.calc.boxScale2D.pos3D = new THREE.Vector3();
infProject.calc.boxScale2D.arrO = [];

infProject.ui = {};
infProject.ui.right_menu = {active: ''};

infProject.ur = {};
infProject.ur.count = -1; 
infProject.ur.back = [];
infProject.ur.forward = [];

//infProject.tools = { selectionBox : null }
infProject.tools.selectionBox = { msdown : false, coords : new THREE.Vector2(), mStart : new THREE.Vector2(), mEnd : new THREE.Vector2(), button : false };
	

console.log(infProject); 
 


var planeMath = createPlaneMath();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  

//----------- Light
{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );
	
	infProject.scene.light.global = {ambient: light, point: lights};
}


var ccc = new THREE.Color().setHex( '0x'+infProject.settings.profile.color );


// outline render
{
	var composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, cameraTop );
	var outlinePass = new THREE.OutlinePass( new THREE.Vector2( containerF.clientWidth, containerF.clientHeight ), scene, cameraTop );	
	
	composer.setSize( containerF.clientWidth, containerF.clientHeight );
	composer.addPass( renderPass );
	composer.addPass( outlinePass );


	if(infProject.settings.shader.saoPass)
	{
		var saoPass = new THREE.SAOPass(scene, camera, true, true);	
		//saoPass.resolution.set(8192, 8192);
		saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		saoPass['params']['saoBias'] = 1;
		saoPass['params']['saoIntensity'] = .05;
		saoPass['params']['saoScale'] = 100;
		saoPass['params']['saoKernelRadius'] = 5;
		saoPass['params']['saoMinResolution'] = 0;
		saoPass['params']['saoBlur'] = true;
		saoPass['params']['saoBlurRadius'] = 8;
		saoPass['params']['saoBlurStdDev'] = 4;
		saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		composer.addPass( saoPass );		
	}
	
	//if(infProject.settings.shader.fxaaPass !== undefined)
	if(1 == 1)	
	{
		var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		fxaaPass.enabled = false;
		
		composer.addPass( fxaaPass ); 	
	}	
	
	
	outlinePass.visibleEdgeColor.set( ccc );
	outlinePass.hiddenEdgeColor.set( ccc );
	outlinePass.edgeStrength = Number( 5 );		// сила/прочность
	outlinePass.edgeThickness = Number( 0.01 );	// толщина

	outlinePass.selectedObjects = [];


	function outlineAddObj( cdm )
	{	
		if(!cdm) cdm = {};
		
		var arr = cdm.arr;	
		
		if(cdm.type == 'hover') { if(clickO.last_obj) { arr.push(clickO.last_obj); } }
		
		outlinePass.selectedObjects = arr;  
	}

	function outlineRemoveObj()
	{
		outlinePass.selectedObjects = [];
	}	
}



// cdm
{	
	startPosCamera3D({radious: infProject.settings.cam3D, theta: 90, phi: 35});		// стартовое положение 3D камеры
	//await addObjInCatalogUI_1();			// наполняем каталог объектов UI
	addTextureInCatalogUI_1();		// наполняем каталог текстур UI
	addTextureInCatalogUI_2();
	//changeRightMenuUI_1({name: 'button_wrap_object'});	// назначаем первоначальную вкладку , которая будет включена	
	changeRightMenuUI_1({name: 'button_wrap_plan'});
	startRightPlaneInput({});

	//getAutoBuildingJson();
	
	assignEventSvgScaleSizeObj({el: infProject.svg.furn.boxCircle.elem}); 
}

//----------- start


if(1==2)
{
	var l1 = createSvgLine({count: 1, x1: 400, y1: 700, x2: 800, y2: 400})[0];
	l1.setAttribute("display", "block");
	var l2 = createSvgLine({count: 1, x1: 800, y1: 400, x2: 600, y2: 200})[0];
	l2.setAttribute("display", "block");

	var dir = new THREE.Vector2(l1.x2.baseVal.value - l1.x1.baseVal.value, -(l1.y2.baseVal.value - l1.y1.baseVal.value)).normalize();

	var rotY = Math.atan2(dir.x, dir.y) - Math.PI/2;


	var pos = new THREE.Vector2(l1.x2.baseVal.value - l1.x1.baseVal.value, -(l1.y2.baseVal.value - l1.y1.baseVal.value));

	var dx = new THREE.Vector2();
	dx.x = pos.x * Math.cos(rotY) - pos.y * Math.sin(rotY);
	dx.y = pos.x * Math.sin(rotY) + pos.y * Math.cos(rotY);

	var l3 = createSvgLine({count: 1, x1: l1.x1.baseVal.value, y1: l1.y1.baseVal.value, x2: dx.x+l1.x1.baseVal.value, y2: -dx.y+l1.y1.baseVal.value})[0];
	l3.setAttribute("display", "block");

	var x1 = l3.x2.baseVal.value - l1.x2.baseVal.value;
	var y1 = l3.y2.baseVal.value - l1.y2.baseVal.value;

	var pos = new THREE.Vector2(l2.x2.baseVal.value - l2.x1.baseVal.value, -(l2.y2.baseVal.value - l2.y1.baseVal.value));

	var dx = new THREE.Vector2();
	dx.x = pos.x * Math.cos(rotY) - pos.y * Math.sin(rotY);
	dx.y = pos.x * Math.sin(rotY) + pos.y * Math.cos(rotY);

	var l4 = createSvgLine({count: 1, x1: l2.x1.baseVal.value + x1, y1: l2.y1.baseVal.value + y1, x2: dx.x+l2.x1.baseVal.value + x1, y2: -dx.y+l2.y1.baseVal.value + y1})[0];
	l4.setAttribute("display", "block");

	console.log(2222, THREE.Math.radToDeg(rotY));
}



if(1==2)
{
	var svgline = createSvgLine({count: 1, x1: 400, y1: 700, x2: 800, y2: 700, display: "block"})[0]; 
	upSvgLinePosScene({el: [svgline]});
	updateSvgLine({el: svgline});

	var svgline2 = createSvgPath({count: 1, arrS: [new THREE.Vector2(420, 710), new THREE.Vector2(400, 700), new THREE.Vector2(420, 690)], stroke_width: "2px", display: "block"})[0];
	upSvgPathPosScene({el: [svgline2]});  

	console.log(55555, svgline);
	console.log(55555, svgline2); 
}


// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
function createCenterCamObj()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.01;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.01;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.0;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.0;
		n++;		
	}	


	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });	
	var obj = new THREE.Mesh( createGeometryCircle(v), material ); 
	obj.userData.tag = '';
	obj.renderOrder = 2;
	obj.visible = false;
	
	var n = 0;
	var v2 = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.01;		
		n++;		
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.01;
		n++;
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.0;
		n++;	
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.0;
		n++;		
	}	
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var obj_2 = new THREE.Mesh( createGeometryCircle(v2), material );
	obj_2.renderOrder = 2;
	
	obj.add( obj_2 );
	scene.add( obj );
	
	upUvs_4( obj );
	
	setTexture({obj: obj, material: { img: infProject.path+"img/walk_1.png" }, repeat: {x: 1.9, y: 1.9}, offset: {x: 0.5, y: 0.5} });	
	
	return obj;
}



function upPosLabels_1(cdm)
{
	if(camera != cameraTop) return;
	
	if(!cdm) cdm = {};
		
	var stop = true;
	if(cameraTop.userData.camera.save.zoom - cameraTop.zoom !== 0) { stop = false; }
	if(cameraTop.userData.camera.save.pos.x - cameraTop.position.x !== 0) { stop = false; }
	else if(cameraTop.userData.camera.save.pos.z - cameraTop.position.z !== 0) { stop = false; }
	else if(cdm.resize) { stop = false; }
	
	if(stop) return;
	
	cameraTop.userData.camera.save.pos = cameraTop.position.clone();
	cameraTop.userData.camera.save.zoom = cameraTop.zoom;
	
	
	for ( var i = 0; i < infProject.html.label.length; i++ )
	{
		var elem = infProject.html.label[i];
		
		if(elem.userData.elem.show)
		{
			if(cameraTop.zoom < 0.7) { elem.style.display = 'none'; }
			else { elem.style.display = 'block'; }			
		}
		else
		{
			continue;
		}
		
		upPosLabels_2({elem: elem});
	}	
	

	for ( var i = 0; i < infProject.svg.arr.length; i++ )
	{
		var svg = infProject.svg.arr[i];
		
		//if(!svg.userData.svg.show) continue;
		
		if(svg.userData.svg.line)
		{
			updateSvgLine({el: svg});
		}
		else if(svg.userData.svg.circle)
		{
			updateSvgCircle({el: svg});
		}
		else if(svg.userData.svg.path)
		{
			updateSvgPath({el: svg});
		}
		else if(svg.userData.svg.arc)
		{
			updateSvgArc({el: svg});
		}		
	}	
}


function upPosLabels_2(cdm) 
{
	var elem = cdm.elem;

	if(elem.style.display == 'none') return;
	
	//camera.updateProjectionMatrix();
	var tempV = elem.userData.elem.pos.clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	//var x = Math.round((0.5 + tempV.x / 2) * (canvas.width / window.devicePixelRatio));
	//var y = Math.round((0.5 - tempV.y / 2) * (canvas.height / window.devicePixelRatio));	
	//elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;		
	
	elem.style.top = `${y}px`;
	elem.style.left = `${x}px`;

	elem.userData.elem.x = x;
	elem.userData.elem.y = y;	
}


  
function sliderSunIntensity(cdm)
{
	if(!cdm) cdm = {};
	
	function Plugin() 
	{ 	
		var block = $('[nameId="panel_catalog_1"]')[0];
		//console.log(99999999, block);
		this.block = block;
		//this.circleMax = block.querySelector('.bl_fd24'); 
		this.circleMin = block.querySelector('.bl_fd31'); 
		this.handle = block.querySelector('[nameId="sun_intensity_handle"]');
		this.text = block.querySelector('[nameId="sun_intensity_div"]');   
		this.value = (cdm.value !== undefined) ? cdm.value : 0.5;
		
		this.init();
	}


	Plugin.prototype.init = function () 
	{	
		var self = this;
		
		$(self.handle).on("mousedown touchstart", function (event) { self.startDrag(event); });
		
		self.update();
	};


	Plugin.prototype.startDrag = function (event) 
	{
		var self = this;
		
		$(self.block).on("mousemove touchmove", function (event) { self.drag(event); });
		$(self.block).on("mouseup touchend", function (event) { self.stopDrag(event); });
		
		$(window).on("mousemove touchmove", function (event) { self.drag(event); });
		$(window).on("mouseup touchend", function (event) { self.stopDrag(event); });	
	};


	Plugin.prototype.stopDrag = function () 
	{
		var self = this;
		
		$(window).off("mousemove mouseup");
		$(self.block).off("mousemove mouseup");	
		
		self.update();
	};


	Plugin.prototype.drag = function (event) 
	{        
		var self = this;  
		var circleMin = $(self.circleMin); 
		
		var pageX = event.pageX;
		var pageY = event.pageY;
		var touches = event.originalEvent.touches;
		
		// Touch device
		if (touches && touches.length === 1) 
		{
			pageX = touches[0].pageX;
			pageY = touches[0].pageY;
		}

		var deltaX = pageX - circleMin.offset().left;

		var width = 200;	//circleMin.width()
		
		if(deltaX < 0) { deltaX = 0; }
		else if(width < deltaX) { deltaX = circleMin.width(); }
		
		  
		self.value = deltaX / width;
		
		this.update();
	};


	Plugin.prototype.update = function () 
	{
		var self = this;
		var circleMin = $(self.circleMin);
		var $handle = $(self.handle);
		var $text = $(self.text);
		
		var width = 200;	//circleMin.width()
		
		var left = (self.value * width) - $handle.width() / 2;
		var top = circleMin.height() / 2 - $handle.height() / 2;
		
		//console.log(777777, self.value, circleMin.width(), left);
			
		$handle.css({ left: left, top: top });					
		
		var val = Math.round(self.value * 100)/100;
		$text.text(val);
		
		var obj = clickO.last_obj;
		
		if(obj)
		{
			if(obj.userData.tag == 'obj')
			{
				if(obj.userData.tag == 'obj')
				{
					if(obj.userData.obj3D.typeGroup == 'light point')
					{
						obj.children[1].intensity = val;						
						renderCamera();
					}
				}
			}
		}
		
	};

	new Plugin();
}


function backgroundPlane()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = infProject.path+'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1000;
			texture.repeat.y = 1000;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
	return planeMath;
}



function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	//var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}





function createGeometryCube(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}




function createGeometryWD(cdm)  
{
	var x = cdm.x;
	var y = cdm.y;
	var z = cdm.z;
	var zC = 0;
	
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var f = 0.9;
	
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x*f,y,z*f),
				new THREE.Vector3(x*f,y,zC*f),
				new THREE.Vector3(x,-y,zC),
				new THREE.Vector3(x,-y,-zC),
				new THREE.Vector3(x*f,y,-zC*f),
				new THREE.Vector3(-x*f,y,-z*f),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


function createGeometryWall(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	if(1==1)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 3;
	geometry.faces[7].materialIndex = 3;
	
	return geometry;
}



function createLineAxis() 
{
	var axis = [];
	
	var geometry = createGeometryCube(0.5, 0.02, 0.02);		
	var v = geometry.vertices;	
	v[3].x = v[2].x = v[5].x = v[4].x = 500;
	v[0].x = v[1].x = v[6].x = v[7].x = -500;	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, depthTest: false, lightMap : lightMap_1 } );
	
	for(var i = 0; i < 2; i++)
	{
		axis[i] = new THREE.Mesh( geometry, material );
		axis[i].renderOrder = 2;
		axis[i].visible = false;
		scene.add( axis[i] );				
	}		
	
	return axis;
}

// vertex для Gizmo
function createGeometryCircle( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}


// линейки для окон/мебели (создается при старте)
// линейки для отображения длины/высоты стены в режиме cameraWall
function createRulerWin(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	var material = new THREE.LineBasicMaterial( mat );
	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( createGeometryCube(1, 0.025, 0.025), material );
		var v = arr[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = -0.5;
		v[3].x = v[2].x = v[5].x = v[4].x = 0.5;
		
		v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
		
		arr[i].geometry.verticesNeedUpdate = true;			
		arr[i].visible = false;	 
		arr[i].renderOrder = 1;
		arr[i].userData = {rulerwd: {cone:[]}};
		scene.add( arr[i] );
		
		for ( var i2 = 0; i2 < cdm.count; i2++ )
		{
			var cone = new THREE.Mesh(infProject.geometry.cone[1], material); 
			cone.visible = false;
			scene.add( cone );	
			
			arr[i].userData.rulerwd.cone[i2] = cone;			
		}
	}
	
	return arr;
}





function createCircleSpline()
{
	var count = 48;
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle);
		circle[i].z = Math.cos(angle);
		//circle[i].y = 0;
	}

	return circle;
}


// создаем Geometry конуса для рулеток
function createGeometryCone_1(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	var r2 = cdm.r2;
	var h = cdm.h;
	var r1 = cdm.r1;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r2 );
		v[n].y = -h;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = -h;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r1 );
		v[n].y = 0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.001;
		n++;		
	}	 
	
	return createGeometryCircle(v);
}


function createToolPoint()
{	
	var n = 0;
	var v = [];
	
	var geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
	
	var obj = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color : 0xcccccc, transparent: true, opacity: 0.5, depthTest: false } ) );
	obj.userData.tag = 'tool_point';
	obj.userData.tool_point = {};
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	//default vertices
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.tool_point.v2 = v2;		
	}	
	
	//upUvs_4( obj )
	return obj;
}




function upUvs_4( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}




function createPoint( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( infProject.tools.point.geometry, infProject.tools.point.material.clone() );
	point.position.copy( pos );		

	point.renderOrder = 1;
	
	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	point.visible = (camera == cameraTop) ? true : false;	
	
	scene.add( point );	
	
	return point;
}


  



function crtW( cdm ) 
{
	var point1 = cdm.p[0];
	var point2 = cdm.p[1];
	var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : infProject.settings.height; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	// default material
	{
		var color = [0x7d7d7d, 0x696969]; 	
		
		if(infProject.settings.wall.color) 
		{  
			if(infProject.settings.wall.color.front) color[0] = infProject.settings.wall.color.front; 
			if(infProject.settings.wall.color.top) color[1] = infProject.settings.wall.color.top; 
		}	
		
		var material = new THREE.MeshPhongMaterial({ color : color[0], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		var materialTop = new THREE.MeshPhongMaterial({ color: color[1], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		
		var material = new THREE.MeshStandardMaterial({ color : color[0], transparent: true, opacity: 1 });
		var materialTop = new THREE.MeshStandardMaterial({ color : color[1], transparent: true, opacity: 1 });
		var materials = [ material.clone(), material.clone(), material.clone(), materialTop ];	
	}
	
	
	var geometry = createGeometryWall(d, height, width, offsetZ);	
	var wall = new THREE.Mesh( geometry, materials ); 
 	infProject.scene.array.wall[infProject.scene.array.wall.length] = wall;		
	
	wall.position.copy( p1 );
	
	// --------------
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = 0;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	wall.userData.wall.area = { top : 0 }; 
	//wall.userData.wall.active = { click: true, hover: true };	
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	wall.userData.wall.html = {};
	
	if(infProject.settings.html.fonts.wall.show)
	{
		wall.userData.wall.html.label = createHtmlLabelWall({count: 2, tag: 'elem_wall_size'});
	}
	
	wall.userData.wall.svg = {};
	wall.userData.wall.svg.lineW = null;
	//wall.userData.wall.svg.lineW = [createSvgLine({count: 1})[0], createSvgLine({count: 1, color: '#00ff00'})[0]];
	//showElementSvg(wall.userData.wall.svg.lineW);
	wall.userData.wall.show = true;
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	// top
	wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	// left
	wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	// right
	wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
	// --------------

	wall.castShadow = true;	
	wall.receiveShadow = true;
	
	upUvs_1( wall );
	
	cdm.material = [];
	cdm.material[0] = { img: infProject.path+"img/load/beton.jpg", index:1 };
	cdm.material[1] = { img: infProject.path+"img/load/beton.jpg", index:2 };
	//console.log('cdm.material', cdm);
	if(cdm.material)
	{  
		for ( var i = 0; i < cdm.material.length; i++ )
		{			
			setTexture({obj: wall, material: cdm.material[i]});
		}	
	}
	
	//console.log(wall);
	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	
	var n = point1.w.length;		
	point1.w[n] = wall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = wall;
	point2.p[n] = point1;
	point2.start[n] = 1;		
	
	scene.add( wall );
		
	return wall;
}



// показываем/скрываем html размеры стен
function showHideLabelSizeWall(cdm) 
{
	if(!cdm) { cdm = {}; }
	
	if(cdm.switch)
	{
		infProject.settings.html.fonts.wall.show = !infProject.settings.html.fonts.wall.show;		
	}
	else if(cdm.show)
	{
		infProject.settings.html.fonts.wall.show = true;
	}
	else if(cdm.hide)
	{
		infProject.settings.html.fonts.wall.show = false;
	}
	else 
	{
		return;
	}
	
	
	var wall = infProject.scene.array.wall;
	
	// удаляем html размеры стен
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		if(wall[i].userData.wall.html.label)
		{
			for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
			{
				//infProject.html.wd[i].style.display = 'none';
				deleteValueFromArrya({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
				wall[i].userData.wall.html.label[i2].remove();
			}
		}					 
	}


	// создаем html размеры стен
	if(infProject.settings.html.fonts.wall.show)
	{
		
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			wall[i].userData.wall.html.label = createHtmlLabelWall({count: 2, tag: 'elem_wall_size'});				
		}
		
		var label = [];
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			if(!wall[i].userData.wall.html.label) continue;
			
			for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
			{
				label[label.length] = wall[i].userData.wall.html.label[i2];  
			}					 
		}
		 
		showElementHtml(label);
		upLabelPlan_1(wall, true);
	}
}


// блокируем/разблокируем клавиатуру 
function blockKeyCode(cdm)
{	
	if(!cdm) { cdm = {}; }
	
	if(cdm.block !== undefined)
	{
		infProject.settings.blockKeyCode = cdm.block;
	}	
}


function getMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	var y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}


function getScreenMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) );
	var y = ( ( event.clientY - containerF.offsetTop ) );	
	
	return new THREE.Vector2(x, y);
}	
	

function rayIntersect( event, obj, t, recursive ) 
{
	mouse = getMousePosition( event );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, recursive ); }
	
	return intersects;
}




// устанавливаем текстуру
function setTexture(cdm)
{
	//if(!cdm.img) return;
	
	var img = cdm.material.img;
	
	if(!img) return;
	
	var material = (cdm.obj.userData.tag == "wall") ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1.0;
			texture.repeat.y = 1.0;	
		}
		
		if(cdm.offset)
		{
			texture.offset.x = cdm.offset.x;
			texture.offset.y = cdm.offset.y;				
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = null;
		material.needsUpdate = true; 


		if(cdm.obj.userData.tag == "wall")
		{
			cdm.obj.userData.material[cdm.material.index].img = img;
			
			if(cdm.ui)
			{
				changeTextureWall_UI_1({obj: cdm.obj});
			}
		}
		
		if(cdm.obj.userData.tag == "room" || cdm.obj.userData.tag == "ceiling")
		{
			cdm.obj.userData.material.img = img;
		}		
		
		renderCamera();
	});			
}





// нажали на кнопку интерфейса, загружаем объект	
function clickButton( event )
{
	if(!clickO.button) return;	
	
	if(camera == cameraTop)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}
	if(camera == cameraWall)
	{
		var dir = camera.getWorldDirection();
		dir.addScalar(-10);
		planeMath.position.copy(camera.position);
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 				
	}
	
	planeMath.updateMatrixWorld();

	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(camera == cameraTop)
	{ 
		if(clickO.button == 'create_wall')
		{
			clickO.obj = null; 
			clickO.last_obj = null;
			
			var point = createPoint( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			clickO.move = point;				
		}
		else if(clickO.button == 'create_wd_2')
		{
			createEmptyFormWD_1({type:'door', lotid: 10});
		}
		else if(clickO.button == 'create_wd_3')
		{
			createEmptyFormWD_1({type:'window', lotid: 11});
		}			
		else if(clickO.button == 'add_lotid')
		{
			loadObjServer({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == camera3D)
	{
		if(clickO.button == 'add_lotid')
		{
			loadObjServer({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == cameraWall)
	{
		if(clickO.button == 'create_wd_3')
		{
			createEmptyFormWD_1({type:'window'});
		}
	}
	
	clickO.buttonAct = clickO.button;
	clickO.button = null;
}	
	

function clickInterface(cdm)
{
	if(clickO.move)
	{
		deActiveSelected();
		mouseDownRight();
	}

	console.log(cdm);
	if(cdm)
	{		
		deActiveSelected();	
		
		if(cdm.button == '2D')
		{  			
			changeCamera(cameraTop);
		}
		else if(cdm.button == '3D')
		{
			changeCamera(camera3D);
		}	
		else if(cdm.button == 'point_1')
		{
			clickO.button = 'create_wall';
		}
		else if(cdm.button == 'create_wd_2')
		{
			clickO.button = 'create_wd_2';
		}
		else if(cdm.button == 'create_wd_3')
		{
			clickO.button = 'create_wd_3';
		}		
		else if(cdm.button == 'add_lotid')
		{
			clickO.button = 'add_lotid';
			clickO.options = cdm.value;
		}					
	}

}	



// декативируем старое выделение (объект и меню)
function deActiveSelected()
{
	clickO.obj = null;
	clickO.rayhit = null;
	
	hideMenuObjUI_2D();		
}




function upUvs_1( obj )
{ 
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {
			return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;	
}





//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math
 


	
	
 
function setUnits()
{
	 
}



// находим стены/точки/объекты по id
function findObjFromId( cdm, id )
{
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	var obj = infProject.scene.array.obj; 
	
	
	if(cdm == 'wall')
	{
		for ( var i = 0; i < wall.length; i++ ){ if(wall[i].userData.id == id){ return wall[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < point.length; i++ ){ if(point[i].userData.id == id){ return point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < floor.length; i++ ){ if(floor[i].userData.id == id){ return floor[i]; } }
	}
	else if(cdm == 'obj')
	{
		for ( var i = 0; i < obj.length; i++ ){ if(obj[i].userData.id == id){ return obj[i]; } }
	}
	
	return null;
}



animate();
renderCamera();



containerF.addEventListener('contextmenu', function(event) { event.preventDefault() });
containerF.addEventListener( 'mousedown', onDocumentMouseDown, false );
containerF.addEventListener( 'mousemove', onDocumentMouseMove, false );
containerF.addEventListener( 'mouseup', onDocumentMouseUp, false );


containerF.addEventListener( 'touchstart', onDocumentMouseDown, false );
containerF.addEventListener( 'touchmove', onDocumentMouseMove, false );
containerF.addEventListener( 'touchend', onDocumentMouseUp, false );

containerF.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
containerF.addEventListener('mousewheel', onDocumentMouseWheel, false);	


document.addEventListener("keydown", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			console.log(infProject.activeInput);
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { inputChangeWall_1({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'size-wd-height') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'rp_wd_h1') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				inputWidthOneWall({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'}); 
			}
			if(infProject.activeInput == 'size-obj-length') { inputScaleObjPop({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-obj-height') { inputScaleObjPop({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-obj-width') { inputScaleObjPop({obj: clickO.last_obj}); }			
		}		
		 
		return; 
	}
	
	if(clickO.keys[18] && e.keyCode == 90) 	// alt + z
	{ 
		exportToGLB();
		return;
	}	


	if(e.keyCode == 46) { detectDeleteObj(); }
	
	if(e.keyCode == 90 && e.ctrlKey || e.keyCode == 90 && e.keyCode == 91) { setInfoEvent1( 'undo' ); }	// ctrl + z
	if(e.keyCode == 89 && e.ctrlKey || e.keyCode == 89 && e.keyCode == 91) { setInfoEvent1( 'redo' ); }	// ctrl + y	
	
	if(clickO.keys[18] && e.keyCode == 90) { loadFile({json: true}); }		// alt + z
	if(clickO.keys[18] && e.keyCode == 72) { disposeHierchy({obj: scene}); getConsoleRendererInfo(); }		// alt + h
	if(clickO.keys[18] && e.keyCode == 77) { loadFile({id: 0}); }				// alt + m
	if(clickO.keys[18] && e.keyCode == 84) { saveFile({json: true}); }			// alt + t
	if(clickO.keys[18] && e.keyCode == 86) { console.log(infProject); }
	if(clickO.keys[18] && e.keyCode == 86) { console.log(clickO); }  		
	if(clickO.keys[18] && e.keyCode == 86) { console.log(renderer.info.memory); }	// alt + v
	if(clickO.keys[18] && e.keyCode == 66) 	// alt + b
	{ 
		if(infProject.settings.shader.saoPass)
		{
			saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
			console.log(saoPass['params']['output']);
			renderCamera();			
		}
	}  
	
	//if(e.keyCode == 56) { showHideLabelSizeWall({switch: true}); }
	//if(e.keyCode == 66) { switchCamera3D(); } 	// b
	//if(e.keyCode == 86) { switchLight({switch: true}); } 	// v
	if(e.keyCode == 89 && !e.ctrlKey) { saveFile({txt: true}); } 			// y
	//if(e.keyCode == 86) { resetScene(); getAutoBuildingJson(); } // v
} );

document.addEventListener("keydown", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	clickO.keys[e.keyCode] = true;
	if(e.keyCode == 61) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 173) { zoomLoop = 'zoomOut'; }
	if(e.keyCode == 187) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 189) { zoomLoop = 'zoomOut'; }	
});

document.addEventListener("keyup", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	clickO.keys[e.keyCode] = false;
	if(e.keyCode == 173) { zoomLoop = ''; }
	if(e.keyCode == 61) { zoomLoop = ''; }
	if(e.keyCode == 187) { zoomLoop = ''; }
	if(e.keyCode == 189) { zoomLoop = ''; }

	if(zoomLoop != '')	{ zoomLoop = ''; }
	
	if(camera == cameraTop)
	{
		if(e.keyCode == 16){ selectionBoxHide(); } 
	}
	
});






// вкл/выкл сглаживание 
function switchFxaaPass(cdm)
{
	if(!cdm) return;	
	if(infProject.settings.shader.fxaaPass == undefined) return;
	
	if(cdm.switch)
	{
		var visible = (fxaaPass.enabled) ? false : true;
	}

	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}		
	
	fxaaPass.enabled = visible;		


	renderCamera();
}


// переключаем глобальное/ламповое освещение 
function switchLight(cdm)
{  
	if(!cdm) return;
	
	if(cdm.switch)
	{
		var type = infProject.settings.light.type;
		type = (type == 'global') ? 'lamp' : 'global';
		infProject.settings.light.type = type;
	}
	
	if(cdm.visible !== undefined)
	{
		var type = (cdm.visible) ? 'global' : 'lamp';
		infProject.settings.light.type = type;
	}	
	
	if(infProject.settings.light.type == 'global')
	{
		var global_intensity = 0.93;
		var global_visible = true;
		var lamp_visible = false;
	}
	else
	{
		var global_intensity = 0.5;
		var global_visible = false;
		var lamp_visible = true;			
	}
	
	for ( var i = 0; i < infProject.scene.light.lamp.length; i++ )
	{
		infProject.scene.light.lamp[i].visible = lamp_visible;
	}
	
	for ( var i = 0; i < infProject.scene.light.global.point.length; i++ )
	{
		infProject.scene.light.global.point[i].visible = global_visible;
	}		
	
	infProject.scene.light.global.ambient.intensity = global_intensity;
	
	renderCamera();
}





// проверяем правильность ввода числа (вводим число в своих единицах, отдаем в метрах)
function checkNumberInput(cdm)
{	
	var value = cdm.value; 
	//var value = value.trim();
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!isNumeric(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } // см
		else if(cdm.unit == 0.001) { value /= 1000; } // мм
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}


// проверяем существует ли функция
function isCheckExsistFunction(functionToCheck)  
{
    var getType = {};
	
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]' || functionToCheck && getType.toString.call(functionToCheck) === '[object AsyncFunction]';
}



var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 	
		 
	 //getAutoBuildingJson();
	 
	if(infProject.settings.load.file)
	{
		loadFile({json: infProject.settings.load.file});
		//loadFile({id: 0});
	}			  
	
});




function exportToGLB()
{
	var arr = [];
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	var obj = infProject.scene.array.obj;
	var floor = infProject.scene.array.floor;
	
	
	for ( var i = 0; i < 0; i++ )
	{ 		
		var userData = {};
		userData.id = point[i].userData.id;
		userData.tag = point[i].userData.tag;		
		point[i].userData = userData;
		
		point[i].geometry = new THREE.BufferGeometry().setFromObject(point[i]);
		point[i].visible = false;
		
		arr[arr.length] = point[i];
	}	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		var userData = {};
		userData.id = wall[i].userData.id;
		userData.tag = wall[i].userData.tag;
		userData.point = [wall[i].userData.wall.p[0].position, wall[i].userData.wall.p[1].position];
		userData.wd = [];
		
		for ( var i2 = 0; i2 < wall[i].userData.wall.arrO.length; i2++ )
		{
			userData.wd[userData.wd.length] = wall[i].userData.wall.arrO[i2].userData.id
		}
		
		var side = {n: 0, id: 0};
		for ( var i2 = 0; i2 < wall[i].userData.wall.room.side2.length; i2++ )
		{
			var side2 = wall[i].userData.wall.room.side2[i2];			
			if(side2) { side.n += 1; side.id = i2; }
		}
		
		if(side.n == 1) { userData.hide = side.id; }				

		//var o = createSideFormWall({obj: wall[i]});		
		wall[i].userData = userData;
		
		//arr[arr.length] = o;
		
		//wall[i].geometry.sortFacesByMaterialIndex();
		//wall[i].geometry = new THREE.BufferGeometry().setFromObject(wall[i]);
		arr[arr.length] = wall[i];
		wall[i].material[0].map = null;
		wall[i].material[1].map = null;
		wall[i].material[2].map = null;
		wall[i].material[3].map = null;
		//wall[i].visible = false;
	}		
	
	for ( var i = 0; i < window.length; i++ )
	{ 
		var userData = {};
		userData.id = window[i].userData.id;
		userData.tag = window[i].userData.tag;		
		window[i].userData = userData;
		
		window[i].material.opacity = 0;
		window[i].material.transparent = true;
		window[i].children[0].material.opacity = 0;
		window[i].children[0].material.transparent = true;

		window[i].geometry = new THREE.BufferGeometry().fromGeometry(window[i].geometry.clone());
		arr[arr.length] = window[i];
	}
	
	for ( var i = 0; i < door.length; i++ )
	{ 
		var userData = {};
		userData.id = door[i].userData.id;
		userData.tag = door[i].userData.tag;
		door[i].userData = userData;
		
		door[i].material.opacity = 0;
		door[i].material.transparent = true;
		door[i].children[0].material.opacity = 0;
		door[i].children[0].material.transparent = true;

		door[i].geometry = new THREE.BufferGeometry().fromGeometry(door[i].geometry.clone());
		arr[arr.length] = door[i];
	}		
	
	for ( var i = 0; i < floor.length; i++ )
	{		
		var userData = {};
		userData.id = floor[i].userData.id;
		userData.tag = floor[i].userData.tag;
		floor[i].userData = userData;
		
		arr[arr.length] = floor[i];
		floor[i].material.map = null;
	}
	
	for ( var i = 0; i < obj.length; i++ )
	{ 
		obj[i].material.opacity = 0;
		obj[i].material.transparent = true;
		
		arr[arr.length] = obj[i];
	}	
	
	var options = 
	{
		trs: true,
		onlyVisible: false,
		truncateDrawRange: true,
		binary: true,
		forceIndices: true,
		forcePowerOfTwoTextures: false,
		maxTextureSize: Number( 20000 ),		
	};

	var exporter = new THREE.GLTFExporter();

	// Parse the input and generate the glTF output
	exporter.parse( arr, function ( gltf ) 
	{
		
		if(1==1)
		{
			var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link );			
			
			if ( gltf instanceof ArrayBuffer ) 
			{ 
				console.log( gltf ); 
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
				link.download = 'file.glb';	
			}
			else
			{
				console.log( gltf );
				var gltf = JSON.stringify( gltf, null, 2 );
				
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'text/plain' } ) );
				link.download = 'file.gltf';
			}

			link.click();			
			
		}
		
	}, options );
	
}


function createSideFormWall(cdm)
{
	var obj = cdm.obj;
	
	var group = {};
	group.side1 = {};
	group.side2 = {};
	group.side3 = {};
	group.side4 = {};
	group.side1.geometry = new THREE.Geometry();
	group.side1.material = obj.material[1].clone();
	group.side2.geometry = new THREE.Geometry();
	group.side2.material = obj.material[2].clone();	
	group.side3.geometry = new THREE.Geometry();
	group.side3.material = obj.material[3].clone();
	group.side4.geometry = new THREE.Geometry();
	group.side4.material = obj.material[0].clone();	
		
	
	for ( var i = 0; i < obj.geometry.vertices.length; i++ )
	{
		group.side1.geometry.vertices.push(obj.geometry.vertices[i]);
		group.side2.geometry.vertices.push(obj.geometry.vertices[i]);
		group.side3.geometry.vertices.push(obj.geometry.vertices[i]);
		group.side4.geometry.vertices.push(obj.geometry.vertices[i]);
	}
	
	for ( var i = 0; i < obj.geometry.faceVertexUvs[0].length; i++ )
	{
		group.side1.geometry.faceVertexUvs[0].push(obj.geometry.faceVertexUvs[0][i]);
		group.side2.geometry.faceVertexUvs[0].push(obj.geometry.faceVertexUvs[0][i]);
		group.side3.geometry.faceVertexUvs[0].push(obj.geometry.faceVertexUvs[0][i]);
		group.side4.geometry.faceVertexUvs[0].push(obj.geometry.faceVertexUvs[0][i]);
	}	
	
	
	for ( var i = 0; i < obj.geometry.faces.length; i++ ) 
	{	
		var id = obj.geometry.faces[i].materialIndex;		

		var face = obj.geometry.faces[i]; 

		if(id == 1) group.side1.geometry.faces.push(face.clone());
		if(id == 2) group.side2.geometry.faces.push(face.clone());
		if(id == 3) group.side3.geometry.faces.push(face.clone());
		if(id == 0) group.side4.geometry.faces.push(face.clone());		
	}
	
	var groupWall = new THREE.Group();
		
	for(var index in group) 
	{ 
		var geometry = new THREE.BufferGeometry().fromGeometry(group[index].geometry);
		
		var faceO = new THREE.Mesh( geometry, group[index].material );
		//faceO.material.transparent = false;
		groupWall.add(faceO);
		
		//faceO.position.copy(obj.position);
		//faceO.rotation.copy(obj.rotation);		
	}
	
		
	groupWall.position.copy(obj.position);
	groupWall.rotation.copy(obj.rotation);	
	scene.add(groupWall);
	
	groupWall.userData = obj.userData;

	console.log(555, groupWall);
	
	return groupWall;	
}









