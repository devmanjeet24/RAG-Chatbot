import { useNavigate } from "react-router-dom";

export default function Sidebar({
 conversations,onNew,onSelect,onDelete
}){

 const nav = useNavigate();

 const logout = () => {
   localStorage.removeItem("token");
   nav("/");
 };

 return(
  <div className="sidebar">

    <button className="new-btn" onClick={onNew}>
      + New Chat
    </button>

    {conversations.map(c=>(
      <div className="chat-item" key={c._id}>
        <span onClick={()=>onSelect(c)}>
          {c.title}
        </span>

        <button onClick={()=>onDelete(c._id)}>🗑</button>
      </div>
    ))}

    {/* 🔥 LOGOUT BUTTON */}
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>

  </div>
 );
}