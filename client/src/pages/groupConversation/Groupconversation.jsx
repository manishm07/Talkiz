import "./groupConversation.css";
import Topbar from "../../components/topbar/Topbar";
import GroupConvo from "../../groupConvo/GroupConvo";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { EmojiEmotions, PermMedia } from "@material-ui/icons";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Add, Check } from "@material-ui/icons";

export default function Messenger() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
    const [btn, setBtn] = useState(false);
    const [createPage, setCreatePage] = useState(false);
    const [Sdata, setSData] = useState();
    const unamee = useRef();
    const [searchPage, setSearchPage] = useState(false);
    const [addbtn, setAddBtn] = useState(false);
    const [addData, setAddData] = useState(null);
    const gname = useRef();
    const [joinpage, setJoinPage] = useState(false);
    const [groupData, setGroupData] = useState();
    const [error, setError] = useState();
    const [active, setActive] = useState(false);
    const [GroupID, setGroupId] = useState();





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
        socket.current.on("getMessages", (data) => {
            console.log(data);
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                image:data.image,
                _id:data._id,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    // useEffect(() => {
    //     socket.current.emit("addUser", user._id);
    //     socket.current.on("getUsers", (users) => {
    //         setOnlineUsers(
    //             user.friends.filter((f) => users.some((u) => u.userId === f))
    //         );
    //     });
    // }, [user]);

    //to be changed...........................................
    useEffect(() => {

        const getConversations = async () => {
            try {
                const res = await axios.get("/groups/" + user._id);
                setConversations(res.data);
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    //set currentchat function...................
    function convo(e) {
        setGroupData(e);
        setGroupId(e._id);
        setCurrentChat(e);
        setBtn(true);
       
    }

    //to be changed.......................................
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

    // button send Request................................................
    function sendReq(e) {
        setAddData(e);
        setAddBtn(true);
    }

    function cancelReq(e) {
        setAddData(null);
        setAddBtn(false);
    }

    //create group button..........................
    const Created = () => {
        console.log(addData);
        const GroupName = gname.current.value;
        if (addData !== null && GroupName !== "") {
            try {
                const res = axios.post(`http://localhost:8800/api/groups`,
                    { groupName: GroupName, senderId: user._id, receiverId: addData });
                console.log(res._id);
            } catch (err) {
                console.log(err);
            }
            alert("Group Created");
            setCreatePage(false);
            window.location.reload();
            console.log("chat created..");
        }
        else {
            alert("Please Add GroupName & Add Friend");
        }
    }

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
            socket.current.emit("sendMessages", {
                senderId: user._id,
                GroupID,
                text: newMessage,
                _id:user._id,
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

            socket.current.emit("sendMessages", {
                senderId: user._id,
                GroupID,
                text: newMessage,
                _id:user._id,
                image: null,
            });
            setFile(null);
        }

    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    //search friend button...................................
    const search = async () => {
        const uname = unamee.current.value;
        var temp = null;
        if (uname.match(/.+@.+/)) {
            let data = JSON.stringify({
                "email": uname
            });
            try {

                const res = await axios.get('http://localhost:8800/api/users/search',
                    { params: { data: data } });

                console.log(res.data);

                setSData(res.data);
                temp = res.data;
            } catch (err) {
                console.log(err);
            }
        } else {
            let data = JSON.stringify({
                "username": uname
            });
            try {

                const res = await axios.get('http://localhost:8800/api/users/search',
                    { params: { data: data } });

                console.log(res);

                setSData(res.data);
                temp = res.data;
            } catch (err) {
                console.log(err);
            }
        }
        if (temp !== null) {
            if (user._id === temp._id) {
                setError("User Not Found");
            } else {
                if (temp.blocked.includes(user._id)) {
                    setError("User Not Found");
                } else {
                    if (temp.blockedBy.includes(user._id)) {
                        setError("User Not Found");
                    } else {
                        if (temp.friends.includes(user._id)) {
                            if (active === true) {
                                setSearchPage(true);
                            } else {
                                if (groupData.members.includes(temp._id)) {
                                    setError("User Already Added");
                                }
                                else {
                                    setSearchPage(true);
                                }
                            }
                        } else {
                            setError("User Not Found");
                        }
                    }
                }
            }
        } else {
            setError("User Not Found");
        }

    }

    //add friend in group.....................................
    function Addingroup(e) {
        const temp = e._id;
        console.log(temp);
        try {
            const res = axios.put(`http://localhost:8800/api/groups//addMember/${groupData._id}`, { userId: temp });
            console.log(res._id);
            alert("Friend Added");
            setAddBtn(true);
        } catch (err) {
            console.log(err);
        }
    }

    //create page button filter.....................................
    const createPagesss = () => {
        setCreatePage(true);
        setActive(true);
    }



    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    {!btn ?
                        <div className="create-button">
                            <button onClick={createPagesss}>Create Group</button>
                        </div>
                        :
                        <div className="create-button">
                            <button onClick={() => setJoinPage(true)}>Add Members</button>
                        </div>
                    }
                    {!joinpage ?
                        !createPage ?

                            <div className="chatMenuWrapper">
                                {conversations.map((c) => (
                                    <div onClick={() => convo(c)}>
                                        <GroupConvo conversation={c} />
                                    </div>
                                ))}
                            </div>
                            :
                            <div className="chatMenuWrapper">
                                <input placeholder="Enter Group Name" required ref={gname} />
                                <div>
                                    <input placeholder="Enter User  Name" ref={unamee} />
                                    <button onClick={search}>Search</button>
                                </div>
                                {!searchPage ?
                                    <div>{error}</div>
                                    :
                                    <div className="profile-container">
                                        {console.log(Sdata)}
                                        <div className="rightbarFollowing">
                                            <img
                                                src={
                                                    Sdata.profilePicture
                                                        ? PF + Sdata.profilePicture
                                                        : PF + "person/noAvatar.png"
                                                }
                                                alt=""
                                                className="rightbarFollowingImg"
                                            />
                                            <span className="rightbarFollowingName">{Sdata.username}</span>
                                        </div>

                                        <div>
                                            {!addbtn ?
                                                <Add className="button-box" onClick={() => sendReq(Sdata._id)} />
                                                :
                                                <Check className="button-box" onClick={() => cancelReq(Sdata.id)} />
                                            }
                                        </div>
                                    </div>
                                }
                                <button onClick={Created}>Create</button>
                            </div>
                        :
                        <div className="chatMenuWrapper">
                            <div>
                                <input placeholder="Enter User  Name" ref={unamee} />
                                <button onClick={search}>Search</button>
                            </div>
                            {!searchPage ?
                                <div>{error}</div>
                                :
                                <div className="profile-container">
                                    {console.log(Sdata)}
                                    <div className="rightbarFollowing">
                                        <img
                                            src={
                                                Sdata.profilePicture
                                                    ? PF + Sdata.profilePicture
                                                    : PF + "person/noAvatar.png"
                                            }
                                            alt=""
                                            className="rightbarFollowingImg"
                                        />
                                        <span className="rightbarFollowingName">{Sdata.username}</span>
                                    </div>

                                    <div>
                                        {!addbtn ?
                                            <Add className="button-box" onClick={() => Addingroup(Sdata)} />
                                            :
                                            <Check className="button-box" />
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {console.log(currentChat)}
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
                        {/* <h3>Group Members</h3>
                        {/* {conversations.map((c) => (
                            <div>
                                <conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                        {console.log(conversations)} */}
                    </div>
                </div>
            </div>
        </>
    );
}