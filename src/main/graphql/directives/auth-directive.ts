import { makeAuthMiddleware } from '@/main/factories'
import { GraphQLSchema } from 'graphql'
import { ForbiddenError } from 'apollo-server-express'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

export const AuthDirectiveTranformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')
      if (authDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (source, args, context, info) => {
          const request = {
            accessToken: context.req.headers['x-access-token']
          }
          const httpResponse = await makeAuthMiddleware().handle(request)
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body)
            return resolve.call(this, source, args, context, info)
          } else {
            throw new ForbiddenError(httpResponse.body.message)
          }
        }
      }
      return fieldConfig
    }
  })
}
