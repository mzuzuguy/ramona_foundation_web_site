import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { username },
            relations: ['role'],
        });
    }

    async deleteUser(adminUser: User, userIdToDelete: number): Promise<{ message: string }> {
        if (adminUser.role.name !== 'admin') {
            throw new ForbiddenException('Only admin users can delete users');
        }

        const userToDelete = await this.findById(userIdToDelete);
        await this.userRepository.remove(userToDelete);

        return { message: `User with ID ${userIdToDelete} has been deleted` };
    }

    async assignRoleToUser(adminUser: User, userId: number, roleId: number): Promise<User> {
        if (adminUser.role.name !== 'admin') {
            throw new ForbiddenException('Only admin users can assign roles');
        }

        const user = await this.findById(userId);

        const role = await this.roleRepository.findOne({
            where: { id: roleId },
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        user.role = role;
        return this.userRepository.save(user);
    }
}