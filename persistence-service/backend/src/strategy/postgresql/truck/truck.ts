import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Trucks')
export class Truck {
  @PrimaryGeneratedColumn()
  truck_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  brand: string;

  @Column('int')
  load: number;

  @Column('int')
  capacity: number;

  @Column('int')
  year: number;

  @Column('int')
  number_of_repairs: number;
}
