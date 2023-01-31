import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    surveys: async (parent: any, args: any) => adaptResolver(makeLoadSurveysController(), parent, args)
  }
}
