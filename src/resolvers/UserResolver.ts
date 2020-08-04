import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql'
import { User } from 'src/entity/User'
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
    try {
      await User.insert({
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