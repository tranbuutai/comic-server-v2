import { Injectable, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { map, asyncRoot } from 'modern-async';
import * as admin from 'firebase-admin';

import {
  ComicType,
  ComicWasInteracted,
  updateUser,
  User,
} from '@/models/index';
import { convertData, convertsData } from '@/utils/index';
import { db } from '@/services/firebase';

@Injectable()
export class UserService {
  async getProfile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { userId } = req.params;
      if (!userId) throw new BadRequestException('User Not Found');
      const user: User = convertData(
        await db.collection('users').doc(userId).get(),
      );
      return res.status(200).json(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getBookmark(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { userId } = req.params;
      if (!userId) throw new BadRequestException('Bookmark Not Found');
      const user: User = convertData(
        await db.collection('users').doc(userId).get(),
      );
      const listBookmark: Array<ComicWasInteracted> =
        user.histories.comicsWasInteracted;
      const newList: Array<ComicWasInteracted> = listBookmark.filter(
        (item) => item.isBookmark,
      );

      const comics: Array<ComicType> = convertsData(
        await Promise.all(
          newList.map((item) => {
            return db.collection('comics').doc(item.idComic).get();
          }),
        ),
      );
      return res.status(200).json(comics);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getHistory(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { userId } = req.params;
      if (!userId) throw new BadRequestException('History Not Found');
      const user = convertData(await db.collection('users').doc(userId).get());
      const histories = user.histories.viewed;
      if (!user.histories.viewed) {
        return res.status(200).json([]);
      }
      if (histories.length === 0) return res.status(200).json([]);

      let result = [];
      await asyncRoot(async () => {
        result = await map(histories, async (v: any) => {
          const [comic, chapter] = await Promise.all([
            db.collection('comics').doc(v.idComic).get(),
            db
              .collection('comics')
              .doc(v.idComic)
              .collection('chapters')
              .doc(v.idChapter)
              .get(),
          ]);
          return {
            ...v,
            comic: convertData(comic),
            chapter: convertData(chapter),
          };
        });
      });
      return res.status(200).json(result);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getRecommend(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { userId } = req.params;
      const userRef = await db.collection('users').doc(userId);
      const user: User = convertData(await userRef.get());
      if (!user.genres) {
        return res.status(200);
      }
      let highest;
      for (let i = 0; i < user.genres.length; i++) {
        if (highest == null || user.genres[i]['amount'] > highest['amount'])
          highest = user.genres[i];
      }
      const comics: Array<ComicType> = convertsData(
        await db
          .collection('comics')
          .where('genres', 'array-contains', highest.name)
          .limit(6)
          .get(),
      );
      if (comics.length === 0) {
        return res.status(200);
      }

      return res.status(200).json(comics);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProfileUser(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    data: updateUser,
  ) {
    try {
      const { userId } = req.params;
      if (!userId) throw new BadRequestException('User Not Found');
      const userRef = await db.collection('users').doc(userId);
      await userRef.update({
        info: { ...data },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.status(200).send('Cập nhật thành công!');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setGenreForUser(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    data: string[],
  ) {
    try {
      const { userId } = req.params;
      const userRef = await db.collection('users').doc(userId);
      const user: User = convertData(await userRef.get());
      let genreUser = user.genres;
      let listGenres = [];
      data.map((genre) => listGenres.push({ name: genre, amount: 0 }));

      //for old user
      if (!user.genres) {
        await userRef.update({
          genres: listGenres,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.status(200).send('OK');
      }
      let genres = new Set(genreUser.map((d) => d.name));
      let addAmount = listGenres.filter((d) => genres.has(d.name));
      genreUser.map(
        (e) =>
          addAmount.some((item) => item.name === e.name) && (e.amount += 1),
      );
      let merged = [
        ...genreUser,
        ...listGenres.filter((d) => !genres.has(d.name)),
      ];

      await userRef.update({
        genres: merged,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).send('OK');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
