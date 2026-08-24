export type CreatureId='jellyfish'|'squid'|'octopus'|'crab'|'lobster'|'seahorse';
export type Creature={id:CreatureId;name:string;body:'bell'|'mantle'|'radial'|'carapace'|'segmented'|'curved';appendages:number;symmetry:number;aspect:[number,number];palette:[string,string,string];phase:number;motion:number;deformation:number};
export const creatures:Creature[]=[
{id:'jellyfish',name:'Jellyfish',body:'bell',appendages:12,symmetry:1,aspect:[1.1,1],palette:['#6cf4ff','#ae7dff','#ffffff'],phase:.8,motion:.75,deformation:1},
{id:'squid',name:'Squid',body:'mantle',appendages:10,symmetry:2,aspect:[.75,1.5],palette:['#52e8ff','#775cff','#f5d7ff'],phase:1.2,motion:1.1,deformation:1.25},
{id:'octopus',name:'Octopus',body:'radial',appendages:8,symmetry:8,aspect:[1,1],palette:['#ff6bd6','#7d77ff','#ffb3ec'],phase:1.5,motion:.9,deformation:1.4},
{id:'crab',name:'Crab',body:'carapace',appendages:8,symmetry:2,aspect:[1.45,.8],palette:['#ff805f','#ffcb71','#fff0c4'],phase:.5,motion:.7,deformation:.8},
{id:'lobster',name:'Lobster',body:'segmented',appendages:10,symmetry:2,aspect:[.7,1.7],palette:['#ff5d81','#ff9f5a','#ffe1c7'],phase:1,motion:.8,deformation:1.1},
{id:'seahorse',name:'Seahorse',body:'curved',appendages:2,symmetry:1,aspect:[.65,1.65],palette:['#78ffd6','#46a7ff','#e5ffba'],phase:1.8,motion:.65,deformation:1.35}
];
export const byId=(id:CreatureId)=>creatures.find(c=>c.id===id)!;