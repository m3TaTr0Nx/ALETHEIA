function setJaccard(a = [], b = []) {
  const A = new Set(a), B = new Set(b);
  const union = new Set([...A, ...B]);
  if (!union.size) return 1;
  let intersection = 0;
  for (const value of A) if (B.has(value)) intersection += 1;
  return intersection / union.size;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function sequenceSimilarity(a = [], b = []) {
  const n = Math.max(a.length, b.length);
  if (!n) return 1;
  let numerator = 0, denominator = 0;
  for (let i = 0; i < n; i += 1) {
    const x = a[i] ?? 0, y = b[i] ?? 0;
    numerator += Math.abs(x - y);
    denominator += Math.max(1, Math.abs(x), Math.abs(y));
  }
  return clamp01(1 - numerator / denominator);
}

export function graphSignature(graph = {}) {
  const nodes = graph.nodes ?? [];
  const edges = graph.edges ?? [];
  const hyperedges = graph.hyperedges ?? graph.propositions ?? [];
  const degrees = new Map(nodes.map(node => [node.id, 0]));
  for (const edge of edges) {
    degrees.set(edge.source, (degrees.get(edge.source) ?? 0) + 1);
    degrees.set(edge.target, (degrees.get(edge.target) ?? 0) + 1);
  }
  for (const h of hyperedges) {
    for (const id of h.members ?? []) degrees.set(id, (degrees.get(id) ?? 0) + 1);
  }
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    hyperedgeCount: hyperedges.length,
    degreeSequence: [...degrees.values()].sort((x,y)=>x-y),
    relationClasses: [...new Set(edges.map(edge => edge.relationClass ?? edge.relation ?? "related"))].sort(),
    nodeCategories: [...new Set(nodes.map(node => node.category ?? node.kind ?? "unknown"))].sort(),
    aritySequence: hyperedges.map(h => (h.members ?? []).length).sort((x,y)=>x-y)
  };
}

function roleMap(graph) {
  return new Map((graph.nodes ?? []).map(node => [node.id, node.category ?? node.kind ?? "unknown"]));
}

export function edgeClassSignatures(graph = {}) {
  const roles = roleMap(graph);
  return (graph.edges ?? []).map(edge =>
    `${roles.get(edge.source) ?? "unknown"}|${edge.relationClass ?? edge.relation ?? "related"}|${roles.get(edge.target) ?? "unknown"}`
  );
}

function propositionSignatures(graph = {}) {
  const roles = roleMap(graph);
  const edgesById = new Map((graph.edges ?? []).map(edge => [edge.id, edge]));
  return (graph.propositions ?? []).map(prop => {
    const edges = (prop.edgeIds ?? []).map(id => edgesById.get(id)).filter(Boolean);
    return edges.map(edge =>
      `${roles.get(edge.source) ?? "unknown"}|${edge.relationClass ?? edge.relation ?? "related"}|${roles.get(edge.target) ?? "unknown"}`
    );
  }).filter(list => list.length);
}

function symmetricBestMatch(signaturesA, signaturesB) {
  if (!signaturesA.length && !signaturesB.length) return 1;
  if (!signaturesA.length || !signaturesB.length) return 0;
  const best = (item, pool) => Math.max(...pool.map(other => setJaccard(item, other)));
  const a = signaturesA.reduce((sum,item)=>sum+best(item,signaturesB),0)/signaturesA.length;
  const b = signaturesB.reduce((sum,item)=>sum+best(item,signaturesA),0)/signaturesB.length;
  return (a+b)/2;
}

export function scoreGraphs(left, right) {
  const A = graphSignature(left), B = graphSignature(right);
  const roles = setJaccard(A.nodeCategories, B.nodeCategories);
  const relations = setJaccard(A.relationClasses, B.relationClasses);
  const edges = setJaccard(edgeClassSignatures(left), edgeClassSignatures(right));
  const degree = sequenceSimilarity(A.degreeSequence, B.degreeSequence);
  const propositions = symmetricBestMatch(propositionSignatures(left), propositionSignatures(right));
  const nodeCount = 1 - Math.abs(A.nodeCount-B.nodeCount)/Math.max(1,A.nodeCount,B.nodeCount);
  const edgeCount = 1 - Math.abs(A.edgeCount-B.edgeCount)/Math.max(1,A.edgeCount,B.edgeCount);

  const overall =
    0.10*roles +
    0.10*relations +
    0.25*edges +
    0.15*degree +
    0.25*propositions +
    0.075*nodeCount +
    0.075*edgeCount;

  return {
    schema:"aletheia.multiscale-graph-score.v1",
    leftGraphId:left.id,
    rightGraphId:right.id,
    overall:clamp01(overall),
    scaleScores:{
      passage:clamp01(0.30*roles+0.25*relations+0.25*degree+0.10*nodeCount+0.10*edgeCount),
      proposition:clamp01(propositions),
      edge:clamp01(edges)
    },
    components:{roles,relations,edges,degree,propositions,nodeCount,edgeCount},
    interpretation:"structural_similarity_only",
    semanticIdentity:false
  };
}

function pairwise(items, fn) {
  const out=[];
  for (let i=0;i<items.length;i+=1) for (let j=i+1;j<items.length;j+=1) out.push(fn(items[i],items[j]));
  return out;
}

function commonPrefixLength(a=[],b=[]) {
  let i=0;
  while (i<Math.min(a.length,b.length) && a[i]===b[i]) i+=1;
  return i;
}

export function hierarchyUltrametric(pathA=[], pathB=[], base=2) {
  if (JSON.stringify(pathA)===JSON.stringify(pathB)) return 0;
  return Math.pow(base,-commonPrefixLength(pathA,pathB));
}

