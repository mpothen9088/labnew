import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id: number;

  @Column('int')
  weight: number;

  @Column('int')
  value: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  origin: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  destination: string;

  @Column('int')
  customer_id: number;
}
