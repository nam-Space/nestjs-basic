import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }

    return await this.userModel.findOne({ _id: id });
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      return 'User not found';
    }
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }
    return await this.userModel.deleteOne({ _id: id });
  }
}
