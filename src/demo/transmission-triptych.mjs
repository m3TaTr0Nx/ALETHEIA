function node(id,label,category,subcategory,path){
  return {id,label,category,subcategory,categoryPath:path??[category,subcategory]};
}
function edge(id,source,target,relationClass,sourceRelation){
  return {id,source,target,relationClass,sourceRelation};
}
function proposition(id,label,edgeIds){return{id,label,edgeIds,members:[...edgeIds]}}

export const demoGraphs=[
  {
    id:"graph:genesis-3",
    source:{
      title:"Genesis",
      passage:"Genesis 3:1-19",
      edition:"King James Version",
      publicDomain:true,
      url:"https://www.kingjamesbibleonline.org/Genesis-Chapter-3_Original-1611-KJV/",
      summary:"A non-human agent persuades human recipients to cross a divine prohibition involving knowledge; a changed human state and judgment follow."
    },
    mutation:{rho:2,mu:1,sigma:0},
    nodes:[
      node("g:authority","God","authority","divine_authority"),
      node("g:boundary","Prohibition","norm","prohibition"),
      node("g:agent","Serpent","agent","persuader"),
      node("g:recipient","Woman and man","recipient","human_pair"),
      node("g:capability","Knowledge of good and evil","capability","knowledge"),
      node("g:transfer","Fruit / persuasion transfer","event","mediated_access"),
      node("g:transformation","Eyes opened / changed awareness","state","awareness_change"),
      node("g:consequence","Judgment / consequences","state","judgment")
    ],
    edges:[
      edge("g:e1","g:authority","g:boundary","defines","prohibits"),
      edge("g:e2","g:boundary","g:agent","constrains","boundary applies"),
      edge("g:e3","g:agent","g:transfer","initiates","persuades"),
      edge("g:e4","g:transfer","g:capability","delivers","mediates access"),
      edge("g:e5","g:transfer","g:recipient","targets","offers to humans"),
      edge("g:e6","g:capability","g:transformation","enables","knowledge changes state"),
      edge("g:e7","g:transformation","g:recipient","affects","awareness changes humans"),
      edge("g:e8","g:authority","g:consequence","judges","pronounces consequences"),
      edge("g:e9","g:consequence","g:agent","affects","serpent is judged"),
      edge("g:e10","g:consequence","g:recipient","affects","humans receive consequences")
    ],
    propositions:[
      proposition("g:p1","Authority and boundary",["g:e1","g:e2"]),
      proposition("g:p2","Transfer",["g:e3","g:e4","g:e5"]),
      proposition("g:p3","Recipient transformation",["g:e6","g:e7"]),
      proposition("g:p4","Consequence",["g:e8","g:e9","g:e10"])
    ]
  },
  {
    id:"graph:enoch-6-10",
    source:{
      title:"1 Enoch",
      passage:"1 Enoch 6-10",
      edition:"R. H. Charles tradition / public-domain lineage",
      publicDomain:true,
      url:"https://sacred-texts.com/bib/boe/",
      summary:"A coordinated group of Watchers crosses an assigned boundary, teaches humans restricted or dangerous knowledge and techniques, and becomes subject to divine judgment."
    },
    mutation:{rho:2,mu:1,sigma:0},
    nodes:[
      node("e:authority","Divine authority","authority","divine_authority"),
      node("e:boundary","Assigned role / boundary","norm","assigned_role"),
      node("e:agent","Watchers / Azazel","agent","watcher_collective"),
      node("e:coordination","Oath / coordination","event","oath_coordination"),
      node("e:recipient","Humans","recipient","humans"),
      node("e:capability","Technical / secret knowledge","capability","technical_secret_knowledge"),
      node("e:transfer","Teaching","event","teaching"),
      node("e:transformation","Capability expansion / corruption","state","capability_corruption"),
      node("e:consequence","Judgment","state","judgment")
    ],
    edges:[
      edge("e:e1","e:authority","e:boundary","defines","assigns role"),
      edge("e:e2","e:boundary","e:agent","constrains","role boundary"),
      edge("e:e3","e:agent","e:coordination","coordinates","oath / collective action"),
      edge("e:e4","e:coordination","e:transfer","enables","coordination enables teaching"),
      edge("e:e5","e:agent","e:transfer","initiates","teaches"),
      edge("e:e6","e:transfer","e:capability","delivers","transmits knowledge"),
      edge("e:e7","e:transfer","e:recipient","targets","teaches humans"),
      edge("e:e8","e:capability","e:transformation","enables","knowledge expands capability"),
      edge("e:e9","e:transformation","e:recipient","affects","human state changes"),
      edge("e:e10","e:authority","e:consequence","judges","orders judgment"),
      edge("e:e11","e:consequence","e:agent","affects","Watchers receive punishment"),
      edge("e:e12","e:consequence","e:recipient","affects","human world bears consequences")
    ],
    propositions:[
      proposition("e:p1","Authority, boundary, and coordination",["e:e1","e:e2","e:e3"]),
      proposition("e:p2","Transfer",["e:e4","e:e5","e:e6","e:e7"]),
      proposition("e:p3","Recipient transformation",["e:e8","e:e9"]),
      proposition("e:p4","Consequence",["e:e10","e:e11","e:e12"])
    ]
  },
  {
    id:"graph:prometheus-bound",
    source:{
      title:"Prometheus Bound",
      passage:"Prometheus Bound, fire/arts and punishment sequence",
      edition:"Aeschylus; Theodore Alois Buckley translation",
      publicDomain:true,
      url:"https://www.gutenberg.org/ebooks/27458",
      summary:"Prometheus violates Zeus's order, transfers fire and arts to mortals, changes human capability, and is punished."
    },
    mutation:{rho:2,mu:1,sigma:0},
    nodes:[
      node("p:authority","Zeus","authority","sovereign_authority"),
      node("p:boundary","Divine order","norm","divine_prohibition"),
      node("p:agent","Prometheus","agent","benefactor_transgressor"),
      node("p:recipient","Mortals","recipient","mortals"),
      node("p:capability","Fire and arts","capability","fire_and_arts"),
      node("p:transfer","Gift / teaching","event","gift_teaching"),
      node("p:transformation","Human arts / capability","state","civilizing_change"),
      node("p:consequence","Binding / punishment","state","punishment")
    ],
    edges:[
      edge("p:e1","p:authority","p:boundary","defines","issues command"),
      edge("p:e2","p:boundary","p:agent","constrains","forbids transfer"),
      edge("p:e3","p:agent","p:capability","obtains","takes fire"),
      edge("p:e4","p:agent","p:transfer","initiates","gives / teaches"),
      edge("p:e5","p:transfer","p:capability","delivers","transfers fire and arts"),
      edge("p:e6","p:transfer","p:recipient","targets","benefits mortals"),
      edge("p:e7","p:capability","p:transformation","enables","enables arts"),
      edge("p:e8","p:transformation","p:recipient","affects","changes mortal capability"),
      edge("p:e9","p:authority","p:consequence","judges","orders punishment"),
      edge("p:e10","p:consequence","p:agent","affects","Prometheus is bound")
    ],
    propositions:[
      proposition("p:p1","Authority, boundary, and acquisition",["p:e1","p:e2","p:e3"]),
      proposition("p:p2","Transfer",["p:e4","p:e5","p:e6"]),
      proposition("p:p3","Recipient transformation",["p:e7","p:e8"]),
      proposition("p:p4","Consequence",["p:e9","p:e10"])
    ]
  }
];

export const demoSubsets={
  transfer:["agent","event","capability","recipient"],
  governance:["authority","norm","agent","state"],
  recipientChange:["capability","state","recipient"]
};
