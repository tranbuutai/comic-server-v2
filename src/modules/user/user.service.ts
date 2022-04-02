import { Injectable, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { convertData, convertsData } from 'src/utils';
import { db } from '../../services/firebase';

@Injectable()
export class UserService {
  async getBookmark(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { userId } = req.params;
      if (!userId) throw new BadRequestException('Bookmark Not Found');
      const user = convertData(await db.collection('users').doc(userId).get());
      const listBookmark = user.histories.comicsWasInteracted;
      const newList = listBookmark.filter(
        (item: { isBookmark: any }) => item.isBookmark,
      );
      const comics = convertsData(
        await Promise.all(
          newList.map((item: { idComic: string }) => {
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
