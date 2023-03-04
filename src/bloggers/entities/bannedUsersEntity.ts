import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BlogEntity} from "./blogEntity";

@Entity({name:'banned_users'})
export class BannedUsersEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userId!: string

    @Column()
    blogId!: string

    @Column({default: false})
    isBanned: boolean

    @Column()
    banReason: string

    @Column({ type: 'timestamptz', nullable: true})
    banDate: Date

    @ManyToOne(
        () => BlogEntity,
        (blog) => blog.bannedUsers
    )
    blog: BlogEntity


}