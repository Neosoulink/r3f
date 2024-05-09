import { registerAs } from '@nestjs/config';

const config = () => ({
  environment: process.env.NODE_ENV || 'development',
  webUrl: process.env.WEB_URL,
});

export const APP_CONFIG_KEY = 'APP_CONFIG_KEY';
export const appConfig = registerAs(APP_CONFIG_KEY, config);
export default config;
