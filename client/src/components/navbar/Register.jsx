import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../../styles/loginRegister.css";
import axios from "axios";

function Register({ onClose }) {
  const [showPopup, setShowPopup] = useState(true);

  async function registerUser(values) {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/register",
        values,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.status === "ok") {
        onClose();
        setShowPopup(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={`overlay ${showPopup ? "" : "hidden"}`}>
      <div className="modal">
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={registerUser}
        >
          {({ values, handleChange }) => (
            <Form className="signin-form">
              <label className="form-label">
                Username:
                <Field
                  className="form-input"
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
              </label>
              <ErrorMessage name="username" />

              <label className="form-label">
                Email:
                <Field
                  className="form-input"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </label>
              <ErrorMessage name="email" />

              <label className="form-label">
                Password:
                <Field
                  className="form-input"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
              </label>
              <ErrorMessage name="password" />

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
