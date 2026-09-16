import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import config from "../../config";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setAccessToken } = useAuth();
  const handleSubmit = async () => {
    const data = {
      username,
      email,
      password,
    };
    try {
      const res = await fetch(`${config.REGISTER_URL}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log("register:", res.status, json);
      if (res.ok) {
        setAccessToken(json.accessToken);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`Error in creating the note ${error}`);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="registerContainer">
      <div className="registerHeader">
        <h1>Create Your Account</h1>
      </div>
      <div className="inputform">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
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
        <button className="submitFormButton" onClick={() => handleSubmit()}>
          Submit
        </button>
        <p className="redirector" onClick={() => navigate("/login")}>
          Already have an account ? Sign in
        </p>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
