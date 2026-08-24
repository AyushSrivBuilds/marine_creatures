export const vertex = `
attribute float aSeed;
attribute float aU;
attribute float aV;
attribute float aPart;
uniform float uTime,uScale,uSpeed,uPulse,uTurbulence,uDeformation,uPhase,uAppendages,uAspectX,uAspectY,uBody,uMotion,uSymmetry,uPointerX,uPointerY,uParticleSize;
varying float vLife,vDepth,vHue;
#define PI 3.14159265
float hash(float n){return fract(sin(n)*43758.5453123);}
void main(){
  float seed=aSeed,u=aU,v=aV,t=uTime*uSpeed;
  float phase=seed*6.28318*uPhase;
  // Mathematical reference field: coupled harmonics, radial magnitude, nonlinear exponent and temporal modulation.
  float k=9.0*cos(phase*5.0)*sin(phase);
  float e=9.0*cos(phase*3.0)*cos(phase*2.0);
  float radialMagnitude=length(vec2(k,e));
  float nonlinear=pow(radialMagnitude,3.0)/1999.0+1.5-pow(sin(t*.5+phase),3.0)/3.0;
  float parametricDeformation=pow(max(nonlinear,.02),sin(nonlinear*nonlinear-t+phase));
  float angle=u*PI*2.0;
  vec2 pos;
  if(uBody<.5){
    // Jellyfish: compressed bell plus radially distributed tentacle curtain.
    if(v<.42){float r=sqrt(v/.42);pos=vec2(cos(angle)*r,sin(angle)*r*.62);}
    else {float arm=floor(u*uAppendages);float a=(arm/max(uAppendages,1.))*PI*2.;float q=(v-.42)/.58;pos=vec2(cos(a)*(.18+.52*(1.-q)),-.18-q*1.45);pos.x+=sin(q*7.+t*uMotion+phase)*q*.16;}
  } else if(uBody<1.5){
    // Squid: mantle taper and ten animated arms.
    if(v<.55){float q=v/.55;float width=mix(.52,.08,q);pos=vec2((u-.5)*2.*width,q*1.65-.72);}
    else {float arm=floor(u*uAppendages);float a=(arm/max(uAppendages,1.))*PI*2.;float q=(v-.55)/.45;pos=vec2(cos(a)*(.12+q*.82),-.72-q*.95);pos.x+=sin(q*10.-t*uMotion+phase)*q*.13;}
  } else if(uBody<2.5){
    // Octopus: central mantle with distinct curling radial arms.
    float arm=floor(u*uAppendages);float a=(arm/max(uAppendages,1.))*PI*2.;float q=v;
    float curl=sin(q*8.-t*uMotion+phase)*q*.22;
    pos=vec2(cos(a+curl),sin(a+curl))*(.18+q*1.15);
  } else if(uBody<3.5){
    // Crab: wide carapace, bilateral legs and raised claws.
    float side=step(.5,u)*2.-1.;float q=fract(u*8.);float leg=floor(q*4.);float spread=.32+leg*.17;
    if(v<.48){float x=(u-.5)*2.2;pos=vec2(x,.18*sqrt(max(0.,1.-x*x*.65))+sin(u*PI)*.18);}
    else {float armQ=(v-.48)/.52;pos=vec2(side*(.32+spread+armQ*.22),-.05-armQ*.72);pos.x+=side*sin(armQ*7.+t*uMotion+phase)*.10;}
  } else if(uBody<4.5){
    // Lobster: articulated axial segments with paired walking limbs and tail fan.
    float y=v*2.-1.;float segment=floor(v*7.);float wobble=sin(segment*1.7+t*uMotion+phase)*.08;
    pos=vec2(wobble,y*1.42);
    if(u>.62){float side=step(.81,u)*2.-1.;float q=fract(u*5.);pos+=vec2(side*(.28+.42*q),-.12*q+sin(q*9.+t)*.08);}
  } else {
    // Seahorse: logarithmic-like spine, curled tail and small dorsal fin.
    float y=v*2.-1.;float spine=.42*sin(y*3.2)+.12*sin(y*9.);
    pos=vec2(spine,y*1.35);
    if(v<.38){float q=(.38-v)/.38;float a=q*PI*5.+t*.35*uMotion;pos+=vec2(cos(a)*q*.34,sin(a)*q*.34);}
    else if(u>.78){float q=fract(u*4.);pos+=vec2(sin(q*PI)*.32,sin(q*PI*2.+t*uMotion)*.10);}
  }
  float symmetryRipple=sin(angle*max(uSymmetry,1.)+phase)*.035;
  float wave=sin(pos.x*6.+phase+t*uMotion)*.065+cos(pos.y*7.-t*.8*uMotion+phase)*.05;
  vec2 flow=vec2(sin(t*uMotion+phase+pos.y*5.),cos(t*.7*uMotion+phase+pos.x*6.))*uTurbulence*.14;
  pos+=flow+vec2(wave+symmetryRipple,-wave*.35)*uDeformation;
  pos+=vec2(k*.0017,e*.0017)*parametricDeformation*uDeformation;
  pos*=uScale*(1.+sin(t*1.5*uMotion+phase)*.07*uPulse);
  pos*=vec2(uAspectX,uAspectY);
  vec2 pointer=vec2(uPointerX,uPointerY);float dist=length(pos-pointer);
  pos+=normalize(pos-pointer+vec2(.0001))*exp(-dist*4.)*.12*uPulse;
  vec4 mv=modelViewMatrix*vec4(pos,hash(seed*3.)-.5,1.);
  gl_PointSize=clamp((1.+hash(seed*8.)*2.)*uParticleSize*(180./max(-mv.z,.1)),1.,18.);
  gl_Position=projectionMatrix*mv;vLife=v;vDepth=mv.z;vHue=fract(seed*.17+u*.2+aPart*.013);
}`;

export const fragment = `
uniform float uHue,uSaturation,uBrightness,uGlow;
uniform vec3 uColorA,uColorB,uColorC;
varying float vLife,vDepth,vHue;
vec3 hue(vec3 c,float h){float a=h*6.28318;mat3 m=mat3(0.299,0.587,0.114,0.299,0.587,0.114,0.299,0.587,0.114)+mat3(0.701,-0.299,-0.3,-0.587,0.413,0.588,-0.114,-0.114,0.886)*cos(a)+mat3(0.168,0.330,-0.497,-0.328,0.035,0.292,1.25,-1.05,-0.203)*sin(a);return clamp(m*c,0.,1.);}
void main(){vec2 p=gl_PointCoord-.5;float d=length(p)*2.;float core=pow(max(0.,1.-d),1.8);float halo=pow(max(0.,1.-d),.7)*.22*uGlow;vec3 c=mix(uColorA,uColorB,vHue);c=mix(c,uColorC,vLife*.28);c=hue(c,uHue);c*=uBrightness;float alpha=(core+halo)*(.28+.72*(1.-vLife*.3));gl_FragColor=vec4(c*uSaturation,alpha);}`;
