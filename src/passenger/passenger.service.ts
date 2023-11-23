import { HttpStatus, Injectable } from '@nestjs/common';
import { PassengerDTO } from './dto/passenger.dto';
import { PASSENGER } from '../common/models/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPassenger } from '../common/interfaces/passenger.interface';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) {}

  async create(passengerDTO: PassengerDTO): Promise<IPassenger> {
    const newPassenger = new this.model(passengerDTO);
    return await newPassenger.save();
  }

  async findAll(): Promise<IPassenger[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IPassenger> {
    return await this.model.findById(id);
  }

  async update(id: string, passengerDTO: PassengerDTO): Promise<IPassenger> {
    return await this.model.findByIdAndUpdate(id, passengerDTO, { new: true });
  }

  async delete(id: string): Promise<{ msg: string; status: HttpStatus }> {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Delete',
    };
  }
}