import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveChat } from "../state/slices";
import { getFormValues, postToNodeServer, Routes } from "../utils.js";
import "../Css/Login.css";

export function LoginForm(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [labelVisible, setLabelVisible] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);
  document.title = "Login";

  useEffect(() => {
    async function checkSession() {
      const response = await postToNodeServer(Routes.CHECK_SESSION_ROUTE, {});
      if (response.sessionActive) {
        navigate(Routes.USER_ROUTE);
      } else {
        setSessionActive(false);
      }
    }
    checkSession();
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formValues = getFormValues(event);

    const response = await postToNodeServer(Routes.LOGIN_ROUTE, formValues);

    if (response.status === 401) {
      setLabelVisible(true);
    } else if (response.status === 200) {
      setLabelVisible(false);
      dispatch(setActiveChat({}));
      navigate(Routes.USER_ROUTE);
    }
  };

  return sessionActive ? (
    <></>
  ) : (
    <form onSubmit={onSubmit} className="container-fluid h-100 p-0">
      <div className="row container-fluid p-0 justify-content-center">
        <div
          className="col-md-8 col-lg-5 col-xxl-4 col-sm-10 col-11 p-4"
          id="formDiv"
        >
          <label htmlFor="userNameInput" className="form-label fs-5 d-block">
            Username
          </label>
          <input
            type="text"
            className="form-control-lg w-100"
            id="userNameInput"
            name="username"
            required
          />
          <label
            htmlFor="passwordInput"
            className="form-label fs-5 d-block mt-2"
          >
            Password
          </label>
          <input
            type="password"
            className="form-control-lg w-100"
            id="passwordInput"
            name="password"
            required
          />
          <label
            className="col-10 fs-6"
            style={{
              display: labelVisible === false ? "none" : "block",
              color: "red",
            }}
          >
            Invalid Login
          </label>
          <button
            type="submit"
            className="btn btn-primary d-block w-100 fs-5 mt-3"
          >
            Login
          </button>
          <Link
            to="/register"
            className="fs-6 mt-2 d-block text-info text-decoration-none"
          >
            Register New User
          </Link>
        </div>
      </div>
    </form>
  );
}
