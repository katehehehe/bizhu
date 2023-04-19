import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../../styles/loginRegister.css";
import axios from "axios";
import { MainContext } from "../../Main";
import Cookies from "js-cookie";
function Register({ onClose }) {
  const { setIsLoggedin, updateUser } = useContext(MainContext);
  const [showPopup, setShowPopup] = useState(true);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const [username, setUsername] = useState("");
  // Retrieve all existing usernames on component mount
  useEffect(() => {
    async function fetchUsernames() {
      const response = await axios.get("http://localhost:1337/api/usernames");
      setExistingUsernames(response.data);
    }

    fetchUsernames();
  }, []);
  useEffect(() => {
    const token = Cookies.get("token"); // Retrieve the JWT token from the cookie
    if (token) {
      setIsLoggedin(true);
      console.log("this is the token, ", token);
    }
  }, [setIsLoggedin]);
  const token = Cookies.get("token");
  console.log("this is the token, ", token);
  async function registerUser(values) {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/register",
        values,
        {
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log(response.data);
      if (response.data.status === "ok") {
        updateUser(response.data);
        setUsername(response.name);
        setIsLoggedin(true);
        Cookies.set("token", response.data.token);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function validateUsername(value) {
    if (existingUsernames.includes(value)) {
      return "This username is already taken. Please choose another username.";
    }
  }

  function validatePassword(values) {
    const errors = {};
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }

  return (
    <div className={`overlay ${showPopup ? "" : "hidden"}`}>
      <div className="modal">
        <Formik
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={registerUser}
          validate={validatePassword}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form className="signin-form">
              <label className="form-label">
                Username:
                <Field
                  className="form-input"
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  validate={validateUsername}
                  required
                />
              </label>

              {errors.username && touched.username && (
                <div className="notification-wrapper">
                  <ErrorMessage
                    className="form-error-message"
                    name="username"
                    component="div"
                    required
                  />
                </div>
              )}

              <label className="form-label">
                Password:
                <Field
                  className="form-input"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <ErrorMessage name="password" />
              <label className="form-label">
                Confirm Password:
                <Field
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="notification-wrapper">
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>
              )}

              <button className="form-button bg-twitterBlue" type="submit">
                Register
              </button>

              <button
                className="form-button bg-twitterBlue bottom-button"
                onClick={onClose}
              >
                Close
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
