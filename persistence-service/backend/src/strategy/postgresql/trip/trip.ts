import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Trips')
export class Trip {
  @PrimaryGeneratedColumn()
  trip_id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  route_from: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  route_to: string;
}
