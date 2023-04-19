import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        'Error in writing file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFile(
    file: Express.Multer.File,
    fileName: string
  ): Promise<string> {
    try {
      let name = fileName;
      if (!name) {
        name = uuid.v4() + '.jpg';
      }
      const fileDirPath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(fileDirPath)) {
        fs.mkdirSync(fileDirPath, { recursive: true });
      }
      fs.writeFileSync(path.join(fileDirPath, name), file.buffer);
      return name;
    } catch (e) {
      throw new HttpException(
        'Error in writing file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(link: string): Promise<void> {
    try {
      const filePath = path.join(__dirname, '..', 'static', link);
      fs.unlinkSync(filePath);
    } catch (e) {
      throw new HttpException(
        'Error in writing file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
