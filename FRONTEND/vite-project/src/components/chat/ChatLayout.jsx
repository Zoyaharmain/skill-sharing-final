import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import API from "../../api/axios";
import { connectSocket } from "../../socket/socket";

const ChatLayout = ({ user }) => {
  const { id } = useParams();

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [openChats, setOpenChats] = useState(false); // 👈 mobile toggle
  
useEffect(() => {
  const handleOpen = () => setOpenChats(true);
  window.addEventListener("openChats", handleOpen);

  return () => window.removeEventListener("openChats", handleOpen);
}, []);
  // SOCKET
  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user);
  }, [user]);

  // FETCH CHATS
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        const res = await API.get("/chat/conversations");
        const chats = res.data?.conversations || [];

        setConversations(chats);

        if (selectedChat) {
          const updated = chats.find(c => c._id === selectedChat._id);
          if (updated) setSelectedChat(updated);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, [user, refresh]);

  // URL CHAT
  useEffect(() => {
    if (!id || !conversations.length) return;
    const chat = conversations.find(c => c._id === id);
    if (chat) setSelectedChat(chat);
  }, [id, conversations]);

  return (
    <div className="flex h-[calc(100vh-70px)] bg-[var(--bg)] overflow-hidden">

      {/* 🔹 MOBILE CHAT LIST (OVERLAY) */}
      {openChats && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <div className="w-[75%] h-full bg-[var(--bg)]">
            <ChatSidebar
              conversations={conversations}
              selectedChat={selectedChat}
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setOpenChats(false); // close after click
              }}
              user={user}
            />
          </div>
        </div>
      )}

      {/* 🔹 DESKTOP SIDEBAR */}
      <div className="hidden md:block w-[25%] border-r border-[var(--border)]">
        <ChatSidebar
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          user={user}
        />
      </div>

      {/* 🔹 CHAT WINDOW */}
      <div className="flex-1 flex flex-col">

        {/* 🔹 MOBILE HEADER */}
        

        <div className="flex-1 min-w-0">
          <ChatWindow
            key={selectedChat?._id}
            selectedChat={selectedChat}
            user={user}
            onRefreshChats={() => setRefresh(prev => !prev)}
          />
        </div>

      </div>
    </div>
  );
};

export default ChatLayout;