function carrierCloseness(a=[],b=[]) {
  const n=Math.max(a.length,b.length);
  if (!n) return null;
  let different=0;
  for(let i=0;i<n;i+=1) if((a[i]??null)!==(b[i]??null)) different+=1;
  return 1-different/n;
}

export function subsetTightness(graph, nodeIds, {includeCarrier=false}={}) {
  const wanted=new Set(nodeIds);
  const nodes=(graph.nodes??[]).filter(node=>wanted.has(node.id));
  const internal=(graph.edges??[]).filter(edge=>wanted.has(edge.source)&&wanted.has(edge.target));
  const boundary=(graph.edges??[]).filter(edge=>wanted.has(edge.source)!==wanted.has(edge.target));
  const structuralCohesion = internal.length + boundary.length === 0 ? 0 : internal.length/(internal.length+boundary.length);

  const categoryCounts=new Map();
  for(const node of nodes) {
    const key=node.category??"unknown";
    categoryCounts.set(key,(categoryCounts.get(key)??0)+1);
  }
  const categoryPurity = nodes.length ? Math.max(0,...categoryCounts.values())/nodes.length : 0;

  const hierarchyPairs=pairwise(nodes,(a,b)=>1-hierarchyUltrametric(a.categoryPath??[a.category],b.categoryPath??[b.category]));
  const hierarchyCloseness = hierarchyPairs.length ? hierarchyPairs.reduce((s,x)=>s+x,0)/hierarchyPairs.length : 1;

  const carrierPairs=pairwise(nodes,(a,b)=>carrierCloseness(a.carrierAddress??[],b.carrierAddress??[])).filter(x=>x!=null);
  const carrierCompactness=carrierPairs.length?carrierPairs.reduce((s,x)=>s+x,0)/carrierPairs.length:null;

  const semanticStructuralTightness=clamp01(.45*structuralCohesion+.35*hierarchyCloseness+.20*categoryPurity);
  const exploratoryCombined=includeCarrier && carrierCompactness!=null
    ? clamp01(.80*semanticStructuralTightness+.20*carrierCompactness)
    : null;

  return {
    schema:"aletheia.subset-tightness.v1",
    graphId:graph.id,
    nodeIds:[...wanted],
    internalEdgeCount:internal.length,
    boundaryEdgeCount:boundary.length,
    structuralCohesion,
    categoryPurity,
    hierarchyCloseness,
    carrierCompactness,
    semanticStructuralTightness,
    exploratoryCombined,
    carrierContributesToSemanticIdentity:false
  };
}

function topologySignatureForEdges(edgeIds, graph) {
  const edgesById=new Map((graph.edges??[]).map(e=>[e.id,e]));
  const edges=edgeIds.map(id=>edgesById.get(id)).filter(Boolean);
  const nodes=[...new Set(edges.flatMap(e=>[e.source,e.target]))];
  const degrees=new Map(nodes.map(id=>[id,0]));
  for(const e of edges){
    degrees.set(e.source,(degrees.get(e.source)??0)+1);
    degrees.set(e.target,(degrees.get(e.target)??0)+1);
  }
  return {nodeCount:nodes.length,edgeCount:edges.length,degreeSequence:[...degrees.values()].sort((a,b)=>a-b)};
}

function topologySimilarity(a,b){
  const count=(x,y)=>1-Math.abs(x-y)/Math.max(1,x,y);
  return clamp01(.35*count(a.nodeCount,b.nodeCount)+.35*count(a.edgeCount,b.edgeCount)+.30*sequenceSimilarity(a.degreeSequence,b.degreeSequence));
}

export function recursiveSelfSimilarity(graph) {
  const props=(graph.propositions??[]).map(prop=>topologySignatureForEdges(prop.edgeIds??[],graph));
  const propPairs=pairwise(props,topologySimilarity);
  const propositionTopologyConsistency=propPairs.length?propPairs.reduce((s,x)=>s+x,0)/propPairs.length:1;
  const edgeShapes=(graph.edges??[]).map(()=>({nodeCount:2,edgeCount:1,degreeSequence:[1,1]}));
  const edgePairs=pairwise(edgeShapes,topologySimilarity);
  const edgeTopologyConsistency=edgePairs.length?edgePairs.reduce((s,x)=>s+x,0)/edgePairs.length:1;

  const relations=(graph.propositions??[]).map(prop=>{
    const edgeSet=new Set(prop.edgeIds??[]);
    return (graph.edges??[]).filter(e=>edgeSet.has(e.id)).map(e=>e.relationClass??e.relation);
  });
  const relationPairs=pairwise(relations,setJaccard);
  const propositionRelationConsistency=relationPairs.length?relationPairs.reduce((s,x)=>s+x,0)/relationPairs.length:1;
  const topologySelfSimilarity=clamp01(.65*propositionTopologyConsistency+.35*edgeTopologyConsistency);

  return {
    schema:"aletheia.recursive-self-similarity.v1",
    graphId:graph.id,
    scales:{
      passage:{count:1},
      proposition:{count:props.length,topologyConsistency:propositionTopologyConsistency,relationConsistency:propositionRelationConsistency},
      edge:{count:(graph.edges??[]).length,topologyConsistency:edgeTopologyConsistency}
    },
    topologySelfSimilarity,
    relationSelfSimilarity:propositionRelationConsistency,
    fractalCandidate:topologySelfSimilarity>=.75 && props.length>=3,
    note:"Fractal candidate denotes recursive graph-shape self-similarity; it is not a proof of mathematical fractal dimension."
  };
}

export function scoreGraphSet(graphs=[]) {
  return pairwise(graphs,(a,b)=>scoreGraphs(a,b));
}
