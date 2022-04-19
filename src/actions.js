function login() {
  console.log('login')
}

function tweet(message) {
  console.log(message)
}

function runActions() {
  const text = process.argv[2]
  const action = text.split(' ')[0]

  if (action === 'login') {
    login()
    return
  }

  // tweet
  const message = text.split(' ').slice(1).join(' ')
  tweet(message)
}

runActions()
