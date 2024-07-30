/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_signupandsignin2",
    forgotPassword: "B2C_1_resetpassword",
    editProfile: "B2C_1_profileediting1",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://fullstacke.b2clogin.com/fullstacke.onmicrosoft.com/B2C_1_signupandsignin2",
    },
    forgotPassword: {
      authority:
        "https://fullstacke.b2clogin.com/fullstacke.onmicrosoft.com/B2C_1_resetpassword",
    },
    editProfile: {
      authority:
        "https://fullstacke.b2clogin.com/fullstacke.onmicrosoft.com/B2C_1_profileediting1",
    },
  },
  authorityDomain: "fullstacke.b2clogin.com",
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: "26b0c9af-0c6c-44be-96b8-f8cd3512e39f", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  apiTodoList: {
    endpoint: "http://localhost:5000/api/todolist",
    scopes: {
      users: {
        read: ["https://fullstacke.onmicrosoft.com/users-api/users.read"],
        write: ["https://fullstacke.onmicrosoft.com/users-api/users.write"],
      },
      listingProducts: {
        read: [
          "https://fullstacke.onmicrosoft.com/users-api/listingproducts.read",
        ],
        write: [
          "https://fullstacke.onmicrosoft.com/users-api/listingproducts.write",
        ],
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [
    ...protectedResources.apiTodoList.scopes.users.read,
    ...protectedResources.apiTodoList.scopes.users.write,
    ...protectedResources.apiTodoList.scopes.listingProducts.read,
    ...protectedResources.apiTodoList.scopes.listingProducts.write,
  ],
};
