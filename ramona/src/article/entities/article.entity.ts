import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    content: string;

    @Column()
    category: string;

    @Column()
    status: string;

    @Column({ nullable: true })
    featuredImageUrl: string;

    @Column()
    author: string;

    @CreateDateColumn()
    created_at: Date;
}