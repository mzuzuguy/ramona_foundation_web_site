import { Exclude } from 'class-transformer';
import {Entity, Column} from 'typeorm'
import * bcrypt from 'bcrypt';

@Entity()
export class Auth{
    @Column()
    username: string;

    @Column({unique:true})
    email: string;

    @Column()
    @Exclude()//hides password from json responses
    password: string;

    //Automatically hash the password before saving/updating
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10)//cost factor
    }
    
   }    
}

