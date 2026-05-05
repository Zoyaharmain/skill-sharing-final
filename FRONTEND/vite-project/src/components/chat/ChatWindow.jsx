import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../socket/socket";
import API from "../../api/axios";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ user, selectedChat, onRefreshChats }) => {
  const socket = getSocket();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 🔹 GET OTHER USER (stable reference)
  const selectedUser = (() => {
    if (!selectedChat) return null;

    if (selectedChat.otherUser?._id) {
      return selectedChat.otherUser;
    }

    if (selectedChat.members && user?._id) {
      const other = selectedChat.members.find((m) => {
        const id = typeof m === "object" ? m._id : m;
        return String(id) !== String(user._id);
      });

      return typeof other === "object"
        ? other
        : { _id: other, username: "User" };
    }

    return null;
  })();

  // ================= LOAD MESSAGES =================
  useEffect(() => {
    if (!selectedChat?._id) return;

    const loadChat = async () => {
      setLoading(true);
      try {
        setConversationId(selectedChat._id);

        const res = await API.get(`/chat/messages/${selectedChat._id}`);
        const msgs = res.data?.data || res.data || [];

        setMessages(msgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();

    return () => {
      setMessages([]);
      setConversationId(null);
      setTyping(false);
    };
  }, [selectedChat?._id]);

  // ================= SOCKET RECEIVE =================
  useEffect(() => {
    if (!conversationId || !socket) return;

   const handleReceiveMessage = (data) => {
  if (!data?.text) return;
  if (String(data.conversationId) !== String(conversationId)) return;

  const senderId = String(data.sender?._id || data.senderId || "");

  // 💣 HARD BLOCK: NEVER process own message
  if (senderId === String(user?._id)) {
    return;
  }

  setMessages((prev) => {
    const exists = prev.some((m) => m._id === data._id);
    if (exists) return prev;
    return [...prev, data];
  });

  // 🔥 ONLY trigger refresh for OTHER USER messages
  // 🔥 DELAYED SAFE NOTIFICATION TRIGGER
setTimeout(() => {
  const senderId = String(data.sender?._id || data.senderId || "");

  // 💣 ONLY AFTER STABLE CHECK
  if (senderId !== String(user?._id)) {
    onRefreshChats?.();
  }
}, 0);
};
    socket.on("getMessage", handleReceiveMessage);

    return () => socket.off("getMessage", handleReceiveMessage);
  }, [conversationId, socket]);

  // ================= TYPING =================
  useEffect(() => {
    if (!conversationId || !socket) return;

    const handleTyping = ({ senderId, conversationId: convId }) => {
      if (senderId !== selectedUser?._id || convId !== conversationId) return;

      setTyping(true);

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1500);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser?._id, conversationId, socket]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ================= SEND =================
  const handleSend = async (text) => {
    if (!text.trim() || !conversationId) return;

    const tempId = Date.now();

    const tempMessage = {
      _id: tempId,
      text,
      sender: { _id: user?._id },
      conversationId,
      createdAt: new Date().toISOString(),
    };

    try {
      setMessages((prev) => [...prev, tempMessage]);

      const res = await API.post("/chat/message", {
        conversationId,
        text,
      });

      const saved = res.data?.data || res.data;

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? saved : m))
      );

      socket.emit("sendMessage", {
        ...saved,
        receiverId: selectedUser?._id,
        conversationId,
      });

      onRefreshChats?.();
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // ================= UI =================
  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--bg)]">

      {/* HEADER */}
      {selectedUser && (
        <div className="flex justify-between p-4 border-b bg-[var(--card)] shrink-0">
          <div>{selectedUser.username}</div>

          <button
            onClick={() => window.dispatchEvent(new Event("openChats"))}
            className="md:hidden"
          >
            ☰
          </button>
        </div>
      )}

      {!selectedUser ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          Select a chat
        </div>
      ) : loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <>
          {/* 🔥 SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((msg) => {
              // 💣 FINAL FIX: compare with selectedUser ONLY
              const isOwn =
                String(msg.sender?._id || msg.senderId) !==
                String(selectedUser?._id);

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[65%] px-4 py-2 rounded-2xl shadow-sm
                      ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }
                    `}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {typing && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>

          {/* INPUT */}
          <ChatInput onSend={handleSend} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;