import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Breakdowns')
export class Breakdown {
  @PrimaryGeneratedColumn()
  breakdown_id: number;

  @Column('int')
  truck_id: number;

  @Column('int')
  mechanic_id: number;

  @Column('int')
  estimated_repair_time: number;
}
