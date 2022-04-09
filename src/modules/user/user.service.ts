import { Injectable, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { ComicType, ComicWasInteracted, User } from 'src/models';
import { convertData, convertsData } from 'src/utils';
import { db } from '../../services/firebase';

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
}
