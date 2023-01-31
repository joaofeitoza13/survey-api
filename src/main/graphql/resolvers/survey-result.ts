import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) => adaptResolver(makeLoadSurveyResultController(), parent)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => adaptResolver(makeSaveSurveyResultController(), parent)
  }
}
