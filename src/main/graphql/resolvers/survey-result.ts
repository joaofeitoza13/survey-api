import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeLoadSurveyResultController(), parent, args, context)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeSaveSurveyResultController(), parent, args, context)
  }
}
