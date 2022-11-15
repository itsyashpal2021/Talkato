import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../Css/UserProfile.css";
import { postToNodeServer, Routes } from "../utils";

export function UserProfile(props) {
  let navigate = useNavigate();

  const onLogout = (event) => {
    postToNodeServer(Routes.LOGOUT_ROUTE, {}).then((response) => {
      if (response.status === 200) {
        navigate(Routes.LOGIN_ROUTE);
      }
    });
  };

  return (
    <div
      className="container-fluid d-flex  flex-lg-row flex-column justify-content-between p-2"
      style={{ backgroundColor: "rgb(236 218 218)" }}
    >
      <div className="d-flex flex-wrap justify-content-center align-items-center">
        <div className="profile-picture me-2">
          <i className="fa-solid fa-user" />
        </div>
        <div>
          <p className="m-0 fs-1 text-center" style={{ color: "#3b0606" }}>
            {props.userData.username}
          </p>
          <p className="m-0 h5 text-center">
            {props.userData.firstName} {props.userData.lastName}
          </p>
          <p className="m-0 text-primary text-center">{props.userData.email}</p>
        </div>
      </div>
      <button
        className="btn btn-secondary align-self-center mt-2 mt-lg-0"
        onClick={onLogout}
      >
        Log Out
      </button>
    </div>
  );
}
UserProfile.propTypes = {
  userData: PropTypes.object,
};