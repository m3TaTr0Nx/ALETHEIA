export const DIAZAI_DEMO_CANON={
  schema:"aletheia.diazai.readonly-demo-canon.v1",
  mode:"read-only",
  claims:[
    {id:"M2",status:"VERIFIED",statement:"729 = 9^3 = 27^2 = 3^6."},
    {id:"M11",status:"VERIFIED",statement:"LCM60 scheduler; lcm(m,n) identifies synchronization period and gcd(m,n) identifies compatible phase structure."},
    {id:"M13",status:"VERIFIED",statement:"GF(3^m) and Z/3^m remain separately typed for m>1."},
    {id:"M14",status:"VERIFIED",statement:"For GF(3^60), subfield intersection follows gcd and compositum follows lcm; the six lanes form a sublattice."}
  ],
  restrictions:{writeAllowed:false,promoteCanonAllowed:false,grandStateWriteAllowed:false,ultracodeWriteAllowed:false,mintAllowed:false}
};

export function canonReceipt(ids=[]){
  const wanted=new Set(ids);
  return {
    schema:"aletheia.diazai.readonly-receipt.v1",
    mode:"read-only",
    claims:DIAZAI_DEMO_CANON.claims.filter(c=>wanted.has(c.id)),
    restrictions:DIAZAI_DEMO_CANON.restrictions
  };
}
