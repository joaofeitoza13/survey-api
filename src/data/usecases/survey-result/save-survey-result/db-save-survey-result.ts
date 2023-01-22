import {
  SurveyResultModel, SaveSurveyResult,
  SaveSurveyResultParams, SaveSurveyResultRepository, LoadSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepositoryStub.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
