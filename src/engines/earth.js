// The 3D Earth behind the page (three.js). Loads the planet, renders it through a bloom-less composer and ties
// the planet's position to the scroll. Fires 'earth-ready' once the planet and clouds are in; waits for 'boot-done'.
import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {bus} from './bus.js';
import {initScroll} from './scroll.js';

export function startEarth(canvas) {

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis=initScroll({reduce});

const CONFIG={rimColor:'#c1faff',rimPower:2.4,nightLights:10,terrainDepth:0.33,terrainShade:1.3,oceanGlint:0.45,oceanDeep:0.12,oceanFlow:3,oceanFlowSpeed:0.8,oceanFlowScale:2.1,glowColor:'#3a6cff',glowIntensity:3.35,planetRadius:1.95,spin:0.03,initRotation:2.07,tilt:0.37,autoRotate:0,cloud1Height:1.005,cloud1Opacity:0.6,cloud1Spin:0.06,cloud2Height:1.03,cloud2Opacity:0.5,cloud2Spin:0.14,cloud3Height:1.075,cloud3Opacity:0.5,cloud3Spin:0.1,bgColor:'#040a1e',flameColor:'#3a6cff',flameColor2:'#c1faff',flameAmt:0.15,atmoColor:'#9fc4ff',atmoCount:320,atmoSize:22,atmoSpeed:0.8,starColor:'#cfe0ff',starCount:1400,starSize:1.6,starFlicker:1,markerColor:'#ffd27a',markerCount:60,markerSize:16,markerSpeed:0.5};
const PHONE=innerWidth<700||matchMedia('(pointer:coarse)').matches;
// render resolution: starts sharp, and the loop below lowers it step by step if the device can't hold ~50fps
// (phones may go down to 0.75 — the Earth is a soft background, so that's barely visible but much lighter)
const PR=Math.min(devicePixelRatio,PHONE?1.25:1.5),MIN_PR=PHONE?0.75:1;let qPR=PR;
const LAYERS={NONE:0,TORUS_SCENE:1,BLOOM_SCENE:2,ENTIRE_SCENE:3};
const BASE='https://api.getlayers.ai/storage/v1/object/public/public/assets/ascend-d9857ad1f2';
const Lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,l,h)=>Math.min(h,Math.max(l,v));
const hexToVec3=h=>{const c=new THREE.Color(h);return new THREE.Vector3(c.r,c.g,c.b)};
const sample=(s,p)=>{if(p<=s[0].p)return s[0].v;for(let i=1;i<s.length;i++){if(p<=s[i].p){let t=(p-s[i-1].p)/(s[i].p-s[i-1].p);t=t*t*(3-2*t);return Lerp(s[i-1].v,s[i].v,t)}}return s[s.length-1].v};

