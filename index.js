const createActivityTracker = require('./main')

const Sec = 3
const T = Sec * 1000
const tracker = createActivityTracker({
  INACTIVE_WAIT_TIME: T,
  onBecomeInactive: ({ startTime, endTime, ctx }) => console.log('    Session: %s, ctx: %s', (endTime.getTime() - startTime.getTime()) / 1000, ctx),
  ctx: 'fish'
})

function update() {
  console.log('Update Activity.')
  tracker.updateActivity()
}

function startTest() {
  update()
  const wait = 1 + Math.floor(Math.random() * 2 * Sec)
  setTimeout(startTest, wait * 1000)
}

startTest()
