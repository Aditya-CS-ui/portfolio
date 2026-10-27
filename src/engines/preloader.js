// Particle preloader: scattered particles spiral together into a dotted Earth while the page loads,
// then it bursts open onto the portfolio. Fires 'boot-done' on the burst; waits for 'earth-ready' from earth.js.
import {bus} from './bus.js';

export function startPreloader({pre, canvas, onDone}) {
const c=canvas,g=c.getContext('2d');let W,H,D;
const TAU=Math.PI*2,SMALL=innerWidth<700,RMc=matchMedia('(prefers-reduced-motion:reduce)').matches;
function rs(){D=Math.min(devicePixelRatio||1,SMALL?1.5:2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D}
rs();addEventListener('resize',rs);
const MAP_URL='https://raw.githubusercontent.com/mrdoob/three.js/r143/examples/textures/planets/earth_atmos_2048.jpg';
// timings in seconds: drift while loading (at least MIN_DRIFT), then gather over FORM_DUR, hold, charge and burst.
// The gather waits for everything (3D Earth included) so no loading work can interrupt the animation.
const MIN_DRIFT=.9,FORM_DUR=2.2,HOLD=.55,CHARGE=.5,BOOM_DUR=1.5,TOT=4,TILT=.41,SPIN=.38,FACE_LON=78*Math.PI/180;
let rot0=0;
const COLORS=['#3a6cff','#5df0a8','#eef6ff','#cfe3ff'];// ocean, land, ice, loose particle
const LEVELS=6,LX=-.55,LY=.42,LZ=.72;// alpha levels per colour, light direction

// progress counter: earth map, avatar, fonts, 3D earth
let loaded=0;const track=p=>Promise.resolve(p).then(()=>{loaded++},()=>{loaded++});
const pct=()=>Math.round(loaded/TOT*100);let dpct=0;

// dot colours come from a real Earth map (a small copy is plenty); procedural continents are used if it can't load
function sampleImage(img){const w=512,h=256,cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.drawImage(img,0,0,w,h);const px=cx.getImageData(0,0,w,h).data;
 return (lat,lon)=>{const x=Math.min(w-1,Math.max(0,Math.floor((lon+Math.PI)/TAU*w))),y=Math.min(h-1,Math.max(0,Math.floor((Math.PI/2-lat)/Math.PI*h))),o=(y*w+x)*4;return [px[o],px[o+1],px[o+2]]}}
function proceduralMap(lat,lon){const cl=Math.cos(lat),x=cl*Math.sin(lon),y=Math.sin(lat),z=cl*Math.cos(lon);const v=Math.sin(x*3.1+1)+Math.sin(y*4.2+2)+Math.sin(z*3.4)+Math.sin((x+z)*5)*.5;return v>.6?[104,150,92]:[36,92,190]}
const mapP=new Promise(res=>{const im=new Image();im.crossOrigin='anonymous';
 im.onload=()=>{try{res(sampleImage(im))}catch(e){res(proceduralMap)}};
 im.onerror=()=>res(proceduralMap);im.src=MAP_URL;setTimeout(()=>res(proceduralMap),8000)});
track(mapP);

// particles: evenly spread over a sphere (Fibonacci lattice), each starting somewhere random on screen
const N=SMALL?2200:4200,GA=Math.PI*(3-Math.sqrt(5));
const P=[];
for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),th=i*GA;
 P.push({ux:Math.cos(th)*r,uy:y,uz:Math.sin(th)*r,x0:Math.random(),y0:Math.random(),dl:Math.random()*.45,tw:Math.random()*TAU,ts:.8+Math.random()*2,s:.8+Math.random()*1.1,k:3,bx:0,by:0,ba:0,vx:0,vy:0})}
const STARS=Array.from({length:SMALL?70:140},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.1+.3,p:Math.random()*TAU,s:.6+Math.random()*1.8}));
mapP.then(sample=>{for(const q of P){const lat=Math.asin(q.uy),lon=Math.atan2(q.ux,q.uz),m=sample(lat,lon);
 // open ocean is clearly bluer than red; dark forests on this map are only slightly blue, so they stay land
 q.k=Math.abs(lat)>1.2||(m[0]>185&&m[1]>185&&m[2]>185)?2:(m[2]>=m[0]+24&&m[2]>=m[1]+16?0:1)}});