const SNOISE=`vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

let W=innerWidth,H=innerHeight;
// antialias is off: the scene is drawn through the composer's render targets, which never use the canvas MSAA
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(qPR);renderer.setSize(W,H,false);
renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=false;const dbg={textContent:''};
const setDbg=t=>{dbg.textContent=t};setDbg('loading...');
renderer.debug.onShaderError=(gl,p,vs,fs)=>{const m=(gl.getShaderInfoLog(fs)||gl.getShaderInfoLog(vs)||'').slice(0,300);console.error('Shader compile error',m);setDbg('SHADER ERROR '+m)};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000000);
const camera=new THREE.PerspectiveCamera(40,W/H,0.1,200);camera.position.set(0,0,8);
camera.layers.enable(LAYERS.TORUS_SCENE);camera.layers.enable(LAYERS.BLOOM_SCENE);camera.layers.enable(LAYERS.ENTIRE_SCENE);scene.add(camera);
const amb=new THREE.AmbientLight(0xffffff,1.8);amb.layers.enableAll();scene.add(amb);
const dir=new THREE.DirectionalLight(0xffffff,0.8);dir.position.set(0,10,2);dir.layers.enableAll();scene.add(dir);
const V2=()=>new THREE.Vector2(W,H);

// The torus and bloom layers hold no objects (everything lives on ENTIRE_SCENE), so their composers only
// ever produced black. They are skipped and the final pass samples a black texture instead: same image, far less GPU work.
const blackTex=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1,THREE.RGBAFormat);blackTex.needsUpdate=true;
const FinalPass={uniforms:{iTime:{value:0},tDiffuse:{value:null},torusTexture:{value:null},bloomTexture:{value:null},haloTexture:{value:blackTex},uBg:{value:hexToVec3(CONFIG.bgColor)},uFlameA:{value:hexToVec3(CONFIG.flameColor)},uFlameB:{value:hexToVec3(CONFIG.flameColor2)},uFlameAmt:{value:CONFIG.flameAmt}},
vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
fragmentShader:`
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  vec3 halo = texture2D(haloTexture, vUv).xyz;
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
}`};
const finalComposer=new EffectComposer(renderer);finalComposer.addPass(new RenderPass(scene,camera));
const finalPass=new ShaderPass(new THREE.ShaderMaterial(FinalPass),'tDiffuse');
finalPass.uniforms.bloomTexture.value=blackTex;
finalPass.uniforms.torusTexture.value=blackTex;
finalComposer.addPass(finalPass);
camera.layers.set(LAYERS.ENTIRE_SCENE);

const controls=new OrbitControls(camera,renderer.domElement);
Object.assign(controls,{enableDamping:true,dampingFactor:0.06,enablePan:false,enabled:false,autoRotate:true,autoRotateSpeed:CONFIG.autoRotate,minDistance:3.5,maxDistance:16});controls.target.set(0,0,0);

const STOPS_X=[{p:0,v:0},{p:0.32,v:-3.1},{p:0.64,v:3.2},{p:1,v:0}];
const STOPS_Y=[{p:0,v:-4.5},{p:0.32,v:0.55},{p:0.64,v:0.45},{p:1,v:0.15}];
const STOPS_S=[{p:0,v:2.15},{p:0.32,v:1.0},{p:0.64,v:0.92},{p:1,v:1.12}];
const worldGroup=new THREE.Group(),planetGroup=new THREE.Group(),cloudGroup=new THREE.Group();
planetGroup.rotation.z=CONFIG.tilt;cloudGroup.rotation.z=CONFIG.tilt;cloudGroup.visible=false;
worldGroup.add(planetGroup,cloudGroup);scene.add(worldGroup);
worldGroup.position.set(STOPS_X[0].v,STOPS_Y[0].v,0);worldGroup.scale.setScalar(STOPS_S[0].v);

// atmosphere halo
const glowMesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,
uniforms:{uGlow:{value:hexToVec3(CONFIG.glowColor)},uIntensity:{value:CONFIG.glowIntensity}},
vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
fragmentShader:`uniform vec3 uGlow; uniform float uIntensity; varying vec2 vUv;
void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2); gl_FragColor = vec4(uGlow * a * uIntensity, a); }`}));
glowMesh.scale.setScalar(CONFIG.planetRadius*2.3);worldGroup.add(glowMesh);

// motes
const mN=CONFIG.atmoCount,mp=new Float32Array(mN*3),ms=new Float32Array(mN),msd=new Float32Array(mN);
for(let i=0;i<mN;i++){mp[i*3]=Math.random()*2-1;mp[i*3+1]=Math.random()*2-1;mp[i*3+2]=Math.random()*2-1;ms[i]=CONFIG.atmoSize*(0.4+Math.random());msd[i]=Math.random()*100}
const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(mp,3));mg.setAttribute('size',new THREE.BufferAttribute(ms,1));mg.setAttribute('seed',new THREE.BufferAttribute(msd,1));
const moteMat=new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,
uniforms:{uTime:{value:0},uRes:{value:V2()},uColor:{value:new THREE.Color(CONFIG.atmoColor)}},
vertexShader:`attribute float size; attribute float seed; uniform float uTime; uniform vec2 uRes;
varying float vA;
vec3 warp(vec3 p, float t){ float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
  p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
  p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
  return cos(p+vec3(1,2,4)); }
