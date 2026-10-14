export function wolframHypergraphProgram(hyperedges = []) {
  const data = JSON.stringify(hyperedges.map(h => h.members ?? h));
  return `hg = ${data.replace(/\[/g,'{').replace(/\]/g,'}')};\n` +
    `canon = PacletSymbol["WolframInstitute/Hypergraph", "CanonicalHypergraph"][hg];\n` +
    `isoClass = PacletSymbol["WolframInstitute/Hypergraph", "HypergraphIsoClass"][hg];\n` +
    `matrix = PacletSymbol["WolframInstitute/Hypergraph", "HyperMatrix"][hg];\n` +
    `<|"Canonical"->canon,"IsoClass"->isoClass,"HyperMatrix"->matrix|>`;
}

export function wolframMultiwayProgram(rules = [], initial = []) {
  const r = JSON.stringify(rules).replace(/\[/g,'{').replace(/\]/g,'}');
  const i = JSON.stringify(initial).replace(/\[/g,'{').replace(/\]/g,'}');
  return `m = PacletSymbol["Wolfram/Multicomputation", "MultiwaySystem"][${r}, ${i}];\n` +
    `<|"StatesGraph"->m["StatesGraph"],"BranchialGraph"->m["BranchialGraph"],"CausalGraph"->m["CausalGraph"]|>`;
}

export function wolframFiniteFieldProgram(labels = [], q = 256) {
  const names = JSON.stringify(labels);
  return `labels = ${names}; field = FiniteField[${q}];\n` +
    `indices = Mod[Hash[#, "SHA256"], ${q}]& /@ labels;\n` +
    `elements = FromFiniteFieldIndex[indices, field];\n` +
    `<|"Field"->field,"Indices"->indices,"Elements"->elements|>`;
}
