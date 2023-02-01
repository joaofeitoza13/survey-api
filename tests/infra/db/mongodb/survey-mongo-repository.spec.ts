import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddSurveyParams, mockAddAccountParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
import ObjectID from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const accountId = await accountCollection.insertOne(mockAddAccountParams())
    .then(result => result.insertedId)
  return String(accountId)
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const firstSurveyId = await surveyCollection.insertMany(addSurveyModels)
        .then(result => result.insertedIds[0])
      const survey = await surveyCollection.findOne({ _id: firstSurveyId })
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey._id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: Date
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const surveyId = await surveyCollection.insertOne(mockAddSurveyParams())
        .then(result => result.insertedId)
      const sut = makeSut()
      const survey = await sut.loadById(surveyId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey does not exists', async () => {
      const surveyId = await surveyCollection.insertOne(mockAddSurveyParams())
        .then(result => result.insertedId)
      const sut = makeSut()
      const survey = await sut.loadById(surveyId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const surveyId = await surveyCollection.insertOne(mockAddSurveyParams())
        .then(result => result.insertedId)
      const survey = await surveyCollection.findOne({ _id: surveyId })
      const sut = makeSut()
      const answers = await sut.loadAnswers(String(surveyId))
      expect(answers).toEqual([survey.answers[0].answer, survey.answers[1].answer])
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(String(ObjectID('54495ad94c934721ede76d90')))
      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const surveyId = await surveyCollection.insertOne(mockAddSurveyParams())
        .then(result => result.insertedId)
      const sut = makeSut()
      const exists = await sut.checkById(surveyId.toString())
      expect(exists).toBe(true)
    })

    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(String(ObjectID('54495ad94c934721ede76d90')))
      expect(survey).toBe(false)
    })
  })
})
