import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import UserToken from "./UserToken";
import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store"; //ES6 modules

describe("User Token", () => {
  const mockStore = configureStore();
  const store = mockStore({
    user: {
      IdTokenClaims: {
        id: "1",
      },
      accessToken: "accessToken",
    },
  });

  test("it render user access and token", async () => {
    render(
      <Provider store={store}>
        <UserToken />
      </Provider>
    );
    screen.debug();

    expect(
      screen.findAllByTestId((content) => content.indexOf('{"id":"1"}') > 0)
    );
  });
});
