import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto.name);
  }

  @Get()
  findAll() {
    return this.roleService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findOneRole(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }

}