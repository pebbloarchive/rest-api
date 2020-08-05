import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql'
import { User } from '../entity/User'
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hi!'
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email', () => String) email: string,
    @Arg('username', () => String) username: string,
    @Arg('password', () => String) password: string
  ) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findOne({ where: { username } });
    const userEmail = await User.findOne({ where: { email } });

    if(user) throw new Error('A user with that username or email already exists');
    if(userEmail) throw new Error('A user with that username or email already exists');

    try {
      await User.insert({
        _id: uuid(),
        email,
        username,
        password: hashed
      }); 
    } catch(err) {
      console.log(err);
      return false;
    }
    return true
  }
}