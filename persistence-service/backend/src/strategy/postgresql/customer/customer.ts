import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Customers')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  phone_number1: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone_number2: string;
}
