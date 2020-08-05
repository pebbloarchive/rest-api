import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { Length, Matches } from 'class-validator';
import { EMAIL_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../constants';

export enum UserPermissions {
  ALPHA = 'ALPHA',
  BETA = 'BETA',
  DEFAULT = 'DEFAULT',
  VERIFIED = 'VERIFIED',
  PREMIUM = 'PREMIUM',
  STAFF = 'STAFF',
  DEV = 'DEV'
}

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text',  { nullable: true })
  _id: string;

  @Field()
  @Column()
  @Matches(EMAIL_REGEX)
  email: string;

  @Field()
  @Column('text')
  @Length(3, 20)
  @Matches(USERNAME_REGEX)
  username: string;

  @Column('text', { nullable: false })
  @Matches(PASSWORD_REGEX)
  password: string;

  @Field()
  @Column('text', { default: '' })
  @Length(1, 40)
  name: string;

  @Column('boolean', { default: false })
  suspended: boolean;

  @Column('text', { nullable: true })
  suspended_date: string;

  @Column('simple-json', { nullable: true, default: ['ALPHA', 'DEFAULT'] })
  permissions: UserPermissions[];
  
  @Column('boolean', { default: false })
  mfa_enabled: boolean;
  
  // @Column('text', { array: true, default: [] })
  // mfa_codes: string;

  @Column('text', { default: '' })
  registered_at: string;

}