void main(){
  vec3 v = position*4.0 + warp(position, uTime)*1.2;
  vec4 mv = modelViewMatrix * vec4(v, 1.0);
  float r = length(v); float farF = 1.0 - smoothstep(5.0, 6.5, r); float nearF = smoothstep(0.0, 0.5, -mv.z);
  vA = farF * nearF;
  gl_PointSize = size * uRes.y / 900.0 / -mv.z; gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mv;
}`,
fragmentShader:`uniform vec3 uColor; varying float vA;
void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
  float tex = smoothstep(0.5, 0.0, l); gl_FragColor = vec4(uColor * tex, tex * vA * 0.55); }`});
const motes=new THREE.Points(mg,moteMat);motes.frustumCulled=false;
motes.onBeforeRender=()=>{const t=performance.now()/1000;moteMat.uniforms.uTime.value=t*CONFIG.atmoSpeed*8;motes.position.copy(camera.position);finalPass.uniforms.iTime.value=t};
scene.add(motes);

// stars
const sN=CONFIG.starCount,sp=new Float32Array(sN*3),ss=new Float32Array(sN),sb=new Float32Array(sN);
for(let i=0;i<sN;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,r=Math.sqrt(1-u*u);sp[i*3]=90*r*Math.cos(a);sp[i*3+1]=90*u;sp[i*3+2]=90*r*Math.sin(a);ss[i]=Math.random()*100;sb[i]=0.35+Math.random()*0.65}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('seed',new THREE.BufferAttribute(ss,1));sg.setAttribute('bright',new THREE.BufferAttribute(sb,1));
const starMat=new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:true,
uniforms:{uTime:{value:0},uSize:{value:CONFIG.starSize},uFlicker:{value:CONFIG.starFlicker},uColor:{value:new THREE.Color(CONFIG.starColor)},uRes:{value:V2()}},
vertexShader:`attribute float seed; attribute float bright;
uniform float uTime; uniform float uSize; uniform float uFlicker; uniform vec2 uRes;
varying float vTw;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.6 + 0.4 * sin(uTime * uFlicker + seed);
  vTw = bright * tw;
  gl_PointSize = max(uSize * uRes.y / 900.0 * (90.0 / max(-mv.z, 1.0)), 1.0);
  gl_Position = projectionMatrix * mv;
}`,
fragmentShader:`uniform vec3 uColor; varying float vTw;
void main(){
  vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
  float core = smoothstep(0.5, 0.0, l);
  gl_FragColor = vec4(uColor, core * vTw);
}`});
const stars=new THREE.Points(sg,starMat);stars.frustumCulled=false;scene.add(stars);

// clouds
let cloudsDone=false,planetDone=false,warm=1;
// while the preloader covers the screen, render only when something new arrives (to compile shaders and upload textures)
const checkReady=()=>{warm=2};
const cloudTime={v:0};let planetTime={v:0};
new THREE.TextureLoader().load(BASE+'/planet-clouds.png',tex=>{
  cloudsDone=true;checkReady();
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(5,5);
  [{h:'cloud1Height',o:'cloud1Opacity',s:'cloud1Spin',ry:0,phase:0},{h:'cloud2Height',o:'cloud2Opacity',s:'cloud2Spin',ry:2.2,phase:13},{h:'cloud3Height',o:'cloud3Opacity',s:'cloud3Spin',ry:4.3,phase:27}].forEach(L=>{
    const mat=new THREE.MeshStandardMaterial({map:tex,transparent:true,depthWrite:false});
    mat.onBeforeCompile=sh=>{
      sh.uniforms.uTime=cloudTime;sh.uniforms.noiseScale={value:20};sh.uniforms.uSpeedX={value:1};sh.uniforms.uSpeedY={value:2};sh.uniforms.uSpeedZ={value:2};sh.uniforms.uOpacity={value:CONFIG[L.o]};sh.uniforms.uPhase={value:L.phase};
      sh.vertexShader='varying vec2 vCloudUv;\n'+sh.vertexShader.replace('void main(){','void main(){\nvCloudUv = uv;');
      sh.fragmentShader=`varying vec2 vCloudUv; uniform float uTime; uniform float noiseScale; uniform float uSpeedX; uniform float uSpeedY; uniform float uSpeedZ; uniform float uOpacity; uniform float uPhase;\n${SNOISE}\n`+sh.fragmentShader.replace('#include <dithering_fragment>',`#include <dithering_fragment>
