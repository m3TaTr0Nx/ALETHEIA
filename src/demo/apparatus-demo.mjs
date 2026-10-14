import {demoGraphs,demoSubsets} from "./transmission-triptych.mjs";
import {scoreGraphSet,recursiveSelfSimilarity,subsetTightness} from "../graph/multiscale.mjs";
import {buildCoreGlassChannels,buildGlassMatrix} from "../glass/lcm60-glass.mjs";
import {deriveComparativeClaims} from "../philosophy/engine.mjs";
import {canonReceipt} from "../diazai/static-canon.mjs";
import {buildLexicographicCarrierSheets} from "../../lib/diazai-carrier-sheet.mjs";

function attachCarrierAddresses(graphs){
  const lexemes=[...new Set(graphs.flatMap(g=>g.nodes.map(n=>n.subcategory)))];
  const carrierBundle=buildLexicographicCarrierSheets(lexemes,{corpusId:"demo:transmission-triptych",canonRef:"external:diazai-canon"});
  const byLexeme=new Map(carrierBundle.sheets.flatMap(sheet=>sheet.cells).map(cell=>[cell.lexeme,cell]));
  const enriched=graphs.map(graph=>({
    ...graph,
    nodes:graph.nodes.map(node=>{
      const cell=byLexeme.get(node.subcategory);
      return {...node,carrierAddress:cell?.carrier.address??null,carrierCellId:cell?.cellId??null};
    })
  }));
  return {graphs:enriched,carrierBundle};
}

function subsetByCategories(graph,categories){
  return graph.nodes.filter(n=>categories.includes(n.category)).map(n=>n.id);
}

export function buildApparatusDemo(){
  const {graphs,carrierBundle}=attachCarrierAddresses(demoGraphs);
  const scores=scoreGraphSet(graphs);
  const selfSimilarity=graphs.map(recursiveSelfSimilarity);
  const subsets=Object.fromEntries(graphs.map(graph=>[
    graph.id,
    Object.fromEntries(Object.entries(demoSubsets).map(([name,categories])=>[
      name,
      subsetTightness(graph,subsetByCategories(graph,categories),{includeCarrier:true})
    ]))
  ]));
  const glass=buildGlassMatrix(buildCoreGlassChannels(),60);
  const claims=deriveComparativeClaims(graphs,scores);

  return {
    schema:"aletheia.research-apparatus.demo.v1",
    generatedAt:new Date().toISOString(),
    purpose:"Demonstrate multiscale structural analogy without asserting source identity.",
    graphs,carrierBundle,scores,
    minimumPairwiseSimilarity:Math.min(...scores.map(x=>x.overall)),
    selfSimilarity,subsets,glass,
    canon:canonReceipt(["M2","M11","M13","M14"]),
    claims,
    firewalls:{diazaiWrite:false,grandStateWrite:false,ultracodeWrite:false,mint:false}
  };
}
