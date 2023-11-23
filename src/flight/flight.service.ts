import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { IFlight } from '../common/interfaces/flight.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FLIGHT } from '../common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async create(flightDTO: FlightDTO): Promise<IFlight> {
    const newFlight = new this.model(flightDTO);
    return await newFlight.save();
  }

  async findAll(): Promise<IFlight[]> {
    return this.model.find();
  }

  async findOne(id: string): Promise<IFlight> {
    return this.model.findById(id);
  }

  async update(id: string, flightDTO: FlightDTO): Promise<IFlight> {
    return this.model.findByIdAndUpdate(id, flightDTO, { new: true });
  }

  async delete(id: string): Promise<{ msg: string; status: HttpStatus }> {
    await this.model.findByIdAndDelete(id);
    return { status: HttpStatus.OK, msg: 'Deleted' };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    try {
      return this.model
        .findByIdAndUpdate(
          flightId,
          {
            $addToSet: { passengers: passengerId },
          },
          { new: true },
        )
        .populate('passengers');
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
