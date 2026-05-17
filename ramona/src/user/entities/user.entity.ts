import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, CreateDateColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique; true})
    email: string;

    @Column()
    @Exclude() //hides password from JSON responses
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Role, (role) => role.users)
    role: Role;//one role many users


    //Automatically hash the password before saving/updating
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10)//cost factor
    }

  }    
}