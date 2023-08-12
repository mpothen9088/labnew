import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./employee";

@Entity('Drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  driver_id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "employee_id" })  // This sets up the foreign key relationship
  employee: Employee;

  @Column({
    type: 'varchar',
    length: 100,
  })
  category: string;
}
