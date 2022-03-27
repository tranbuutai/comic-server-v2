import admin from 'firebase-admin';
import { Logger } from '@nestjs/common';
import 'dotenv/config';

class ConfigService {
  constructor(private env: { [key: string]: string | undefined }) {}

  getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      Logger.error(`Config Error - missing env.${key}`);
      throw new Error(`Config Error - missing env.${key}`);
    }

    return value;
  }

  ensureValues(keys: string[]) {
    keys.forEach((key) => this.getValue(key));
    return this;
  }

  getFirebaseConfig(): admin.AppOptions {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);
    return {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.DATABASE_URL,
    };
  }
}

export const configService = new ConfigService(process.env).ensureValues([
  'FIREBASE_CREDS',
  'DATABASE_URL',
]);
