import {Injectable} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {FilterQuery} from "mongoose";
import {CreateBloggerDto} from "../dto/create.blogger.dto";
import {UpdateBlogDto} from "../dto/update-blog.dto";
import {log} from "util";

@Injectable()
export class BloggersSQLRepo {
    constructor(@InjectDataSource()
                private readonly dataSource: DataSource,
    ) {

    }




    //// ORIGINAL FUNCTIONS ////



    async getAllBloggersPaging(skipSize: number, PageSize: number) {
        // return await this.bloggerModel.find({}).skip(skipSize).limit(PageSize).exec();

        const result = await this.dataSource.query(`
                SELECT *
                FROM bloggers
                ORDER BY id
                LIMIT $1 OFFSET $2
                    `, [PageSize, skipSize])
        return result
    }

    async countDocuments() {
        // return this.bloggerModel.countDocuments(filter);

        const result = await this.dataSource.query(`
                SELECT 
                CASE
                    WHEN COUNT(*) > 0 THEN COUNT(*)
                    ELSE 0
                END AS total
                FROM bloggers
                    `, [])
        return result
    }

    async createBlogger(dto: CreateBloggerDto) {
        // return await this.bloggerModel.insertMany({name: dto.name, youtubeUrl: dto.youtubeUrl})

        const result = await this.dataSource.query(`
                INSERT INTO bloggers(name, "youtubeUrl")
                VALUES ($1, $2)
                RETURNING *
                    `, [dto.name, dto.youtubeUrl])

        return result
    }

    async isExists(dto: CreateBloggerDto) {
        // return this.bloggerModel.findOne({name: dto.name});


        const result = await this.dataSource.query(`
                SELECT name, "youtubeUrl" 
                FROM bloggers
                WHERE bloggers.name = $1
                    `, [dto.name])
        return result
    }

    async findById(id: string) {
        // return this.bloggerModel.findById(id).select({_id: 0, id: '$_id', name: 1, youtubeUrl: 1})


        const result = await this.dataSource.query(`
                SELECT * 
                FROM bloggers
                WHERE bloggers.id = $1
                    `, [id])
        return result
    }


    async updateBlogger(id: string, {name, youtubeUrl}: UpdateBlogDto) {
        // return this.bloggerModel.findOneAndUpdate({_id: id}, {name, youtubeUrl}, {new: true});


        const result = await this.dataSource.query(
            `
            UPDATE bloggers
            SET name = $1, "youtubeUrl" = $2
            WHERE id = $3
            RETURNING *
            `, [name, youtubeUrl, id])
        return result
    }

    async deleteBlogger(id: string) {
        // return this.bloggerModel.findByIdAndDelete(id)

        const result = await this.dataSource.query(`
                DELETE FROM bloggers
                WHERE bloggers.id = $1
                    `, [id])
        return result
    }

    async getBloggerNameById(bloggerId: string) {
        // return this.bloggerModel.findById(bloggerId, {_id:0, name: 1})

        const result = await this.dataSource.query(`
                SELECT name 
                FROM bloggers
                WHERE bloggers.id = $1
                    `, [bloggerId])
        return result
    }

}