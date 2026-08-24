import * as THREE from 'three';

export type AnatomySample={
  position:THREE.Vector3;
  part:number;
};

export type AnatomySampler=(count:number,appendages:number)=>AnatomySample[];
