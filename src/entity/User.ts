import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { Length, Matches } from 'class-validator';
import { EMAIL_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../constants';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;

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
}