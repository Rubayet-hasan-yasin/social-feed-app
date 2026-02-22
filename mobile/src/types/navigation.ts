
export type RootStackParamList = {
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(tabs)': undefined;
};


export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};


export type TabParamList = {
  index: undefined;
  create: undefined;
  notifications: undefined;
  profile: undefined;
};


export type ScreenProps<T extends keyof TabParamList> = {
  navigation: any;
  route: {
    params?: TabParamList[T];
  };
};
