import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('TripShipments')
export class TripShipment {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  trip_id: number;

  @Column('int')
  shipment_id: number;
}
