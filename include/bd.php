<? 
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");




$url = $_SERVER['REQUEST_URI'];

$path = "";
$title = 'Test';
$h1 = '----';
$description = '';
$nameId = '';



$infProject = array('url' => $url, 'title' => $title, 'nameId' => $nameId, 'path' => $path, 'load' => [ img => [] ]);

$infProject['activeInput'] = '';
$infProject['activeInput_2'] = null;
$infProject['activeDiv'] = null;

$infProject['user'] = [];
$infProject['user']['id'] = null;
$infProject['user']['mail'] = null;
$infProject['user']['pass'] = null;

$infProject['settings']['project'] = '';
$infProject['settings']['shader'] = [];
$infProject['settings']['light']['type'] = 'global';
//$infProject['settings']['shader']['saoPass'] = true;
$infProject['settings']['shader']['fxaaPass'] = false;		
$infProject['settings']['height'] = 2.8;
$infProject['settings']['floor'] = [ 'o' => false, 'posY' => 0.0, 'height' => 0.01, 'changeY' => false, 'areaPoint' => 'center' ];
$infProject['settings']['wall'] = [ 'width' => 0.3, 'label' => '', 'dist' => 'center', 'material' => null, 'block' => null ];
$infProject['settings']['land'] = [ 'o' => false ];
$infProject['settings']['unit'] = [ 'wall' => 1, 'floor' => 1 ];
$infProject['settings']['camera'] = [ 'type' => '2d', 'zoom' => 1, 'limitZoom' => 1 ];

$infProject['scene'] = [ 'tool' => [] ];
$infProject['scene']['load'] = '';


	
$infProject['settings']['project'] = 'test';
$infProject['settings']['load']['file'] = 't/fileJson.json';
$infProject['settings']['save']['file'] = 't/fileJson.json';
$infProject['settings']['api']['type']['room'] = 't/list_room_zone.json';
$infProject['settings']['html']['fonts']['wall']['show'] = true;
$infProject['settings']['html']['fonts']['wall']['size'] = 'font-size: 14px;';
$infProject['settings']['html']['fonts']['wall']['type'] = 'font-family: Roboto, sans-serif;';
$infProject['settings']['html']['fonts']['wall']['color'] = 'color: rgba(0,0,0,0.4);';
$infProject['settings']['cam2D'] = 5;
$infProject['settings']['cam3D'] = 15;
$infProject['settings']['floor']['o'] = true;
$infProject['settings']['floor']['areaPoint'] = 'inside';
$infProject['settings']['floor']['label']['visible'] = true;
$infProject['settings']['floor']['label']['type'] = 'zone';
$infProject['settings']['floor']['color'] = 0xF4F4F4;
$infProject['settings']['wall']['label'] = 'double';
$infProject['settings']['wall']['color']['top'] = 0x444444;
$infProject['settings']['wall']['color']['front'] = 0xACACAC;
$infProject['settings']['profile']['color'] = 'ffa217';
$infProject['settings']['svg']['tag'] = 'http://www.w3.org/2000/svg';
$infProject['settings']['svg']['scaleBox']['color'] = '#444444';
$infProject['settings']['obj']['material']['texture'] = '';
$infProject['settings']['obj']['material']['color'] = 0xebebeb;
$infProject['settings']['obj']['cam2D']['show']['size'] = true;
$infProject['settings']['obj']['cam2D']['show']['offset'] = true;
$infProject['settings']['obj']['cam2D']['show']['scale'] = true;

$jsonPhp = json_encode($infProject);



?>