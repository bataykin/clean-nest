import {Prop} from "@nestjs/mongoose";
import {
    AfterInsert, AfterUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {PostEntity} from "../../posts/entities/post.entity";
import {UserEntity} from "../../users/entity/user.entity";
import {Expose} from "class-transformer";
import {BannedUsersEntity} from "./bannedUsersEntity";

@Entity({name: 'blogs'} )
export class BlogEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string;

    @Column()
    youtubeUrl: string;

    @Column({nullable: true})
    userId: string;

    @Column({nullable: true, default: false})
    isBanned: boolean

    @Column({ type: 'timestamptz', nullable: true})
    banDate: Date

    @ManyToOne(
        () => UserEntity,
        (user) => user.blogs
    )
    user: UserEntity


    @OneToMany(
        () => PostEntity,
        (post) => post.blogger)
    @JoinColumn({referencedColumnName: 'blogId',})
    posts: PostEntity[];

    @OneToMany(
        () => BannedUsersEntity,
        (bannedUser) => bannedUser.blog)
    @JoinColumn({referencedColumnName: 'blogId'})
    bannedUsers: BannedUsersEntity[];



    @CreateDateColumn()
    createdAt: Date

    // @AfterInsert()
    // @AfterUpdate()
    // get blogOwnerInfo(): any {
    //     console.log('blogOwnerInfo ', this.user)
    //     return {
    //         userId: this.user?.id,
    //         userLogin: this.user?.login
    //     }
    // }


}
