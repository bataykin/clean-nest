import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingORMService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async removeAll() {
    // const options = await this.dataSource.options
    // await createDatabase({
    //     options
    // });
    // const dataSource1 = new DataSource(options);
    // await dataSource1.initialize();

    //
    // await createDatabase({ifNotExist: true, synchronize: true, options: {database:'d2b54pjsi4gkji', type: "postgres"}}, );

    await this.dataSource.dropDatabase();

    //
    // await createDatabase({ifNotExist: true});

    // await createDatabase({
    //     options
    // });
    await this.dataSource.destroy();
    await this.dataSource.initialize();
    console.log('delete all');

    // await this.dataSource.manager.connection.manager.connection.initialize()

    return 1;
  }

  async removeQuiz() {}
}
