import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {MongooseCoreModule} from "@nestjs/mongoose/dist/mongoose-core.module";
import mongoose from "mongoose";
import {TestingSQLService} from "./testing.SQL.service";
import {TestingORMService} from "./testing.ORM.service";



@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingORMService/* | TestingSQLService*/) {}

  @HttpCode(204)
  @Delete('all-data')
  async removeAll() {

    return this.testingService.removeAll();
  }

  @HttpCode(204)
  @Delete('delete-quiz')
  async removeQuiz() {
    return this.testingService.removeQuiz();
  }
}
