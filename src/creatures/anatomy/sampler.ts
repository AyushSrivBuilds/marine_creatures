import * as THREE from 'three';
import type {AnatomySample} from './types';

const rand=()=>Math.random();
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

function push(samples:AnatomySample[],x:number,y:number,z:number,part:number){
  samples.push({position:new THREE.Vector3(x,y,z),part});
}

function sampleBell(samples:AnatomySample[],count:number){
  for(let i=0;i<count;i++){
    const a=rand()*Math.PI*2;
    const r=Math.sqrt(rand());
    const x=Math.cos(a)*r*.92;
    const z=Math.sin(a)*r*.62;
    const y=.52*Math.sqrt(Math.max(0,1-r*r))-.08;
    push(samples,x,y,z,0);
  }
}

function sampleRim(samples:AnatomySample[],count:number){
  for(let i=0;i<count;i++){
    const a=rand()*Math.PI*2;
    const r=.88+(rand()-.5)*.08;
    push(samples,Math.cos(a)*r,-.1+(rand()-.5)*.05,Math.sin(a)*r*.62,1);
  }
}

function sampleTentacles(samples:AnatomySample[],count:number,appendages:number){
  const arms=Math.max(4,Math.round(appendages));
  for(let i=0;i<count;i++){
    const arm=i%arms;
    const a=arm/arms*Math.PI*2+(rand()-.5)*.09;
    const q=rand();
    const root=.38+rand()*.38;
    const curl=Math.sin(q*Math.PI*2+arm*.9)*q*.12;
    const x=Math.cos(a)*(root+curl);
    const z=Math.sin(a)*(root+curl)*.68;
    const y=-.16-q*(1.35+rand()*.28)+Math.sin(q*8+arm)*.06*q;
    push(samples,x,y,z,2);
  }
}

function sampleOralArms(samples:AnatomySample[],count:number){
  const arms=4;
  for(let i=0;i<count;i++){
    const arm=i%arms;
    const side=(arm%2?1:-1);
    const q=rand();
    const spread=lerp(.12,.52,q);
    const x=side*(spread+Math.sin(q*7+arm)*.08);
    const y=-.15-q*1.05;
    const z=(Math.floor(arm/2)-.5)*.42+Math.cos(q*6+arm)*.08;
    push(samples,x,y,z,3);
  }
}

export function sampleJellyfish(count:number,appendages:number):AnatomySample[]{
  const samples:AnatomySample[]=[];
  const bell=Math.round(count*.48);
  const rim=Math.round(count*.08);
  const tentacles=Math.round(count*.30);
  const oral=count-bell-rim-tentacles;
  sampleBell(samples,bell);
  sampleRim(samples,rim);
  sampleTentacles(samples,tentacles,appendages);
  sampleOralArms(samples,oral);
  return samples;
}