gl_FragColor.rgb = vec3(1.0);
float cloudNoise = snoise(vec3(vCloudUv.x * noiseScale + uTime * uSpeedX + uPhase, vCloudUv.y * noiseScale - uTime * uSpeedY + uPhase, uTime * uSpeedZ + uPhase));
float cloudNdv = max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0);
float cloudEdge = pow(1.0 - cloudNdv, 3.0);
float cloudMod = mix(cloudNoise, 1.0, cloudEdge);
float cloudNdl = dot(normalize(vNormal), normalize(vec3(-0.9, 0.18, 0.4)));
float cloudDay = 1.0 - smoothstep(0.30, -0.30, cloudNdl) * 0.9;
gl_FragColor.a *= cloudMod * uOpacity * cloudDay;`)};
    const m=new THREE.Mesh(new THREE.SphereGeometry(CONFIG.planetRadius*CONFIG[L.h],64,64),mat);
    m.rotation.y=L.ry;m.renderOrder=2;m.userData.spin=L.s;m.layers.set(LAYERS.ENTIRE_SCENE);cloudGroup.add(m)});
},undefined,()=>{cloudsDone=true;checkReady()});

// planet
let planetMesh=null,entryT=-1,markerTime={value:0},markers=null;
const draco=new DRACOLoader();draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
const gltf=new GLTFLoader();gltf.setDRACOLoader(draco);
const loadG=u=>new Promise((res,rej)=>gltf.load(u,res,undefined,rej));
function shrinkMap(mesh){
  const m=mesh.material,old=m&&m.map,img=old&&old.image;if(!img||!img.width)return;
  const k=Math.min(1,2048/Math.max(img.width,img.height));if(k>=1)return;
  const cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);
  cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
  const t=new THREE.CanvasTexture(cv);t.encoding=old.encoding;t.flipY=old.flipY;t.wrapS=old.wrapS;t.wrapT=old.wrapT;t.anisotropy=8;
  m.map=t;old.dispose();
}
function firstMesh(g){let m=null;g.scene.traverse(o=>{if(!m&&o.isMesh)m=o});return m}
(async()=>{
  let nightTex=null;
  const TO=(p,ms)=>Promise.race([p,new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),ms))]);
  // lets a frame paint between the heavy setup steps, so the preloader keeps moving
  const yieldFrame=()=>new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));
  try{nightTex=firstMesh(await TO(loadG(BASE+'/planet-lights.glb'),20000)).material.map}catch(e){console.warn(e)}
  if(!nightTex)nightTex=blackTex;
  let mesh;
  try{
    mesh=firstMesh(await TO(loadG(BASE+'/planet.glb'),45000));setDbg('planet.glb loaded, mesh='+(mesh&&mesh.name)+' mat='+(mesh&&mesh.material.type)+' map='+!!(mesh&&mesh.material.map));
    mesh.geometry.computeBoundingSphere();const bs=mesh.geometry.boundingSphere;const sc=CONFIG.planetRadius/bs.radius;
    mesh.scale.setScalar(sc);mesh.position.copy(bs.center).multiplyScalar(-sc);await yieldFrame();try{shrinkMap(mesh)}catch(e){console.warn('texture shrink skipped',e)}
    await yieldFrame();
  }catch(e){console.warn('planet.glb failed, using procedural Earth',e);setDbg('GLB FAILED ('+(e&&e.message||e)+') -> procedural Earth');mesh=fallbackEarth()}
  const mat=mesh.material.clone();mat.metalness=0;mat.roughness=1;mat.envMapIntensity=0;mat.extensions=mat.extensions||{};mat.extensions.derivatives=true;if(mat.map){mat.emissive=new THREE.Color(0xffffff);mat.emissiveMap=mat.map;mat.emissiveIntensity=0.5}
  mat.onBeforeCompile=sh=>{
    Object.assign(sh.uniforms,{time:planetTime,noiseScale:{value:30},speedX:{value:1.5},speedY:{value:2.0},speedZ:{value:2.5},rimColor:{value:new THREE.Color(CONFIG.rimColor)},rimPower:{value:CONFIG.rimPower},nightBlendTexture:{value:nightTex},nightLights:{value:CONFIG.nightLights},terrainDepth:{value:CONFIG.terrainDepth},terrainShade:{value:CONFIG.terrainShade},oceanGlint:{value:CONFIG.oceanGlint},oceanDeep:{value:CONFIG.oceanDeep},oceanFlow:{value:CONFIG.oceanFlow},oceanFlowSpeed:{value:CONFIG.oceanFlowSpeed},oceanFlowScale:{value:CONFIG.oceanFlowScale}});
    sh.vertexShader='varying vec2 vCustomUv;\n'+sh.vertexShader.replace('void main(){','void main(){\nvCustomUv = uv;');
    sh.fragmentShader=`varying vec2 vCustomUv; uniform float time; uniform float noiseScale; uniform float speedX; uniform float speedY; uniform float speedZ; uniform vec3 rimColor; uniform float rimPower; uniform sampler2D nightBlendTexture; uniform float nightLights; uniform float terrainDepth; uniform float terrainShade; uniform float oceanGlint; uniform float oceanDeep; uniform float oceanFlow; uniform float oceanFlowSpeed; uniform float oceanFlowScale;\n${SNOISE}\n`+sh.fragmentShader.replace('#include <dithering_fragment>',`#include <dithering_fragment>