// gates
let formT=-1,formedT=-1,boomT=-1,readyAt=-1,ready=false,done=false,force=false;
const t0=performance.now();
const earthP=new Promise(r=>bus.once('earth-ready',r));
const av=document.querySelector('.avatar'),imgP=new Promise(r=>{if(!av||av.complete)r();else{av.addEventListener('load',r);av.addEventListener('error',r)}});
track(imgP);track(earthP);track(document.fonts?document.fonts.ready:0);
Promise.all([mapP,earthP,imgP,document.fonts?document.fonts.ready:0]).then(()=>ready=true);

function endAll(){if(done)return;done=true;removeEventListener('resize',rs);onDone()}
function startBurst(){if(bus.is('boot-done'))return;document.body.classList.remove('loading');bus.set('boot-done')}
const easeIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,clamp01=x=>x<0?0:x>1?1:x;
const buckets=Array.from({length:COLORS.length*LEVELS},()=>[]);

function frame(now){
 if(done)return;raf=requestAnimationFrame(frame);
 const t=(now-t0)/1000;
 if(force)ready=true;
 if(RMc){if(ready){startBurst();endAll()}return}
 // when the gather starts, pick the spin so India faces the viewer as the burst hits
 if(ready&&readyAt<0)readyAt=t;
 if(formT<0&&readyAt>=0&&t-readyAt>=.3&&t>=MIN_DRIFT){formT=t;rot0=-FACE_LON-(t+FORM_DUR+HOLD+CHARGE)*SPIN}
 const u=formT<0?0:(t-formT)/FORM_DUR;
 if(formT>=0&&u>=1&&formedT<0)formedT=t;
 const ch=formedT<0?0:clamp01((t-formedT-HOLD)/CHARGE);
 if(ch>=1&&boomT<0){boomT=t;pre.style.background='transparent';pre.style.pointerEvents='none';startBurst()}
 const tb=boomT<0?-1:t-boomT;
 if(tb>=BOOM_DUR){endAll();return}
 dpct+=(pct()-dpct)*.12;

 const cx=W/2,cy=H*.46,R=Math.min(W,H)*(SMALL?.3:.24)*(1-.07*easeIO(ch));
 const rot=rot0+t*SPIN,ca=Math.cos(rot),sa=Math.sin(rot),ct=Math.cos(TILT),st=Math.sin(TILT);
 g.setTransform(D,0,0,D,0,0);g.clearRect(0,0,W,H);
 // backdrop, which melts away during the burst so the particles fly out over the page
 const bgA=tb<0?1:1-clamp01((tb-.04)/.6);
 if(bgA>0){g.globalAlpha=bgA;g.fillStyle='#04060f';g.fillRect(0,0,W,H)}

 // background stars
 g.fillStyle='#cfe3ff';
 for(const s of STARS){g.globalAlpha=(.18+.2*Math.sin(t*s.s+s.p))*bgA;g.fillRect(s.x*W,s.y*H,s.r,s.r)}

 // atmosphere glow builds as the globe forms and peaks while charging
 const glow=(formT<0?0:clamp01(u))*.5+ch*.5;
 if(glow>0&&tb<0){const gr=g.createRadialGradient(cx,cy,R*.6,cx,cy,R*1.7);gr.addColorStop(0,`rgba(58,108,255,${.22*glow})`);gr.addColorStop(.55,`rgba(93,240,168,${.07*glow})`);gr.addColorStop(1,'rgba(58,108,255,0)');
   g.globalAlpha=1;g.fillStyle=gr;g.fillRect(cx-R*1.7,cy-R*1.7,R*3.4,R*3.4)}

 // particles, sorted into colour and alpha buckets so the canvas changes state only a few dozen times per frame
 for(const b of buckets)b.length=0;
 const boomFade=tb<0?1:Math.pow(1-tb/BOOM_DUR,1.6),fly=tb<0?0:(1-Math.exp(-3.4*tb))/3.4;
 for(let i=0;i<N;i++){const q=P[i];let x,y,a,s,k;
   if(tb>=0){x=q.bx+q.vx*fly;y=q.by+q.vy*fly;a=q.ba*boomFade;s=q.bs*1.5;k=q.k2}
   else{
     // position on the spinning, tilted globe
     const x1=q.ux*ca+q.uz*sa,z1=-q.ux*sa+q.uz*ca,y2=q.uy*ct-z1*st,z2=q.uy*st+z1*ct;
     const gx=cx+x1*R,gy=cy-y2*R,lit=Math.max(0,x1*LX+y2*LY+z2*LZ);
     // land dots are big and bright, ocean dots small and dim, so the continents read clearly
     const ga=z2>0?(q.k===0?.14+.3*lit:.55+.45*lit):.06,gs=z2>0?(q.k===0?1.1:2.1)*(.75+.25*z2):1;
     // loose particle drifting on screen
     const lx=q.x0*W+Math.sin(t*.35+q.tw)*10,ly=q.y0*H+Math.cos(t*.3+q.tw)*8,la=.22+.2*Math.sin(t*q.ts+q.tw);
     const e=formT<0?0:easeIO(clamp01(u*1.45-q.dl));
     if(e<=0){x=lx;y=ly;a=la;s=q.s;k=3}
     else if(e>=1){x=gx;y=gy;a=ga;s=gs;k=q.k}
     else{const sw=(1-e)*1.7,dx=lx-cx,dy=ly-cy,cs=Math.cos(sw),sn=Math.sin(sw),sx=cx+dx*cs-dy*sn,sy=cy+dx*sn+dy*cs;
       x=sx+(gx-sx)*e;y=sy+(gy-sy)*e;a=la+(ga-la)*e;s=q.s+(gs-q.s)*e;k=e<.55?3:q.k}
     if(ch>0&&z2>0)a=Math.min(1,a+.35*ch*ch);
     q.bx=x;q.by=y;q.ba=a;q.bs=s;q.k2=k;
   }
   const lv=Math.min(LEVELS-1,Math.floor(a*LEVELS));if(lv<0||a<=.01)continue;
   buckets[k*LEVELS+lv].push(x,y,s)}
 for(let b=0;b<buckets.length;b++){const bk=buckets[b];if(!bk.length)continue;
   g.fillStyle=COLORS[b/LEVELS|0];g.globalAlpha=(b%LEVELS+.5)/LEVELS;
   for(let j=0;j<bk.length;j+=3){const s=bk[j+2];g.fillRect(bk[j]-s/2,bk[j+1]-s/2,s,s)}}
 g.globalAlpha=1;

 // the burst: a flash, two shockwave rings and every particle thrown outward
 if(tb>=0){
   const M=Math.hypot(W,H);
   if(tb<.55){const f=Math.pow(1-tb/.55,2.2),fg=g.createRadialGradient(cx,cy,0,cx,cy,M*.6);fg.addColorStop(0,`rgba(235,255,245,${.9*f})`);fg.addColorStop(.35,`rgba(93,240,168,${.35*f})`);fg.addColorStop(1,'rgba(93,240,168,0)');g.fillStyle=fg;g.fillRect(0,0,W,H)}
   for(const [d,col,w] of [[0,'93,240,168',16],[.09,'230,245,255',6]]){const p=clamp01((tb-d)/.95);if(p<=0||p>=1)continue;const e=1-Math.pow(1-p,3);
     g.strokeStyle=`rgba(${col},${(1-p)*.9})`;g.lineWidth=w*(1-p)+1;g.beginPath();g.arc(cx,cy,R*.9+e*M*.75,0,TAU);g.stroke()}
 }

 // loading label under the globe, gone once the burst starts
 if(tb<0){
   const ly=Math.min(H-28,cy+R*1.45);
   g.font='600 12px Inter,sans-serif';g.textAlign='center';g.fillStyle=`rgba(154,166,196,${(.45+.35*Math.sin(t*3))*(1-ch)})`;
   g.fillText((t>8&&!ready?'SLOW NETWORK · ':'LOADING · ')+Math.round(dpct)+'%',cx,ly);
 }
}

// set each particle's burst velocity the moment it starts: outward from the centre, front dots fastest
const armBoom=()=>{const cx=W/2,cy=H*.46;for(const q of P){let dx=q.bx-cx,dy=q.by-cy;const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
  const sp=(500+Math.random()*1500)*(q.ba>.3?1.25:.7),j=(Math.random()-.5)*.5;q.vx=(dx-dy*j)*sp;q.vy=(dy+dx*j)*sp}};
bus.once('boot-done',armBoom);
let raf=requestAnimationFrame(frame);
const forceT=setTimeout(()=>{force=true},20000);
return ()=>{done=true;cancelAnimationFrame(raf);clearTimeout(forceT);removeEventListener('resize',rs)};
}
