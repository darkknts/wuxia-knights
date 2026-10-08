export const MAPS={
  village:{id:"village",name:"청운촌",width:960,height:540,spawn:{x:480,y:360},
    buildings:[
      {id:"inn",name:"주막",x:125,y:105,w:150,h:100,icon:"🏮"},
      {id:"blacksmith",name:"대장간",x:685,y:105,w:150,h:100,icon:"⚒"},
      {id:"shop",name:"상점",x:125,y:330,w:150,h:100,icon:"🏪"},
      {id:"guild",name:"기사단 길드",x:685,y:330,w:150,h:100,icon:"⚔"}
    ],
    trees:[[55,55],[875,55],[55,430],[875,430],[250,65],[710,465]],
    portals:[{id:"east-field",name:"청운 평야",x:850,y:260,w:70,h:70}]
  },
  field:{id:"east-field",name:"청운 평야",width:960,height:540,spawn:{x:110,y:270},
    buildings:[],trees:[[70,70],[170,430],[330,75],[560,430],[760,70],[880,430],[470,90]],
    portals:[{id:"village",name:"청운촌",x:35,y:235,w:70,h:70}]
  }
};
export function getMap(id){return MAPS[id]||MAPS.village}
