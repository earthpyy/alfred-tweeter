import alfy from 'alfy'

const MAX_LENGTH = 280

const leftLength = MAX_LENGTH - alfy.input.length

alfy.output([
  {
    title: `Tweet '${alfy.input}'`,
    subtitle: `${leftLength} characters remaining`,
  },
])
