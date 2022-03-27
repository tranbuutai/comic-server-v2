import { Injectable } from '@nestjs/common';
import { db } from '../../services/firebase';

@Injectable()
export class HomeService {
  private ref = db.collection('users');

  getHello() {
    return this.ref.get();
  }
}
