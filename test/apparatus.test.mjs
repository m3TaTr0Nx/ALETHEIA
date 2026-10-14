import test from "node:test";
import assert from "node:assert/strict";
import {buildApparatusDemo} from "../src/demo/apparatus-demo.mjs";
import {gcd,lcm,laneTicks,buildCoreGlassChannels,channelPair,discreteGaugeIntegral} from "../src/glass/lcm60-glass.mjs";
import {scoreGraphs,subsetTightness} from "../src/graph/multiscale.mjs";

test("demo produces three pairwise structural scores above 0.75",()=>{
  const demo=buildApparatusDemo();
  assert.equal(demo.graphs.length,3);
  assert.equal(demo.scores.length,3);
  for(const score of demo.scores){
    assert.ok(score.overall>.75,`${score.leftGraphId}/${score.rightGraphId}: ${score.overall}`);
    assert.equal(score.semanticIdentity,false);
  }
});

test("multiscale scoring is deterministic",()=>{
  const demo=buildApparatusDemo();
  const [a,b]=demo.graphs;
  assert.deepEqual(scoreGraphs(a,b),scoreGraphs(a,b));
});

test("LCM60 channel semantics are exact",()=>{
  assert.equal(gcd(4,6),2);
  assert.equal(lcm(4,6),12);
  assert.deepEqual(laneTicks(6,60),[6,12,18,24,30,36,42,48,54,60]);
  const channels=buildCoreGlassChannels();
  const pair=channelPair(channels[3],channels[5],60);
  assert.equal(pair.lcmWhen,12);
  assert.equal(pair.gcdWhich,2);
  assert.equal(pair.syncCount,5);
});

test("gauge integral is explicitly derived and bounded",()=>{
  const [source]=buildCoreGlassChannels();
  const receipt=discreteGaugeIntegral(source,{cycle:60});
  assert.equal(receipt.canonStatus,"derived-not-diazai-canon");
  assert.ok(receipt.normalized>=0&&receipt.normalized<=1);
});

test("subset tightness separates structural score from carrier compactness",()=>{
  const demo=buildApparatusDemo();
  const graph=demo.graphs[0];
  const ids=graph.nodes.slice(0,4).map(n=>n.id);
  const receipt=subsetTightness(graph,ids,{includeCarrier:true});
  assert.ok(receipt.semanticStructuralTightness>=0&&receipt.semanticStructuralTightness<=1);
  assert.ok(receipt.carrierCompactness>=0&&receipt.carrierCompactness<=1);
  assert.equal(receipt.carrierContributesToSemanticIdentity,false);
});
