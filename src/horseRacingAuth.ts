import axios from "axios";
import jwt_decode from "jwt-decode";
import storage from "node-persist";

import type {
  Auth,
  AuthConfiguration,
  RefreshedCredential,
  Credential,
  CustomStorage,
} from "./model/Auth";

export default class HorseRacingAuth implements Auth {
  config: AuthConfiguration;
  storage: any;

  constructor(config: AuthConfiguration, customStorage?: CustomStorage) {
    this.config = config;
    this.storage = customStorage || storage;

    storage.init({
      dir: "storage",
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: "utf8",
      logging: false,
    });
  }

  // format refresh credential to regular
  async formatRegularCredential(RefreshedCredential: RefreshedCredential) {
    return {
      idToken: RefreshedCredential.id_token,
      refreshToken: RefreshedCredential.refresh_token,
      expiresIn: RefreshedCredential.expires_in,
      localId: RefreshedCredential.user_id,
      refreshed: true,
    } as Credential;
  }

  async isCredentialValid(credential: Credential) {
    // check if credential is valid
    if (!credential?.registered && !credential?.refreshed) {
      this.storage.setItem("horce-racing-credential", null);
      throw new Error("No credential found");
    }

    // check if token is expired
    const decoded = (await jwt_decode(credential.idToken)) as any;

    return decoded?.exp > Date.now() / 1000;
  }

  /**
   * Generate Token -
   *
   * Returns a JSON Web Token (JWT) used to identify the user to Cloud Endpoints.
   *
   * @param email
   * @param password
   *
   */
  async generateCredentials(email: string, password: string) {
    const credential = await this.storage.getItem("horce-racing-credential");

    if (!credential) {
      return await this.authWithEmailAndPassword(email, password);
    }

    return await this.refreshCredentials(credential);
  }

  /**
   * Authentication with Email and Password -
   * Returns a JSON Web Token (JWT) used to identify the user to Cloud Endpoints.
   *
   * @param email
   * @param password
   */
  async authWithEmailAndPassword(email: string, password: string) {
    const response = await axios
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.config.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        this.storage.setItem("horce-racing-credential", null);
        throw new Error(err?.message || "Authentication failed");
      });

    // set credential in persistent storage
    await this.storage.setItem("horce-racing-credential", response.data);

    return response.data;
  }

  /**
   * Refresh Token -
   * Returns a JSON Web Token (JWT) used to identify the user to Cloud Endpoints.
   *
   * @param currentCredential optional
   */
  async refreshCredentials(currentCredential: Credential) {
    const current =
      currentCredential ||
      (await this.storage.getItem("horce-racing-credential"));

    //check if credential is valid then return it
    if (await this.isCredentialValid(current)) {
      return current;
    }

    // refresh token
    const response = await axios
      .post(
        `https://securetoken.googleapis.com/v1/token?key=${this.config.apiKey}`,
        {
          grant_type: "refresh_token",
          refresh_token: current.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .catch((err) => {
        this.storage.setItem("horce-racing-credential", null);
        throw new Error(err.message || "Refresh token failed");
      });

    // format data to readable credential
    const formatedData = await this.formatRegularCredential(response.data);

    // set credential in persistent storage
    await this.storage.setItem("horce-racing-credential", formatedData);

    return formatedData;
  }
}
