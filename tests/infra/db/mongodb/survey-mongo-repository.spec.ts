import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { AccountModel } from '@/domain/models'
import { mockAddSurveyParams, mockAddAccountParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccount = async (): Promise<AccountModel> => {
  const accountId = await accountCollection.insertOne(mockAddAccountParams())
    .then(result => result.insertedId)
  const account = await accountCollection.findOne({ _id: accountId })
  return account && MongoHelper.map(account)
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
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
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
      const account = await mockAccount()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const firstSurveyId = await surveyCollection.insertMany(addSurveyModels)
        .then(result => result.insertedIds[0])
      const survey = await surveyCollection.findOne({ _id: firstSurveyId })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: Date
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const account = await mockAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
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
  })
})
