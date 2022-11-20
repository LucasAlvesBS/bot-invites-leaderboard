import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inviter } from './inviter.entity';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'guild_id' })
  guildId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Inviter, inviter => inviter.members)
  @JoinColumn({ name: 'inviter_id' })
  inviter: Inviter;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
