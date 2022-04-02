import { Injectable, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Query } from 'firebase-admin/firestore';
import { ParsedQs } from 'qs';
import { convertData, convertsData } from 'src/utils';
import { db } from '../../services/firebase';

@Injectable()
export class DiscoverService {
  private ref = db.collection('users');
  STATUS = {
    1: 'Đang tiến hành',
    2: 'Đã hoàn thành',
    3: 'Tạm ngưng',
  };

  DATE = {
    1: 'desc',
    2: 'asc',
  };

  ORDER_COMIC = 'nameFolder';

  getCursorOnField = async (id) => {
    const comic = await db.collection('comics').doc(id).get();
    return comic.exists ? comic.data().createdAt : null;
  };

  async getAll(res: Response<any, Record<string, any>>) {
    try {
      const comicRef = db.collection('comics');
      const result = await Promise.all([
        comicRef.orderBy('interacts.views', 'desc').limit(6).get(),
        comicRef.orderBy('createdAt', 'desc').limit(8).get(),
      ]);
      const [popular, lastUpdated] = result.map((list) => convertsData(list));
      res.status(200).json({
        popular,
        lastUpdated,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMore(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    const { nextPage } = req.query;
    if (!nextPage) return res.status(200).json([]);
    const cursor = await this.getCursorOnField(nextPage);
    if (cursor) {
      const comicsRef = db.collection('comics').orderBy('createdAt', 'desc');
      const comics = convertsData(
        await comicsRef.startAfter(cursor).limit(8).get(),
      );
      return res.status(200).json(comics);
    }
    return res.status(200).json([]);
  }

  /// still fixing
  async filter(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      let filterRef: Query<FirebaseFirestore.DocumentData> =
        db.collection('comics');
      const { genres, status, upload, nextPage } = req.query;
      if (genres)
        filterRef = filterRef.where(
          'genres',
          'array-contains-any',
          (genres as string).split(','),
        );
      if (this.DATE[upload as string] === 'asc')
        filterRef = filterRef.orderBy('createdAt', 'asc');
      else filterRef = filterRef.orderBy('createdAt', 'desc');
      if (this.STATUS[status as string])
        filterRef = filterRef.where(
          'status',
          '==',
          this.STATUS[status as string],
        );
      if (nextPage) {
        const cursor = await this.getCursorOnField(nextPage);
        cursor && (filterRef = filterRef.startAfter(cursor));
      }

      const data = convertsData(await filterRef.limit(18).get());
      res.status(200).json(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
