export const DIAZAI_LCM_CLAIMS=["M11","M14"];
export const CORE_LANES=[1,2,3,4,5,6];

export function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
export function lcm(a,b){return Math.abs(a*b)/gcd(a,b)}

export function laneTicks(m, cycle=60){
  if(!Number.isInteger(m)||m<1) throw new RangeError("lane must be a positive integer");
  return Array.from({length:cycle},(_,i)=>i+1).filter(t=>t%m===0);
}

export function buildCoreGlassChannels(){
  return [
    {id:"glass:source",label:"Source / anchors",lane:1,domain:"source",weight:1},
    {id:"glass:lexical",label:"Lexical / terminology",lane:2,domain:"lexical",weight:.95},
    {id:"glass:structure",label:"Graph / hypergraph",lane:3,domain:"structural",weight:.90},
    {id:"glass:canon",label:"DiazAI + Wolfram canon check",lane:4,domain:"mathematical",weight:.90},
    {id:"glass:philosophy",label:"Philosophy / analogy",lane:5,domain:"interpretive",weight:.80},
    {id:"glass:synthesis",label:"Review / synthesis",lane:6,domain:"review",weight:.85}
  ];
}

export function channelSchedule(channel, cycle=60){
  const ticks=laneTicks(channel.lane,cycle);
  return {...channel,cycle,fireCount:ticks.length,ticks,normalizedActivity:ticks.length/cycle};
}

export function channelPair(left,right,cycle=60){
  const syncPeriod=lcm(left.lane,right.lane);
  const compatibilityGauge=gcd(left.lane,right.lane);
  const syncTicks=Array.from({length:cycle},(_,i)=>i+1).filter(t=>t%syncPeriod===0);
  return {left:left.id,right:right.id,cycle,lcmWhen:syncPeriod,gcdWhich:compatibilityGauge,syncTicks,syncCount:syncTicks.length};
}

export function discreteGaugeIntegral(channel,{cycle=60,gate=()=>true}={}){
  const ticks=laneTicks(channel.lane,cycle);
  const accepted=ticks.filter(t=>gate(t,channel));
  const raw=accepted.reduce(sum=>sum+channel.weight,0);
  return {
    schema:"aletheia.experimental.discrete-gauge-integral.v1",
    canonStatus:"derived-not-diazai-canon",
    diazaiClaimRefs:DIAZAI_LCM_CLAIMS,
    channelId:channel.id,lane:channel.lane,cycle,acceptedTicks:accepted,raw,
    normalized:raw/(cycle*Math.max(channel.weight,Number.EPSILON))
  };
}

export function pairGaugeIntegral(left,right,{cycle=60,gate=()=>true}={}){
  const pair=channelPair(left,right,cycle);
  const accepted=pair.syncTicks.filter(t=>gate(t,left,right));
  const weight=Math.sqrt(left.weight*right.weight);
  const raw=accepted.reduce(sum=>sum+weight,0);
  return {
    schema:"aletheia.experimental.pair-gauge-integral.v1",
    canonStatus:"derived-not-diazai-canon",
    diazaiClaimRefs:DIAZAI_LCM_CLAIMS,
    ...pair,acceptedTicks:accepted,raw,
    normalized:raw/(cycle*Math.max(weight,Number.EPSILON))
  };
}

export function buildGlassMatrix(channels=buildCoreGlassChannels(),cycle=60){
  const pairs=[];
  for(let i=0;i<channels.length;i+=1)for(let j=i+1;j<channels.length;j+=1)pairs.push({
    ...channelPair(channels[i],channels[j],cycle),
    pairGauge:pairGaugeIntegral(channels[i],channels[j],{cycle})
  });
  return {schema:"aletheia.xway-glass.lcm60.v1",canonRefs:DIAZAI_LCM_CLAIMS,cycle,channels:channels.map(c=>channelSchedule(c,cycle)),pairs};
}
