import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to={"/"}>Go Home Page</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
