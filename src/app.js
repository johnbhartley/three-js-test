import THREELib from 'three-js';
import Stats from 'stats-js';

'use strict';

const THREE = THREELib();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: true});
const light = new THREE.AmbientLight(0xaaaaaa);
const spot = new THREE.PointLight(0xffffff);

const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];

const indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];


let camera;
let box;
let stats;
let skybox;
let cube;
let poly;
let torus;
let bone;
let skelington;



function initScene() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  document.getElementById('webgl').appendChild(renderer.domElement);

  spot.position.set(0, 300, 200);

  let skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
  let skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
   
  //scene.add(skybox);
  //scene.add(light);
  scene.add(spot);

  camera = new THREE.PerspectiveCamera(
      45, // degrees for FOV
      window.innerWidth / window.innerHeight, // aspect ratio
      1, //near and far values 
      1000,// outside this range is not rendered
    );

  camera.position.z = 100;
  //scene.add( camera );


  // FIRST BOX

  box = new THREE.Mesh(
      new THREE.BoxGeometry(60, 5, 5),
      new THREE.MeshBasicMaterial({color: 0x0000FF})
    );

  scene.add(box)


  // CUBE

  const cubeGeometry = new THREE.CubeGeometry(10, 10, 10); // width, height, depth
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 }); // Lambert's light calculation mesh
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.rotation.y = Math.PI * 45 / 180;

  scene.add(cube);


  // POLYGON

  const polyGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
  const polyMaterial = new THREE.MeshLambertMaterial({ color: 0xFFF000 });
  poly = new THREE.Mesh(polyGeo, polyMaterial);

  scene.add(poly);

  
  

  // TORUS KNOT SON
  
  torus = new THREE.Mesh( 
    new THREE.TorusKnotGeometry( 10, 3, 100, 16 ), 
    new THREE.MeshNormalMaterial( { wireframe: true, wireframeLinewidth: 1 } )
  );
  torus.position.z = -100;
  scene.add(torus);



  // skelington = new THREE.Bone();
  // bone = new THREE.Bone();

  // skelington.add(bone);
  // bone.position.y = 5;

  // scene.add(skelington);





  // SHOW ME DAT SWEET SWEET STAT

  stats = new Stats();
  stats.setMode(0);
  
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '0';
  document.body.appendChild(stats.domElement);

  render();
}



// CONTINUE CALLING YO SELF

function render() {
  torus.position.z += 1;
  box.rotation.y += 1;
  box.rotation.z += 0.01;
  cube.rotation.y += 1;
  cube.rotation.x += 1;
  poly.position.x += 0.01;
  poly.rotation.x += 0.01;
  torus.rotation.z += 0.1;
  //camera.rotation.y += 0.001;
  //camera.position.z += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);

  stats.update();
}



// BEGIN

window.onload = initScene;
