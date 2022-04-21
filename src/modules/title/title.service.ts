import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { ComicType } from '@/models/index';
import { db } from '@/services/firebase';
import {
  convertData,
  convertsData,
  getNextAndPrev,
  sortChapters,
} from '@/utils/index';

@Injectable()
export class TitleService {
  async getAllTitle(res: Response<any, Record<string, any>>) {
    try {
      const comics: Array<ComicType> = convertsData(
        await db.collection('comics').get(),
      );
      res.status(200).json(comics);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOneTitle(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const idComic: string = req.params.id;
      if (!idComic) throw new BadRequestException('Missing params');
      const comic: ComicType = convertData(
        await db.collection('comics').doc(idComic).get(),
      );
      comic && (comic.listChapter = sortChapters(comic.listChapter));
      res.status(200).json({ comic });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getChap(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { id, idChap } = req.params;
      if (!(id && idChap)) throw new BadRequestException('Missing params');
      const result = await Promise.all([
        db.collection('comics').doc(id).get(),
        db
          .collection('comics')
          .doc(id)
          .collection('chapters')
          .doc(idChap)
          .get(),
      ]);
      const [comic, chapter] = result.map((list) => convertData(list));
      comic.listChapter = sortChapters(comic.listChapter);
      const nextAndPrev = getNextAndPrev(comic.listChapter, chapter.id);
      res.status(200).json({ nextAndPrev, comic, chapter });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
