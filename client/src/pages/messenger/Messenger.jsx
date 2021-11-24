import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { EmojiEmotions, PermMedia } from "@material-ui/icons";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const [file, setFile] = useState(null);

  //emoji workkkk...................
  const useOutsideClick = (initialValue) => {
    const ref = useRef(null);
    const [showEmoji, setShowEmoji] = useState(initialValue);

    const handleClickOutside = (event) => {

      if (ref.current && !ref.current.contains(event.target)) setShowEmoji(false);
    }

    useEffect(() => {
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [ref]);

    return { showEmoji, setShowEmoji, ref }
  }

  const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)
  const handleEmojiShow = () => { setShowEmoji((v) => !v) }
  const handleEmojiSelect = (e) => { setNewMessage((newMessage) => (newMessage += e.native)) }

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        image:data.image,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.friends.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      message.image = fileName;
      //console.log(message);

      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
      try {
        const res = await axios.post("/messages", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
        image: fileName,
      });
      setFile(null);
    } else {
      message.image = null;
      try {
        const res = await axios.post("/messages", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }

      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
        image: null,
      });
    }

  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {console.log(conversations)}
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>

        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                {/*emoji workkkkkkk */}
                <div className="divBreaker">
                  <div className="emoji-margin-left">
                    <EmojiEmotions onClick={handleEmojiShow} />
                  </div>
                  
                    {showEmoji && (
                      <div ref={ref}>
                        <Picker
                          onSelect={handleEmojiSelect}
                          emojiSize={20} />
                      </div>
                    )}
                  
                  {/*image work.......*/}
                  <label htmlFor="file" className="shareOption emoji-margin-left">
                    <PermMedia htmlColor="tomato" className="shareIcon" />
                    <span className="shareOptionText"></span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  {file ? <label>{file.name}</label> : <label></label>}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}

                  ></textarea>


                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}