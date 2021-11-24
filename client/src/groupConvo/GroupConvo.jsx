
import "./groupConvo.css";

export default function Conversation({ conversation}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={ PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{conversation.groupName}</span>
    </div>
  );
}