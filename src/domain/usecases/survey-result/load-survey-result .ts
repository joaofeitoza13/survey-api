import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
