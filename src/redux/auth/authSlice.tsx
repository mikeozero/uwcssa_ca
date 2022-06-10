/*
 * @Author: Shen Shu
 * @Date: 2022-05-02 19:33:37
 * @LastEditors: Shen Shu
 * @LastEditTime: 2022-06-10 15:00:13
 * @FilePath: /uwcssa_ca/src/redux/auth/authSlice.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

// Generated by https://quicktype.io

export interface AuthState {
  isAuth: boolean;
  user: User;
  cognitoGroup: string[];
  loadUserStatus: string;
  loadUserError: null | string;
  signInStatus: string;
  signInError: null | string;
  googleSignInStatus: string;
  googleSignInError: null | string;
  signUpStatus: string;
  signUpError: null | string;
  emailConfirmStatus: string;
  emailConfirmError: null | string;
  resendConfirmationCodeStatus: string;
  resendConfirmationCodeError: null | string;
  forgotPasswordStatus: string;
  forgotPasswordError: null | string;
  forgotPassWordSubmitStatus: string;
  forgotPassWordSubmitError: null | string;
  changePasswordStatus: string;
  changePasswordError: null | string;
  signOutStatus: string;
  signOutError: null | string;
}

export interface User {
  username: string;
  pool: Pool;
  Session: null;
  client: Client;
  signInUserSession: SignInUserSession;
  authenticationFlowType: string;
  storage: { [key: string]: string };
  keyPrefix: string;
  userDataKey: string;
  attributes: Attributes;
  preferredMFA: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
  identityId: string;
  authenticated: boolean;
}

export interface Attributes {
  sub: string;
  email_verified: boolean;
  name: string;
  email: string;
}

export interface Client {
  endpoint: string;
  fetchOptions: FetchOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FetchOptions {}

export interface Pool {
  userPoolId: string;
  clientId: string;
  client: Client;
  advancedSecurityDataCollectionFlag: boolean;
  storage: { [key: string]: string };
}

export interface SignInUserSession {
  idToken: IDToken;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
  clockDrift: number;
}

export interface AccessToken {
  jwtToken: string;
  payload: AccessTokenPayload;
}

export interface AccessTokenPayload {
  sub: string;
  'cognito:groups': string[];
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

export interface IDToken {
  jwtToken: string;
  payload: IDTokenPayload;
}

export interface IDTokenPayload {
  sub: string;
  'cognito:groups': string[];
  email_verified: boolean;
  'cognito:preferred_role': string;
  iss: string;
  'cognito:username': string;
  origin_jti: string;
  'cognito:roles': string[];
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  name: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

export interface RefreshToken {
  token: string;
}

const initialState: AuthState = {
  isAuth: null,
  user: null,
  cognitoGroup: null,
  //  Status: "idle",
  //  Error: null,
  loadUserStatus: 'idle',
  loadUserError: null,
  signInStatus: 'idle',
  signInError: null,
  googleSignInStatus: 'idle',
  googleSignInError: null,
  signUpStatus: 'idle',
  signUpError: null,
  emailConfirmStatus: 'idle',
  emailConfirmError: null,
  resendConfirmationCodeStatus: 'idle',
  resendConfirmationCodeError: null,
  forgotPasswordStatus: 'idle',
  forgotPasswordError: null,
  forgotPassWordSubmitStatus: 'idle',
  forgotPassWordSubmitError: null,
  changePasswordStatus: 'idle',
  changePasswordError: null,
  signOutStatus: 'idle',
  signOutError: null,
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  //!! need to rename
  const [response, credentials] = await Promise.all([
    Auth.currentAuthenticatedUser(),
    Auth.currentSession(),
  ]);
  return { ...response, ...credentials };
});

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ username, password }: { username: string; password: string }) => {
    const [response, credentials] = await Promise.all([
      Auth.signIn(username, password),
      Auth.currentUserCredentials(),
    ]);
    console.log(response);
    return { ...response, ...credentials };
  },
);

export const googleSignIn = createAsyncThunk('auth/googleSignIn', async () => {
  const response = await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Google,
  });
  return response;
});

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({
    password,
    username,
    name,
  }: {
    password: string;
    username: string;
    name: string;
  }) => {
    const response = await Auth.signUp({
      username,
      password,
      attributes: { name: name },
    });
    return response;
  },
);

export const emailConfirm = createAsyncThunk(
  'auth/emailConfirm',
  async ({
    username,
    authenticationCode,
  }: {
    username: string;
    authenticationCode: string;
  }) => {
    const response = await Auth.confirmSignUp(username, authenticationCode);
    return response;
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (username: string) => {
    const response = await Auth.forgotPassword(username);
    return response;
  },
);

export const forgotPassWordSubmit = createAsyncThunk(
  'auth/forgotPassWordSubmit',
  async ({
    username,
    code,
    new_password,
  }: {
    username: string;
    code: string;
    new_password: string;
  }) => {
    const response = await Auth.forgotPasswordSubmit(
      username,
      code,
      new_password,
    );
    return response;
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({
    user,
    old_password,
    new_password,
  }: {
    user: string;
    old_password: string;
    new_password: string;
  }) => {
    const response = await Auth.changePassword(
      user,
      old_password,
      new_password,
    );
    return response;
  },
);

export const resendConfirmationCode = createAsyncThunk(
  'auth/resendConfirmationCode',
  async (username: string) => {
    const response = await Auth.resendSignUp(username);
    return response;
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const response = await Auth.signOut();
  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //有API call 的不能放这里
  },
  extraReducers(builder) {
    builder
      // Cases for status of loadUser (pending, fulfilled, and rejected)
      .addCase(loadUser.pending, (state) => {
        state.loadUserStatus = 'loading';
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loadUserStatus = 'succeed';
        state.isAuth = true;
        state.user = action.payload;
        state.cognitoGroup =
          action.payload.signInUserSession.accessToken.payload[
            'cognito:groups'
          ];
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loadUserStatus = 'failed';
        state.isAuth = false;
        state.user = null;

        state.signInError = action.error.message;
      })
      // Cases for status of signIn (pending, fulfilled, and rejected)
      .addCase(signIn.pending, (state) => {
        state.signInStatus = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.signInStatus = 'succeed';
        state.isAuth = true;
        state.user = action.payload;
        state.cognitoGroup =
          action.payload.signInUserSession.accessToken.payload[
            'cognito:groups'
          ];
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInStatus = 'failed';
        state.isAuth = false;
        state.user = null;
        state.signInError = action.error.message;
      })
      // Cases for status of signIn (pending, fulfilled, and rejected)
      .addCase(googleSignIn.pending, (state) => {
        state.googleSignInStatus = 'loading';
      })
      .addCase(googleSignIn.fulfilled, (state) => {
        state.googleSignInStatus = 'succeed';
        // state.isAuth = true;
        // state.user = action.payload; //因为第三方登录会直接跳回去刷新页面所以redux也没用，会被重置掉
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.googleSignInStatus = 'failed';
        state.isAuth = false;
        state.user = null;
        state.googleSignInError = action.error.message;
      })

      // Cases for status of signUp (pending, fulfilled, and rejected)
      .addCase(signUp.pending, (state) => {
        state.signUpStatus = 'loading';
      })
      .addCase(signUp.fulfilled, (state) => {
        state.signUpStatus = 'succeed';

        //! need to do later
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpStatus = 'failed';
        state.signUpError = action.error.message;
      })

      // Cases for status of emailConfirm (pending, fulfilled, and rejected)
      .addCase(emailConfirm.pending, (state) => {
        state.emailConfirmStatus = 'loading';
      })
      .addCase(emailConfirm.fulfilled, (state) => {
        state.emailConfirmStatus = 'succeed';
      })
      .addCase(emailConfirm.rejected, (state, action) => {
        state.emailConfirmStatus = 'failed';
        state.emailConfirmError = action.error.message;
      })
      // Cases for status of forgotPassword (pending, fulfilled, and rejected)
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordStatus = 'loading';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordStatus = 'succeed';
        //! need to do later
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordStatus = 'failed';
        state.forgotPasswordError = action.error.message;
      })
      // Cases for status of resendConfirmationCode (pending, fulfilled, and rejected)
      .addCase(resendConfirmationCode.pending, (state) => {
        state.resendConfirmationCodeStatus = 'loading';
      })
      .addCase(resendConfirmationCode.fulfilled, (state) => {
        state.resendConfirmationCodeStatus = 'succeed';
        //! need to do later
      })
      .addCase(resendConfirmationCode.rejected, (state, action) => {
        state.resendConfirmationCodeStatus = 'failed';
        state.resendConfirmationCodeError = action.error.message;
      })
      // Cases for status of forgotPassWordSubmit (pending, fulfilled, and rejected)
      .addCase(forgotPassWordSubmit.pending, (state) => {
        state.forgotPassWordSubmitStatus = 'loading';
      })
      .addCase(forgotPassWordSubmit.fulfilled, (state) => {
        state.forgotPassWordSubmitStatus = 'succeed';
        //! need to do later
      })
      .addCase(forgotPassWordSubmit.rejected, (state, action) => {
        state.forgotPassWordSubmitStatus = 'failed';
        state.forgotPassWordSubmitError = action.error.message;
      })
      // Cases for status of changePassword (pending, fulfilled, and rejected)
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = 'loading';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = 'succeed';
        //! need to do later
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = 'failed';
        state.changePasswordError = action.error.message;
      })
      // Cases for status of signOut (pending, fulfilled, and rejected)
      .addCase(signOut.pending, (state) => {
        state.signOutStatus = 'loading';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.signOutStatus = 'succeed';
        state.isAuth = false;
        state.user = null;
        state.cognitoGroup = null;
      })
      .addCase(signOut.rejected, (state) => {
        state.signOutStatus = 'failed';
        state.isAuth = false;
        state.user = null;
        state.cognitoGroup = null;
      });
  },
});

export const getAuthState = (state: {
  auth: { isAuth: null | true | false };
}) => state.auth.isAuth;

export const getUserInfo = (state: {
  auth: {
    user: {
      attributes: {
        sub: string;
        email_verified: boolean;
        name: string;
        email: string;
      };
    };
  };
}) => state.auth?.user?.attributes;

export const getOwnerUserName = (state: {
  auth: { user: { username: string } };
}) => state.auth?.user?.username;

export const getIsAdmin = (state: {
  auth: { cognitoGroup: string | string[] };
}) => {
  let result = false;
  if (state.auth.cognitoGroup) {
    result = state.auth.cognitoGroup.includes('uwcssaAdmin');
  }
  return result;
};

export default authSlice.reducer;
