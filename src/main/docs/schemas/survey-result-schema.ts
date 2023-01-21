export const surveyResultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    accountID: {
      type: 'string'
    },
    surveyId: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    date: {
      type: 'string'
    }
  }
}
