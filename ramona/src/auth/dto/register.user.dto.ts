import{IsString, IsNotEmpty, IsEmail} from 'class-validator'

export class RegisterUserDto{

    @IsNotEmpty()
    @IsString()
    userNames: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

}