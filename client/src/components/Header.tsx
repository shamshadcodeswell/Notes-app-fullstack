import { IoHomeOutline } from "react-icons/io5";
import applogo from "../assets/darkAppLogo.png";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const navigate = useNavigate();
  const date = new Date();
  const dateString = `${getOrdinal(date.getDate())} of ${date.toLocaleDateString("en-IN", { month: "long" })}`;
  const { accessToken, setAccessToken } = useAuth();
  const logoutHandler = async () => {
    const res = await fetch(import.meta.env.VITE_LOGOUT_URI, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      setAccessToken(null);
      navigate("/login");
    }
  };
  return (
    <div className="Header">
      <div className="logoContainer">
        <img className="logo" src={applogo}></img>
      </div>
      <div className="brandName">
        <h1>Notely</h1>
      </div>
      <div className="date">{dateString}</div>
      <div className="homeButton" onClick={() => navigate("/")}>
        <IoHomeOutline size={22} color="rgba(255,255,255,0.9)" />
      </div>
      <div className="logoutButtonContainer">
        <button onClick={logoutHandler}>logout</button>
      </div>
    </div>
  );
};

const getOrdinal = (n: number): string => {
  if (n > 3 && n < 21) return n + "th";
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
};

export default Header;
