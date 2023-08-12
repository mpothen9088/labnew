import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity('TripDrivers')
export class TripDriver {

  @PrimaryColumn('int')
  trip_id: number;

  @PrimaryColumn('int')
  driver_id: number;

}
