interface AppConfig {
  saltRounds: number;
  jwtSecret: string;
};

export const appConfig: AppConfig = {
  saltRounds: 10,
  jwtSecret: 'jwtTopSecret2020',
};
