import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./app/store";
import { Provider } from "react-redux";

import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { msalConfig } from "./authConfig";

import "./styles/main.css";
import Nav from "./components/Nav";
import NotFoundPage from "./components/NotFoundPage";
import ProductTable from "./components/ProductTable";
import { injectStore } from "./api/ApiClient";
import UserInventory from "./features/userInventory/UserInventory";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./ApplicationInsightsService";

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);

injectStore(store);

// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
    event.payload
  ) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
if (!root) throw Error("Failed to find the root element");

root.render(
  <React.StrictMode>
    <AppInsightsContext.Provider value={reactPlugin}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Nav msalInstance={msalInstance} />}>
              <Route index element={<ProductTable />} />
              <Route path="inventory" element={<UserInventory />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </AppInsightsContext.Provider>
  </React.StrictMode>
);
