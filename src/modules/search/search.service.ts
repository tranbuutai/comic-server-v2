import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { ComicType } from '@/models/index';
import { convertsData } from '@/utils/index';
import { db } from '@/services/firebase';

@Injectable()
export class SearchService {
  private ref = db.collection('users');

  async searchTitle(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      //uppercase data and database value to easier match each other
      const data: string = req.params.title.toUpperCase();
      const comics: Array<ComicType> = convertsData(
        await db.collection('comics').get(),
      );
      let comicsAfterSearch: Array<ComicType> = [];
      comics.map((comics) => {
        if (
          comics.name.vnName.toUpperCase().includes(data) ||
          comics.name.orgName.toUpperCase().includes(data)
        ) {
          comicsAfterSearch.push(comics);
        }
      });

      res.status(200).json(comicsAfterSearch);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchAuthor(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const data: string = req.params.author.toUpperCase();
      const comics: Array<ComicType> = convertsData(
        await db.collection('comics').get(),
      );
      let comicsAfterSearch: Array<ComicType> = [];
      comics.map((comics) => {
        if (comics.author.toUpperCase().includes(data)) {
          comicsAfterSearch.push(comics);
        }
      });
      res.status(200).json(comicsAfterSearch);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