vec3 baseCol = gl_FragColor.rgb;
vec3 normalizedNormal = normalize(vNormal);
vec3 viewDir = normalize(vViewPosition);
float rim = 1.0 - max(dot(viewDir, normalizedNormal), 0.0);
rim = pow(rim, rimPower); rim = pow(rim, 1.5); rim *= 0.7;
vec3 currentColor = gl_FragColor.rgb;
float blueDom = currentColor.b - max(currentColor.r, currentColor.g);
float waterMask = clamp(smoothstep(-0.005, 0.03, blueDom), 0.0, 1.0);
float shimmer = snoise(vec3(vCustomUv.x * noiseScale + time * speedX, vCustomUv.y * noiseScale - time * speedY, time * speedZ));
gl_FragColor.rgb += waterMask * shimmer * 0.025;
float fT = time * oceanFlowSpeed * 4.0;
float fS = 4.0 * oceanFlowScale;
float warp = snoise(vec3(vCustomUv.x * fS - fT * 0.5, vCustomUv.y * fS + fT * 0.4, fT * 0.5));
float flow = snoise(vec3(vCustomUv.x * fS * 2.0 + fT * 0.6 + warp, vCustomUv.y * fS * 2.0 - fT * 0.5, fT * 0.7));
flow = warp * 0.6 + flow * 0.4;
gl_FragColor.rgb += waterMask * flow * 0.12 * oceanFlow;
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.01, 0.06, 0.16), waterMask * oceanDeep);
vec3 finalColor = mix(gl_FragColor.rgb, rimColor, rim);
gl_FragColor = vec4(finalColor, 1.0);
vec3 shadeNormal = normalizedNormal;
vec3 cityLights = texture2D(nightBlendTexture, vCustomUv).rgb * gl_FragColor.rgb * nightLights;
vec3 viewSunDir = normalize(vec3(-0.9, 0.18, 0.4));
float ndl = dot(normalizedNormal, viewSunDir);
float dayAmt = smoothstep(-0.05, 0.35, ndl);
float relief = dot(shadeNormal, viewSunDir) - ndl;
gl_FragColor.rgb *= clamp(1.0 + relief * terrainShade * dayAmt, 0.55, 1.6);
float nightFactor  = smoothstep(0.18, -0.30, ndl);
float lightsFactor = smoothstep(0.30, -0.35, ndl);
gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.08, nightFactor);
gl_FragColor.rgb += cityLights * lightsFactor;
vec3 halfDir = normalize(viewSunDir + viewDir);
float ripple = snoise(vec3(vCustomUv * 240.0, time * 4.0));
float ndh = max(dot(normalizedNormal, halfDir) + ripple * 0.02, 0.0);
float glint = pow(ndh, 140.0);
gl_FragColor.rgb += glint * waterMask * dayAmt * oceanGlint * vec3(1.0, 0.97, 0.88);
if(!(gl_FragColor.r>=0.0&&gl_FragColor.g>=0.0&&gl_FragColor.b>=0.0)) gl_FragColor.rgb = baseCol;`)};
  mesh.material=mat;mesh.layers.set(LAYERS.ENTIRE_SCENE);
  try{buildMarkers(mesh)}catch(e){console.warn('markers',e)}
  await yieldFrame();
  planetGroup.add(mesh);planetMesh=mesh;
  cloudGroup.visible=true;planetDone=true;checkReady();bus.once('boot-done',()=>{if(entryT===-1)entryT=0});
})().catch(e=>{console.warn('planet load failed',e);planetDone=true;checkReady()});


function fallbackEarth(){
  const hs=(x,y,z)=>{const h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h)};
  const sm=t=>t*t*(3-2*t),L=(a,b,t)=>a+(b-a)*t;
  const vn=(x,y,z)=>{const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=sm(x-ix),fy=sm(y-iy),fz=sm(z-iz);
    const c=(a,b,d)=>hs(ix+a,iy+b,iz+d);
    return L(L(L(c(0,0,0),c(1,0,0),fx),L(c(0,1,0),c(1,1,0),fx),fy),L(L(c(0,0,1),c(1,0,1),fx),L(c(0,1,1),c(1,1,1),fx),fy),fz)};
  const fbm=(x,y,z)=>{let a=.5,f=1,t=0;for(let i=0;i<6;i++){t+=a*vn(x*f,y*f,z*f);a*=.5;f*=2.07}return t};
  const w=1024,h=512,cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d'),im=cx.createImageData(w,h);
  for(let j=0;j<h;j++){const lat=(.5-j/h)*Math.PI,cl=Math.cos(lat),sl=Math.sin(lat);
    for(let i=0;i<w;i++){const lon=i/w*Math.PI*2,x=Math.cos(lon)*cl*2.2+9,y=sl*2.2+9,z=Math.sin(lon)*cl*2.2+9;
      const n=fbm(x,y,z),m=fbm(x*2+5,y*2+5,z*2+5),o=(j*w+i)*4;let r,g,b;
      if(Math.abs(sl)>.9){r=g=b=235}
      else if(n>.52){const e=Math.min(1,(n-.52)*5);
        if(m>.55&&Math.abs(sl)<.55){r=L(180,150,e);g=L(160,120,e);b=L(105,80,e)}
        else{r=L(60,95,e);g=L(125,100,e);b=L(55,60,e)}}
      else{const d=Math.max(0,(.52-n)*3);r=L(24,8,Math.min(1,d));g=L(95,50,Math.min(1,d));b=L(165,120,Math.min(1,d))}
      im.data[o]=r;im.data[o+1]=g;im.data[o+2]=b;im.data[o+3]=255}}
  cx.putImageData(im,0,0);
  const tex=new THREE.CanvasTexture(cv);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=8;
  return new THREE.Mesh(new THREE.SphereGeometry(CONFIG.planetRadius,96,96),new THREE.MeshStandardMaterial({map:tex}));
}
function buildMarkers(mesh){
  const geo=mesh.geometry,pos=geo.attributes.position,uvA=geo.attributes.uv,idx=geo.index;
  const img=mesh.material.map&&mesh.material.map.image;if(!img||!uvA)return;
  const k0=Math.min(1,1024/Math.max(img.width,img.height)),cw=Math.round(img.width*k0),ch=Math.round(img.height*k0),cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  const cx=cv.getContext('2d');cx.drawImage(img,0,0,cw,ch);const px=cx.getImageData(0,0,cw,ch).data;
  const triN=idx?idx.count/3:pos.count/3,tri=t=>idx?[idx.getX(t*3),idx.getX(t*3+1),idx.getX(t*3+2)]:[t*3,t*3+1,t*3+2];
  const cum=new Float32Array(triN),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();let tot=0;
  for(let t=0;t<triN;t++){const [i,j,k]=tri(t);a.fromBufferAttribute(pos,i);b.fromBufferAttribute(pos,j);c.fromBufferAttribute(pos,k);tot+=b.clone().sub(a).cross(c.clone().sub(a)).length()/2;cum[t]=tot}
  const out=[],sd=[];let tries=0;
  while(out.length<CONFIG.markerCount*3&&tries++<8000){
    const r=Math.random()*tot;let lo=0,hi=triN-1;while(lo<hi){const m=(lo+hi)>>1;if(cum[m]<r)lo=m+1;else hi=m}
    const [i,j,k]=tri(lo);let u=Math.random(),v=Math.random();if(u+v>1){u=1-u;v=1-v}const w=1-u-v;
    a.fromBufferAttribute(pos,i);b.fromBufferAttribute(pos,j);c.fromBufferAttribute(pos,k);
    const p=a.multiplyScalar(w).add(b.multiplyScalar(u)).add(c.multiplyScalar(v));
    const tu=uvA.getX(i)*w+uvA.getX(j)*u+uvA.getX(k)*v,tv=uvA.getY(i)*w+uvA.getY(j)*u+uvA.getY(k)*v;
    const x=clamp(Math.floor((tu%1+1)%1*cw),0,cw-1),y=clamp(Math.floor((tv%1+1)%1*ch),0,ch-1),o=(y*cw+x)*4;
    const cr=px[o],cg=px[o+1],cb=px[o+2];if(cb>cr+6&&cb>cg+6)continue;
    out.push(p.x*1.012,p.y*1.012,p.z*1.012);sd.push(Math.random());if(sd.length>=CONFIG.markerCount)break}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(out,3));g.setAttribute('seed',new THREE.Float32BufferAttribute(sd,1));
  const mm=new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthTest:true,depthWrite:false,
  uniforms:{uTime:markerTime,uColor:{value:new THREE.Color(CONFIG.markerColor)},uSize:{value:CONFIG.markerSize},uSpeed:{value:CONFIG.markerSpeed},uRes:{value:V2()}},
  vertexShader:`attribute float seed; uniform float uSize; uniform vec2 uRes;
