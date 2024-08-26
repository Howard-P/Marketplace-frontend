import User from "../features/user/User";
import MsalProp from "../dataModelsTypes/MsalProp";
import { Link, Outlet } from "react-router-dom";
import viteLogo from "/vite.svg";

function Nav(props: MsalProp) {
  return (
    <>
      <div className="header">
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <User msalInstance={props.msalInstance} />
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}

export default Nav;
