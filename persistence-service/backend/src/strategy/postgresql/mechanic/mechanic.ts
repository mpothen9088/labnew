import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  specialized_brand: string;
}
