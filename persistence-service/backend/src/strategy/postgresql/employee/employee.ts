import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Employees')
export class Employee {

  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  seniority: string;
}
