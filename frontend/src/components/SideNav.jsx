import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React from 'react'
import { useNavigate } from "react-router-dom";
import { LuPanelLeftOpen } from "react-icons/lu";
import { MdLogout } from "react-icons/md";



const SideNav = ({
    open, setOpen,conversations, onNew, onSelect, onDelete
}) => {

    const nav = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));  



const logout = () => {
  localStorage.removeItem("token");


  nav("/");
};

    return (
        <>

            <div className="wert">
                <Sheet side="right" open={open} onOpenChange={setOpen}>
                    <SheetTrigger className="p-5 trigger-btn"><LuPanelLeftOpen size={25}/></SheetTrigger>
                    <SheetContent 
                    side="left" 
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <SheetHeader>

                            <div className="sidebar">



                                <button className="new-btn" onClick={onNew}>
                                    + New Chat
                                </button>

                                {conversations.map(c => (
                                    <div className="chat-item" key={c._id}>
                                        <span onClick={() => onSelect(c)}>
                                            {c.title}
                                        </span>

                                        <button onClick={() => onDelete(c._id)}>🗑</button>
                                    </div>
                                ))}

                                {/* 🔥 LOGOUT BUTTON */}

                                <div className="logout-profile">

                                  {/* <span>👋 Hi {user?.name }</span> */}



                                    <button className="logout-btn" onClick={logout}>
                                       <span><MdLogout /></span> Logout
                                    </button>
                                </div>

                            </div>

                        </SheetHeader>
                    </SheetContent>
                </Sheet>

            </div>

        </>
    )
}

export default SideNav