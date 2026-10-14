ClearAll[gGenesis, gEnoch, gPrometheus, motifTransfer, motifTransform, motifConsequence];

gGenesis = Graph[
  {1 -> 2, 2 -> 3, 3 -> 5, 5 -> 4, 5 -> 6, 6 -> 7, 7 -> 4, 1 -> 8, 8 -> 3, 8 -> 4},
  DirectedEdges -> True
];

gEnoch = Graph[
  {1 -> 2, 2 -> 3, 3 -> 9, 9 -> 5, 3 -> 5, 5 -> 6, 5 -> 4, 6 -> 7, 7 -> 4, 1 -> 8, 8 -> 3, 8 -> 4},
  DirectedEdges -> True
];

gPrometheus = Graph[
  {1 -> 2, 2 -> 3, 3 -> 6, 3 -> 5, 5 -> 6, 5 -> 4, 6 -> 7, 7 -> 4, 1 -> 8, 8 -> 3},
  DirectedEdges -> True
];

motifTransfer = Graph[{1 -> 2, 2 -> 3, 3 -> 4, 3 -> 5}, DirectedEdges -> True];
motifTransform = Graph[{1 -> 2, 2 -> 3}, DirectedEdges -> True];
motifConsequence = Graph[{1 -> 2, 2 -> 3}, DirectedEdges -> True];

graphs = <|"Genesis" -> gGenesis, "Enoch" -> gEnoch, "Prometheus" -> gPrometheus|>;

receipt = Map[
  Function[g,
    <|
      "VertexCount" -> VertexCount[g],
      "EdgeCount" -> EdgeCount[g],
      "DegreeSequence" -> Sort[VertexDegree[UndirectedGraph[g]]],
      "TransferMotifPresent" -> IsomorphicSubgraphQ[motifTransfer, g],
      "TransformMotifPresent" -> IsomorphicSubgraphQ[motifTransform, g],
      "ConsequenceMotifPresent" -> IsomorphicSubgraphQ[motifConsequence, g],
      "AutomorphismOrder" -> GroupOrder[GraphAutomorphismGroup[g]]
    |>
  ],
  graphs
];

<|
  "Schema" -> "aletheia.wolfram.triptych-check.v1",
  "Graphs" -> receipt,
  "GenesisPrometheusIsomorphic" -> IsomorphicGraphQ[gGenesis, gPrometheus],
  "AllShareTransferMotif" -> And @@ (IsomorphicSubgraphQ[motifTransfer, #] & /@ Values[graphs]),
  "AllShareTransformMotif" -> And @@ (IsomorphicSubgraphQ[motifTransform, #] & /@ Values[graphs]),
  "AllShareConsequenceMotif" -> And @@ (IsomorphicSubgraphQ[motifConsequence, #] & /@ Values[graphs])
|>
