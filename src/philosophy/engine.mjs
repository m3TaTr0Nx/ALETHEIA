function hasRelation(graph, relationClass){
  return (graph.edges??[]).some(edge=>(edge.relationClass??edge.relation)===relationClass);
}

export function deriveComparativeClaims(graphs, scoreReceipts){
  const all = predicate => graphs.every(predicate);
  const minSimilarity = scoreReceipts.length ? Math.min(...scoreReceipts.map(x=>x.overall)) : 0;
  const claims=[];

  if(all(g=>hasRelation(g,"constrains")&&hasRelation(g,"delivers")&&hasRelation(g,"judges"))){
    claims.push({
      id:"claim:boundary-transfer-consequence",
      proposition:"All demo graphs represent capability transfer inside an authority/boundary structure and include a consequence or judgment relation.",
      class:"philosophical",
      inference:{rule:"structural_comparison"},
      support:{graphIds:graphs.map(g=>g.id),minimumPairwiseStructuralSimilarity:minSimilarity},
      epistemicStatus:"supported_by_normalized_graph_structure",
      mutation:{rho:2,mu:1,sigma:0},
      semanticIdentity:false
    });
  }

  if(all(g=>hasRelation(g,"enables")&&hasRelation(g,"affects"))){
    claims.push({
      id:"claim:capability-recipient-state",
      proposition:"Each demo graph contains a capability-to-transformation relation followed by an effect on a human recipient.",
      class:"philosophical",
      inference:{rule:"structural_comparison"},
      support:{graphIds:graphs.map(g=>g.id)},
      epistemicStatus:"supported_by_normalized_graph_structure",
      mutation:{rho:2,mu:1,sigma:0},
      semanticIdentity:false
    });
  }

  claims.push({
    id:"claim:nonidentity-boundary",
    proposition:"High graph similarity is evidence of structural analogy only; it does not establish historical dependence, theological identity, or semantic equivalence.",
    class:"methodological",
    inference:{rule:"epistemic_boundary"},
    support:{scoreReceiptCount:scoreReceipts.length},
    epistemicStatus:"protocol_invariant",
    mutation:{rho:0,mu:0,sigma:0},
    semanticIdentity:false
  });

  return claims;
}
