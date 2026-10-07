const KEY='nexus-webos-ai:v2';
const defaults={provider:'openai',model:'',endpoint:'',apiKey:'',agent:'General Assistant',chats:[]};
let state=(()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}})();
export const aiStore={
 get:()=>state,
 set(p){state={...state,...p};this.persist()},
 addChat(chat){state={...state,chats:[chat,...state.chats]};this.persist()},
 updateChats(chats){state={...state,chats};this.persist()},
 persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}},
 reset(){state={...defaults};this.persist()}
};
