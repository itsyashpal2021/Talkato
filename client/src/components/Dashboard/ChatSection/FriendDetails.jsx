import { useDispatch, useSelector } from "react-redux";
import {
  clearChat,
  removeFromFriendList,
  setActiveChat,
} from "../../../state/slices";
import ProfilePic from "../ProfilePic";
import { postToNodeServer, Routes } from "../../../utils";

export function FriendDetails(props) {
  const username = useSelector((state) => state.userData.username);
  const friend = useSelector((state) => state.activeChat);
  const isOnline = useSelector(
    (state) => state.onlineFriends.indexOf(friend.username) !== -1
  );
  const dispatch = useDispatch();

  const socket = props.socket;

  const toggleChatOptions = () => {
    const chatOptionsDiv = document.getElementById("chatOptionsDiv");
    const chatOptions = document.querySelector("#chatOptionsDiv div");

    if (chatOptionsDiv.style.height === "0px") {
      chatOptionsDiv.style.height = "calc(100vh - 100%)";
      chatOptions.style.maxHeight = "80px";
    } else {
      chatOptions.style.maxHeight = "0px";
      chatOptionsDiv.style.height = "0px";
    }
  };

  const unfriend = async () => {
    const res = await postToNodeServer(Routes.UNFRIEND, {
      friendUsername: friend.username,
    });

    if (res.status === 200) {
      dispatch(removeFromFriendList(friend.username));
      dispatch(setActiveChat({}));
      dispatch(clearChat(friend.username));

      socket.emit("unfriend", {
        username: username,
        friendUsername: friend.username,
      });
    }
  };

  return (
    <div
      className="container-fluid p-sm-2 p-3 text-white d-flex align-items-center position-relative"
      style={{ backgroundColor: "#181e22" }}
    >
      <i
        className="fa-solid fa-arrow-left fs-3 me-3"
        style={{ display: window.innerWidth <= 767 ? "inline" : "none" }}
        onClick={() => dispatch(setActiveChat({}))}
      />
      <ProfilePic
        size="60px"
        className="ms-1 me-3 fs-2"
        src={friend.profilePic}
        isOnline={isOnline}
      />
      <div>
        <p className="fs-2 m-0 lh-1">
          {friend.firstName} {friend.lastName}
        </p>
        <span className="h6 text-info">
          {isOnline ? "online" : friend.username}
        </span>
      </div>
      <i
        className="fa-solid fa-ellipsis-vertical fs-2 p-2 ms-auto"
        id="chatOptionsTriger"
        style={{ cursor: "pointer" }}
        onClick={toggleChatOptions}
      />
      <div
        id="chatOptionsDiv"
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          height: "0",
          width: "100vw",
          zIndex: 2,
        }}
        onClick={toggleChatOptions}
      >
        <div
          className="d-flex flex-column fs-5"
          style={{
            position: "absolute",
            top: "0",
            right: 0,
            userSelect: "none",
            zIndex: 2,
            maxHeight: 0,
            overflow: "hidden",
            backgroundColor: "rgb(24, 30, 34,0.6)",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          <span
            className="py-1 px-2"
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "rgb(24, 30, 34,0.8)";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "transparent";
            }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Unfriend
          </span>
          <span
            className="py-1 px-2"
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "rgb(24, 30, 34,0.8)";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "transparent";
            }}
          >
            Clear Chat
          </span>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "100%",
          top: "100%",
          height: "calc(100vh - 100%)",
          backgroundColor: "rgba(0,0,0,60%)",
          transition: "opacity 0.2s linear 0s",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content bg-dark">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-info" id="exampleModalLabel">
                Unfriend {friend.username} ?
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              You and {friend.username} will no longer be able to chat.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancle
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={unfriend}
              >
                Unfriend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
