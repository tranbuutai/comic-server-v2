import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { db } from '../../services/firebase';
import { convertsData } from '../../utils/convertData';

@Injectable()
export class HomeService {
  async getAll(res: Response<any, Record<string, any>>) {
    try {
      const comicRef = db.collection('comics');
      const result = await Promise.all([
        comicRef.where('recommended', '==', true).get(),
        comicRef.orderBy('interacts.views', 'desc').limit(6).get(),
        comicRef.orderBy('updatedAt', 'desc').limit(8).get(),
        comicRef.orderBy('createdAt', 'desc').limit(6).get(),
      ]);
      const [recommend, popular, lastUpdated, newSeries] = result.map((list) =>
        convertsData(list),
      );

      res.status(200).json({
        recommend,
        popular,
        lastUpdated,
        newSeries,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
