export interface Auth {
  formatRegularCredential: (RefrechedCredential: any) => Promise<any>;

  isCredentialValid: (credential: any) => Promise<boolean>;

  generateCredentials: (email: string, password: string) => Promise<any>;

  refreshCredentials: (credential?: any) => Promise<any>;
}

export type CustomStorage = {
  init: (options: any) => void;
  setItem: (key: string, value: any) => Promise<any>;
  getItem: (key: string) => Promise<any>;
};

export type AuthConfiguration = {
  apiKey: string;
  authDomain: string;
};

export type RefreshedCredential = {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

export type Credential = {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered?: boolean;
  refreshed?: boolean;
  refreshToken: string;
  expiresIn: string;
};
