import { useEffect,useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat(){

 const [conversations,setConversations]=useState([]);
 const [current,setCurrent]=useState(null);
 const [messages,setMessages]=useState([]);

 useEffect(()=>{ loadConversations(); },[]);

 useEffect(()=>{
  const handler = (e)=>{
    setConversations(e.detail);
  };

  window.addEventListener("refreshConversations",handler);

  return ()=>{
    window.removeEventListener(
      "refreshConversations",
      handler
    );
  };
},[]);

 const loadConversations = async()=>{
   const res = await API.get("/conversations");
   setConversations(res.data.data);
 };

 const newChat = async()=>{
   const res = await API.post("/conversations");
   setCurrent(res.data.data);
   setMessages([]);
   loadConversations();
 };

 const openConversation = async(conv)=>{
   setCurrent(conv);
   const res = await API.get(`/messages/${conv._id}`);
   setMessages(res.data.data);
 };

//  const deleteChat = async(id)=>{
//    await API.delete(`/conversations/${id}`);
//    loadConversations();
//  };

const deleteChat = async(id)=>{
  await API.delete(`/conversations/${id}`);

  // 🔥 FIX
  if(current?._id === id){
    setCurrent(null);
    setMessages([]);
  }

  loadConversations();
};

 return(
  <div className="app">

    <Sidebar
      conversations={conversations}
      onNew={newChat}
      onSelect={openConversation}
      onDelete={deleteChat}
    />

    <ChatWindow
      current={current}
      messages={messages}
      setMessages={setMessages}
    />

  </div>
 );
}