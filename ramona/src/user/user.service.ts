import { Injectable, ForbiddenException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
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

    /**
     * Find user by ID
     * @param id - User ID
     * @returns User with their role
     * @throws NotFoundException if user doesn't exist
     */
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

    /**
     * Find user by email
     * @param email - User email
     * @returns User with their role or null if not found
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }

        //find user by role
    async findByRole(roleName: string): Promise<Role | null> {
        return this.roleRepository.findOne({
            where: { name: roleName },
            relations: ['users'],
        });
    }

    /**
     * Find user by username
     * @param username - User username
     * @returns User with their role or null if not found
     */
    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { username },
            relations: ['role'],
        });
    }

    /**
     * Delete a user (only admin can delete)
     * @param adminUser - The admin user performing the deletion
     * @param userIdToDelete - ID of user to delete
     * @returns Deletion result
     * @throws ForbiddenException if admin user doesn't have admin role
     * @throws NotFoundException if user to delete doesn't exist
     */
    async deleteUser(adminUser: User, userIdToDelete: number): Promise<{ message: string }> {
        // Check if the admin user has admin role
        if (adminUser.role.name !== 'admin') {
            throw new ForbiddenException('Only admin users can delete users');
        }

        // Find the user to delete FIRST
        const userToDelete = await this.findById(userIdToDelete);

        // THEN check if deleting the last admin
        if (userToDelete.role.name === 'admin') {
            const adminCount = await this.userRepository.count({
                where: { role: { name: 'admin' } }
            });
            if (adminCount === 1) {
                throw new BadRequestException('Cannot delete the last admin user.');
            }
        }

        await this.userRepository.remove(userToDelete);
        return { message: `User ${userToDelete.username} has been successfully deleted.` };
    }

    //find all users with their roles
    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find({ relations: ['role'] });
    }

    async createUser(username: string, email: string, password: string, roleId: number): Promise<User> {
       
       //check if email already exist before creating any user
        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) {
            throw new ConflictException(`User with email ${email} already exists`);
        }

        //check if role exist
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        //if role exist then create user
        const user = this.userRepository.create({ username, email, password, role });
        return this.userRepository.save(user);
    }

    

    /**
     * Assign a user to a role (only admin can assign)
     * @param adminUser - The admin user performing the assignment
     * @param userId - ID of user to assign role to
     * @param roleId - ID of role to assign
     * @returns Updated user with new role
     * @throws ForbiddenException if admin user doesn't have admin role
     * @throws NotFoundException if user or role doesn't exist
     */
    async assignRoleToUser(adminUser: User, userId: number, roleId: number): Promise<User> {
        // Check if the admin user has admin role
        if (adminUser.role.name !== 'admin') {
            throw new ForbiddenException('Only admin users can assign roles');
        }

        // Find the user
        const user = await this.findById(userId);

        // Find the role to assign
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        // Assign the role
        user.role = role;
        return this.userRepository.save(user);
    }

    //update user
    async updateUser(id: number, updateData: Partial<User>): Promise<User> {

    // step 1: check user exists
    const user = await this.findById(id);

    // step 2: if email is being changed, check it's not taken by someone else
    if (updateData.email) {
        const emailTaken = await this.userRepository.findOne({
            where: { email: updateData.email, id: Not(id) }
        });
        if (emailTaken) {
            throw new ConflictException(`Email ${updateData.email} is already taken.`);
        }
    }

    // step 3: update the fields and save
    Object.assign(user, updateData);
    return this.userRepository.save(user);





}
}