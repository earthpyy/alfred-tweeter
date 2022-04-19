import alfy from 'alfy'

const MAX_LENGTH = 280

function main() {
  const accessToken = alfy.config.get('accessToken')
  if (!accessToken) {
    alfy.output([
      {
        title: 'Login with Twitter',
        subtitle: 'This will open a new browser window to login',
				arg: 'login',
      },
    ])
    return
  }

  const leftLength = MAX_LENGTH - alfy.input.length

  alfy.output([
    {
      title: `Tweet '${alfy.input}'`,
      subtitle: `${leftLength} characters remaining`,
			arg: `tweet ${alfy.input}`
    },
  ])
}

main()
