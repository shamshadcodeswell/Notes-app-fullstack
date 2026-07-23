import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import config from "../../config";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = {
      email,
      password,
    };
    try {
      const res = await fetch(config.LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setAccessToken(json.accessToken);
        navigate("/");
      } else {
        setError(json.message);
      }
      console.log(json);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`Error in creating the note ${error}`);
      }
    }
  };

  return (
    <div className="registerContainer">
      <div className="registerHeader">
        <h1>Log into your account</h1>
      </div>
      <div className="inputform">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="formfooter">
        <button className="submitFormButton" onClick={handleSubmit}>
          Submit
        </button>
        <p className="redirector" onClick={() => navigate("/register")}>
          Create an account
        </p>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
