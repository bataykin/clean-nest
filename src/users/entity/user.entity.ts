import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, JoinColumn} from 'typeorm';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {LikeStatusEnum} from "../../comments/comment.schema";
import {date} from "joi";
import {DeviceEntity} from "../../device/entities/device.entity";
import {CommentEntity} from "../../comments/entities/comment.entity";
import {LikeEntity} from "../../likes/entities/like.entity";
import {BlogEntity} from "../../bloggers/entities/blogEntity";

//
// @Entity()
// class SentConfirmationEmailTypeSchema {
//     @Column()
//     sentDate: Date
//
// }
//
// @Entity()
// class EmailConfirmationTypeSchema {
//     @Prop()
//     isConfirmed: boolean
//
//     @Prop()
//     confirmationCode: string
//
//     @Prop()
//     expirationDate: Date
//
//     @Prop({type: [SentConfirmationEmailTypeSchema]})
//     sentEmails: SentConfirmationEmailTypeSchema[]
// }
//
// @Entity()
// class UserAccountTypeSchema {
//     @Prop({type: String, unique: true})
//
//     email: string
//
//     @Prop({type: String, unique: true})
//     login: string
//
//     @Prop({type: String, required: true,})
//     passwordHash: string
//
//     @Prop({type: Date, default: Date.now})
//     createdAt: Date
// }
//
// @Entity()
// class LikesOnPosts {
//
//     @Prop({type: String})
//     postId: string
//
//     @Prop({type: String, enum: LikeStatusEnum})
//     status: LikeStatusEnum
//
//     @Prop({type: Date, default: Date.now})
//     modifiedAt: Date
// }
//
// @Entity()
// class LikesOnComments {
//
//     @Column("string")
//     commentId: string
//
//     @Column()
//     status: LikeStatusEnum
//
//     @Column()
//     modifiedAt: Date
// }
//
// @Entity()
//
// export class User{
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column(type => UserAccountTypeSchema)
//     accountData: UserAccountTypeSchema
//
//     @Column(type => EmailConfirmationTypeSchema)
//     emailConfirmation: EmailConfirmationTypeSchema
//
//     @Column( type => Array< LikesOnPosts>)
//     reactedPosts: LikesOnPosts[]
//
//     @Column( type => Array< LikesOnComments>)
//     reactedComments: LikesOnComments[]
// }


////////////////////////////////////////////////////


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({default: true})
    isActive: boolean;

    @Column({unique: true})
    login: string;

    @Column({unique: true})
    email: string;

    @Column({type: "uuid"})
    confirmationCode: string;

    @Column({})
    passwordHash: string;

    @Column({type: "timestamp", nullable: true})
    expirationDate: Date;

    @Column({type: "boolean"})
    isConfirmed: boolean

    @CreateDateColumn()
    createdAt: Date;

    @Column({type: "uuid", nullable: true})
    passwordRecoveryCode: string

    @Column({default: false})
    isBanned: boolean

    @Column({nullable: true})
    banReason: string

    @Column({type: "timestamp", nullable: true})
    banDate: Date;


    @OneToMany(
        () => DeviceEntity,
        (devices) => devices.user)
    @JoinColumn({referencedColumnName: "id"})
    devices: DeviceEntity[]


    @OneToMany(
        () => CommentEntity,
        (comments) => comments.user)
    @JoinColumn([{/*name: 'commentId',*/ referencedColumnName: 'id'}])
    comments: CommentEntity[]


    @OneToMany(
        () => LikeEntity,
        l => l.user
    )
    @JoinColumn({referencedColumnName: "userId"})
    likes: LikeEntity[]

    @OneToMany(
        () => BlogEntity,
        (blog) => blog.user
    )
    @JoinColumn({referencedColumnName: 'userId'})
    blogs: BlogEntity[]
}
