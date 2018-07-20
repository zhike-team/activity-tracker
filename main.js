module.exports = function createActivityTracker ({ onBecomeInactive, INACTIVE_WAIT_TIME = 300000, ctx }) {
  const instance = {
    options: { onBecomeInactive, INACTIVE_WAIT_TIME, ctx },
    sessionStartTime: null,
    countdownTimer: null
  }

  const startSession = () => {
    instance.sessionStartTime = new Date()
    resumeCountdown()
  }

  const hasSession = () => {
    return !!instance.sessionStartTime
  }

  const resumeCountdown = () => {
    if (instance.countdownTimer) {
      clearTimeout(instance.countdownTimer)
    }
    instance.countdownTimer = setTimeout(closeSession, instance.options.INACTIVE_WAIT_TIME)
  }

  const pauseCountdown = () => {
    if (instance.countdownTimer) {
      clearTimeout(instance.countdownTimer)
    }
  }

  const closeSession = () => {
    // FIXME: 是否有必要
    if (instance.countdownTimer) {
      clearTimeout(instance.countdownTimer)
    }
    if (!hasSession()) {
      return
    }
    const sessionStartTime = instance.sessionStartTime
    instance.sessionStartTime = null

    const sessionEndTime = new Date()
    const { onBecomeInactive, ctx } = instance.options
    onBecomeInactive({
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      ctx
    })
  }

  const updateActivity = () => {
    if (!hasSession()) {
      startSession()
    } else {
      resumeCountdown()
    }
  }


  startSession()

  return {
    updateActivity,
    pauseCountdown,
    resumeCountdown
  }
}