import {IsNotEmpty, IsString, IsEmail, Length, IsDate} from 'class-validator';
import {Prop} from "@nestjs/mongoose";
import {Schema} from "mongoose";

export class CreateUserDto {
    @IsString()
    @Length(3,10)
    login: string;

    @IsEmail()
    email: string;

    @Length(6,20)
    password: string;

    createdAt?: Date
}