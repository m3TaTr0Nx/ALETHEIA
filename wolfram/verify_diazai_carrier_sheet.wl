ClearAll[decode6, encode6, toZ9, fromZ9];

decode6[n_Integer] := IntegerDigits[n, 3, 6];
encode6[d_List] := FromDigits[d, 3];

toZ9[d_List] := Mod[
  {
    d[[1]] + 3 d[[4]],
    d[[2]] + 3 d[[5]],
    d[[3]] + 3 d[[6]]
  },
  9
];

fromZ9[z_List] := Join[Mod[z, 3], Quotient[z, 3]];

rows = Table[
  d = decode6[n];
  z = toZ9[d];
  <|
    "index729" -> n,
    "f3" -> d,
    "z9" -> z,
    "roundTripIndex" -> encode6[fromZ9[z]]
  |>,
  {n, 0, 728}
];

bijectionOK =
  Length[DeleteDuplicates[rows[[All, "z9"]]]] == 729 &&
  And @@ (#[["index729"]] == #[["roundTripIndex"]] & /@ rows);

pairs = Tuples[Range[0, 728], 2];
additiveHomomorphismViolationCount = Count[
  pairs,
  {a_, b_} /;
    toZ9[Mod[decode6[a] + decode6[b], 3]] =!=
    Mod[toZ9[decode6[a]] + toZ9[decode6[b]], 9]
];

receipt = <|
  "schema" -> "aletheia.wolfram.diazai-carrier-check.v1",
  "cellCount" -> 729,
  "bijectionOK" -> bijectionOK,
  "uniqueZ9Triples" -> Length[DeleteDuplicates[rows[[All, "z9"]]]],
  "additiveHomomorphismViolationCount" -> additiveHomomorphismViolationCount,
  "typedBoundaryPreserved" -> (additiveHomomorphismViolationCount > 0)
|>;

Print[ExportString[receipt, "JSON", "Compact" -> False]];
