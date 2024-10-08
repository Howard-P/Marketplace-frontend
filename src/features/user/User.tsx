import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus, SilentRequest } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from "../../authConfig";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAccessToken,
  selectIdTokenClaims,
  setAccessToken,
  setActiveAccount,
  setIdTokenClaims,
} from "./userSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import MsalProp from "../../dataModelsTypes/MsalProp";
import "../../styles/User.css";
import { appInsights } from "../../ApplicationInsightsService";
import { SeverityLevel } from "@microsoft/applicationinsights-web";

export const LoginComponents = () => {
  const { instance, inProgress } = useMsal();
  const accessToken = useAppSelector(selectAccessToken);
  const idTokenClaims = useAppSelector(selectIdTokenClaims);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const activeAccount = instance.getActiveAccount();
    if (activeAccount) {
      dispatch(setActiveAccount(activeAccount));
      dispatch(setIdTokenClaims(activeAccount?.idTokenClaims));
      if (accessToken == null) {
        const accessTokenRequest: SilentRequest = {
          scopes: loginRequest.scopes,
          account: activeAccount || undefined,
        };

        instance.initialize().then(() => {
          instance.acquireTokenSilent(accessTokenRequest).then((result) => {
            // Acquire token silent success
            dispatch(setAccessToken(result.accessToken));
            appInsights.trackTrace({
              message: "Acquire access token silent succeed.",
              severityLevel: SeverityLevel.Information,
            });
          });
        });
      }
    }
  }, [accessToken, dispatch, instance]);

  const handleLoginPopup = () => {
    instance
      .loginPopup({
        ...loginRequest,
        redirectUri: "/",
      })
      .then((result) => {
        appInsights.trackTrace({
          message: "User logged in.",
          severityLevel: SeverityLevel.Information,
        });
        dispatch(setAccessToken(result.accessToken));
        dispatch(setIdTokenClaims(result.idTokenClaims));
        dispatch(setIdTokenClaims(result.idTokenClaims));
      })
      .catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance
      .logoutPopup({ mainWindowRedirectUri: "/" })
      .catch((error) => console.log(error)); // redirects the top level app after logout
  };

  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) {
      // @ts-expect-error need to pass authority for acquireTokenRedirect to support B2C profile edit
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };

  return (
    <>
      <AuthenticatedTemplate>
        <div className="dropdown">
          <button className="dropbtn">
            User logged in: {idTokenClaims?.name}
          </button>
          <div className="dropdown-content">
            <Link to={"/inventory"}>User Inventory</Link>
            <Link to={"/UserToken"}>User ID</Link>
            <a href="" onClick={handleProfileEdit}>
              Edit Profile
            </a>
            <a href="" onClick={handleLogoutRedirect}>
              Sign Out
            </a>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <li>
          <button onClick={handleLoginPopup}>Popup Sign in</button>
        </li>
      </UnauthenticatedTemplate>
    </>
  );
};

export function User(props: MsalProp) {
  // The `state` arg is correctly typed as `RootState` already
  return (
    <MsalProvider instance={props.msalInstance}>
      <LoginComponents />
    </MsalProvider>
  );
  // omit rendering logic
}

export default User;