varying float vSeed; varying float vFade;
void main(){
  vSeed = seed;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 vn = normalize(normalMatrix * normalize(position));
  vec3 vd = normalize(-mv.xyz);
  vFade = smoothstep(0.15, 0.5, dot(vn, vd));
  gl_PointSize = max(uSize * uRes.y / 900.0 * (7.0 / max(-mv.z, 1.0)), 2.0);
  gl_Position = projectionMatrix * mv;
}`,
  fragmentShader:`uniform vec3 uColor; uniform float uTime; uniform float uSpeed;
varying float vSeed; varying float vFade;
void main(){
  if (vFade <= 0.001) discard;
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  if (d > 1.0) discard;
  float core = smoothstep(0.30, 0.0, d) * 1.2;
  float ph = fract(uTime * uSpeed + vSeed);
  float ring = smoothstep(0.07, 0.0, abs(d - ph)) * (1.0 - ph);
  gl_FragColor = vec4(uColor, clamp(core + ring, 0.0, 1.0) * vFade);
}`});
  markers=new THREE.Points(g,mm);markers.frustumCulled=false;markers.layers.set(LAYERS.ENTIRE_SCENE);mesh.add(markers);
}

// everything non-light on ENTIRE layer
[glowMesh,motes,stars].forEach(o=>o.layers.set(LAYERS.ENTIRE_SCENE));
const uRes=[moteMat,starMat];
// page height is cached instead of read every frame (reading scrollHeight in the loop forces layout)
let maxScroll=0;const measure=()=>{maxScroll=document.documentElement.scrollHeight-innerHeight};
measure();const ro=new ResizeObserver(measure);ro.observe(document.body);
// debounced, and mobile address-bar show/hide (height-only change) is ignored so scrolling never reallocates buffers
let rsT=0;
const onResize=()=>{measure();clearTimeout(rsT);rsT=setTimeout(()=>{
  if(innerWidth===W&&Math.abs(innerHeight-H)<160&&matchMedia('(pointer:coarse)').matches)return;
  W=innerWidth;H=innerHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setPixelRatio(qPR);renderer.setSize(W,H,false);
  finalComposer.setPixelRatio(qPR);finalComposer.setSize(W,H);
  uRes.forEach(m=>m.uniforms.uRes.value.set(W,H));if(markers)markers.material.uniforms.uRes.value.set(W,H)},150)};
addEventListener('resize',onResize);

// loop
const ENTRY_DUR=1.9,ENTRY_START_Y=-6.5;
let curP=0,curX=STOPS_X[0].v,curY=STOPS_Y[0].v,curS=STOPS_S[0].v,spinPhase=0,starT=0,last=performance.now();
if(reduce)entryT=-2;
function applyQuality(v){qPR=v;renderer.setPixelRatio(v);renderer.setSize(W,H,false);finalComposer.setPixelRatio(v);finalComposer.setSize(W,H)}
let qAcc=0,qN=0;
function frame(now){
  raf=requestAnimationFrame(frame);
  if(lenis)lenis.raf(now);
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  const live=bus.is('boot-done');
  if(live&&!document.hidden){qAcc+=dt;qN++;if(qN>=60){if(qAcc/qN>0.02&&qPR>MIN_PR)applyQuality(Math.max(MIN_PR,+(qPR-0.25).toFixed(2)));qAcc=0;qN=0}}
  planetTime.value+=dt/12;cloudTime.value+=dt/20;starT+=dt;starMat.uniforms.uTime.value=starT;markerTime.value+=dt;
  const pT=maxScroll>0?clamp(scrollY/maxScroll,0,1):0;
  curP+=(pT-curP)*Math.min(1,dt*2.4);
  const side=clamp(innerWidth/1200,0.5,1),k=Math.min(1,dt*1.9);
  curX+=(sample(STOPS_X,curP)*side-curX)*k;curY+=(sample(STOPS_Y,curP)-curY)*k;curS+=(sample(STOPS_S,curP)-curS)*k;
  let ey=0;if(entryT>=0){entryT+=dt;const t=Math.min(1,entryT/ENTRY_DUR);ey=ENTRY_START_Y*Math.pow(1-t,3)}
  else if(entryT===-1)ey=ENTRY_START_Y;
  worldGroup.position.set(curX,curY+ey,0);worldGroup.scale.setScalar(curS);
  spinPhase+=dt*CONFIG.spin;planetGroup.rotation.y=CONFIG.initRotation+spinPhase+curP*Math.PI*1.6;
  cloudGroup.children.forEach(m=>m.rotation.y+=dt*CONFIG[m.userData.spin]);
  glowMesh.quaternion.copy(camera.quaternion);
  controls.update();
  if(live)finalComposer.render();
  else if(warm>0){
    // warm-up render with the planet in view (still hidden behind the preloader): off-screen objects are culled,
    // so without this their shaders and textures would only be prepared mid-burst and freeze it
    warm--;worldGroup.position.set(0,0,0);finalComposer.render();worldGroup.position.set(curX,curY+ey,0);
  }
  if(planetDone&&cloudsDone)bus.set('earth-ready');
}
let raf=requestAnimationFrame(frame);
return ()=>{cancelAnimationFrame(raf);clearTimeout(rsT);removeEventListener('resize',onResize);ro.disconnect();controls.dispose();renderer.dispose()};
}
