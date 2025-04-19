import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, name: 'display_name' })
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.CASHIER] })
  roles: Role[];

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'refresh_token' })
  @Exclude({ toPlainOnly: true })
  refreshToken: string;

  // @OneToMany(() => Order, (order) => order.cashier)
  // orders: Order[];

  // @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.createdBy)
  // purchaseOrders: PurchaseOrder[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
