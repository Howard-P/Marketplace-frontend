import { useAppSelector } from "../../app/hooks";
import { selectAccessToken, selectIdTokenClaims } from "./userSlice";

function UserToken() {
  const idTokenClaim = useAppSelector(selectIdTokenClaims);
  const accessToken = useAppSelector(selectAccessToken);

  return (
    <>
      <p>ID Token Claim: {JSON.stringify(idTokenClaim)}</p>
      <p>User Access Token: {accessToken}</p>
    </>
  );
}

export default UserToken;
