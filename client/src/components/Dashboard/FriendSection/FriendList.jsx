import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOnlineFriend,
  removeFromOnlineFriend,
  setActiveChat,
} from "../../../state/slices";
import ProfilePic from "../ProfilePic";

export function FriendList(props) {
  const friendList = useSelector((state) => state.friendData.friendList);
  const activeChat = useSelector((state) => state.activeChat);
  const messages = useSelector((state) => state.chatData.messages);
  const onlineFriends = useSelector((state) => new Set(state.onlineFriends));

  const dispatch = useDispatch();

  const socket = props.socket;

  const updateOnlineFriends = useCallback(() => {
    if (!socket) return;
    friendList.forEach((friend) => {
      socket.emit("checkOnline", friend.username, (isOnline) => {
        if (isOnline) {
          dispatch(addOnlineFriend(friend.username));
        } else {
          dispatch(removeFromOnlineFriend(friend.username));
        }
      });
    });
  }, [friendList, dispatch, socket]);

  useEffect(() => {
    //update online status every 10s
    updateOnlineFriends();
    const interval = setInterval(updateOnlineFriends, 10000);
    return () => clearInterval(interval);
  }, [updateOnlineFriends]);

  return (
    <div
      className="container-fluid p-0 h-100"
      style={{
        backgroundColor: "rgb(66 69 98)",
        borderTop: "1px solid #191919",
        overflowY: "scroll",
      }}
    >
      {friendList.map((friend) => {
        const lastMessage = messages[friend.username].slice(-1)[0];

        return (
          <div
            key={friend.username}
            className="friendDiv container-fluid py-2 px-sm-3 px-1"
            style={{
              display: "flex",
              userSelect: "none",
              borderBottom: "1px solid #191919",
              backgroundColor:
                activeChat.username !== undefined &&
                activeChat.username === friend.username
                  ? "rgb(47 50 75)"
                  : "inherit",
            }}
            onMouseOver={(event) => {
              if (
                activeChat.username === undefined ||
                activeChat.username !== friend.username
              )
                event.target.closest(".friendDiv").style.backgroundColor =
                  "rgb(57 60 85)";
            }}
            onMouseOut={(event) => {
              event.target.closest(".friendDiv").style.backgroundColor =
                activeChat.username !== undefined &&
                activeChat.username === friend.username
                  ? "rgb(47 50 75)"
                  : "inherit";
            }}
            onClick={() => {
              if (activeChat.username !== friend.username) {
                window.history.pushState({}, "");
                dispatch(setActiveChat(friend));
              }
            }}
          >
            <ProfilePic
              size="50px"
              className="me-2 fs-4"
              style={{
                flexGrow: 0,
                flexShrink: 0,
                borderColor: "aqua",
                color: "aqua",
              }}
              src={friend.profilePic}
              isOnline={onlineFriends.has(friend.username)}
            />
            <div className="d-flex flex-column w-100  ">
              <span className="fs-3 text-white lh-1">
                {friend.firstName} {friend.lastName}
              </span>
              {lastMessage ? (
                <div className="d-flex align-items-center justify-content-between mt-1">
                  <span className="fs-6" style={{ color: "#e5e5ac" }}>
                    {lastMessage.message}
                  </span>
                  <span className="text-muted" style={{ fontSize: "10px" }}>
                    {new Date(lastMessage.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
