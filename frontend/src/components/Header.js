import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";

function Header(props) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="туть должен быть логотип :("
      />
      <div className="header__authorization">
        <p className="header__email">{props.mail}</p>
        <Link
          to={props.route}
          className="header__link"
          type="button"
          onClick={props.onClick}
        >
          {props.title}
        </Link>
      </div>
    </header>
  );
}

export default Header;
