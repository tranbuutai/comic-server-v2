import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

import { configService } from 'src/config';

admin.initializeApp(configService.getFirebaseConfig());

const db = getFirestore();

export { db };
