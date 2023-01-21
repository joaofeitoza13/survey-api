import {
  accountSchema, loginParamsSchema, errorSchema,
  surveyAnswerSchema, surveysSchema, surveySchema,
  signUpParamsSchema, addSurveyParamsSchema,
  saveSurveyParamsSchema, surveyResultSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema
}
