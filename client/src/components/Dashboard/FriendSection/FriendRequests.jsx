import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFriendList,
  newChat,
  removeFromFriendRequestsRecieved,
} from "../../../state/slices";
import { postToNodeServer, Routes } from "../../../utils";
import WaitingAnimation from "../../WaitingAnimation";
import ProfilePic from "../ProfilePic";

export function FriendRequests(props) {
  const [showRequests, setShowRequets] = useState(false);
  const dispatch = useDispatch();

  const socket = props.socket;

  const userData = useSelector((state) => state.userData);

  const username = userData.username;
  const friendRequests = useSelector(
    (state) => state.friendData.friendRequestsRecieved
  );

  const acceptFriendRequest = async (event, request) => {
    event.target.querySelector(".waitingAnimationDiv").style.display = "block";

    const friendRequestUsername = request.username;
    const response = await postToNodeServer(
      Routes.ACCEPT_FRIEND_REQUEST_ROUTE,
      {
        username: username,
        friendRequestUsername: friendRequestUsername,
      }
    );

    event.target.querySelector(".waitingAnimationDiv").style.display = "block";
    if (response.status === 200) {
      const friend = {
        username: friendRequestUsername,
        firstName: response.firstName,
        lastName: response.lastName,
        profilePic: request.profilePic,
      };
      dispatch(removeFromFriendRequestsRecieved(friendRequestUsername));
      dispatch(addToFriendList(friend));
      dispatch(newChat(friendRequestUsername));

      socket.emit("friend request accepted", {
        username: username,
        friendRequestUsername: friendRequestUsername,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePic: userData.profilePic,
      });
    }
  };

  const rejectFriendRequest = async (friendRequestUsername) => {
    const response = await postToNodeServer(
      Routes.REJECT_FRIEND_REQUEST_ROUTE,
      {
        username: username,
        friendRequestUsername: friendRequestUsername,
      }
    );
    if (response.status === 200 && socket) {
      dispatch(removeFromFriendRequestsRecieved(friendRequestUsername));
      socket.emit("friend request rejected", {
        username: username,
        friendRequestUsername: friendRequestUsername,
      });
    }
  };

  return (
    <div
      className="container-fluid p-2"
      style={{ backgroundColor: "rgb(29 44 70)" }}
    >
      <div
        className="d-flex align-items-center text-warning"
        onClick={() => {
          setShowRequets(!showRequests);
        }}
        style={{ cursor: "pointer", width: "fit-content", userSelect: "none" }}
      >
        <i
          className={
            showRequests
              ? "fa-solid fs-4 fa-caret-down"
              : "fa-solid fs-4 fa-caret-right"
          }
          id="friendRequestLabel"
        />
        <span className="h6 ms-2 m-0">Friend Requests</span>
        <div
          className="align-self-start ms-1 mt-1"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "100%",
            backgroundColor: "red",
            display: friendRequests.length === 0 ? "none" : "inline",
          }}
        />
      </div>
      <div
        style={{
          maxHeight: showRequests === false ? "0px" : "30vh",
          overflowY: "scroll",
          transition: "all 0.5s ",
        }}
      >
        {friendRequests.map((request) => {
          const username = request.username;
          return (
            <div
              className="d-flex align-items-center my-2 container-fluid p-lg-2 p-md-0 p-sm-2 p-0"
              key={username}
            >
              <ProfilePic
                size={"45px"}
                src={request.profilePic}
                className="me-2 fs-4"
                style={{
                  border: request.profilePic ? "none" : "2px solid #8EA7E9",
                  color: "#8EA7E9",
                }}
              />

              <p className="fs-4 text-white m-0">{username}</p>
              <button
                className="btn btn-success fs-6 fw-bold text-black ms-auto me-2 p-1 position-relative"
                onClick={(event) => acceptFriendRequest(event, request)}
              >
                Accept
                <WaitingAnimation />
              </button>
              <button
                className="btn btn-close btn-close-white p-1 ms-1"
                onClick={() => rejectFriendRequest(username)}
                style={{
                  height: "0.4rem",
                  width: "0.3rem",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
