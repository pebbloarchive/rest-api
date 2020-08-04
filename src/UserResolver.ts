import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql'

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hi!'
  }
}
