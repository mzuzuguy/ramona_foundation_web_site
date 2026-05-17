import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';


@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //check if role exist before creating any role
  async createRole(name: string): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException(`Role with name '${name}' already exists.`);
    }

    //if role doesn't exist then create
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  //check if role exist before deleting
  async deleteRole(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['users'] });
    if (!role) {
      throw new NotFoundException(`Role with id '${id}' does not exist.`);
    }

    //if thats the only 1 user has that role you can not delete
    const totalRoles = await this.roleRepository.count();
    if (totalRoles === 1) {
      throw new BadRequestException(`Cannot delete the only remaining role.`);
    }

    //check if role is assigned to user 
    if (role.users && role.users.length > 0) {
      throw new ConflictException(`Cannot delete role with id '${id}' because it is assigned to users.`);
    }

    //if not assigned to user  delete
    await this.roleRepository.delete(id);
  }

  //display/call all roles 
  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
  
  //display/call one role 
  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id '${id}' does not exist.`);
    }
    return role;
  }

}