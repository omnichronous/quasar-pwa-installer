export default ({ store }) => {
  /*
    Register store module
  */
  store.registerModule('pwa-installer', {
    namespaced: true,

    state: {
      displayMode: null,
      event: null,
      userChoiceOutcome: null,
      isCustomPromptDismissed: false,
    },

    getters: {
      isInPwaMode (state) {
        return state.displayMode === 'standalone'
      },

      isCustomPromptVisible (state, getters) {
        return Boolean(
          state.event &&
          !state.isCustomPromptDismissed &&
          !getters.isInPwaMode
        )
      },
    },

    mutations: {
      storeEvent (state, value) {
        state.event = value
      },

      storeOutcome (state, value) {
        state.userChoiceOutcome = value
      },

      storeDisplayMode (state, value) {
        state.displayMode = value
      },

      disableCustomPrompt (state, value) {
        state.isCustomPromptDismissed = value
      },
    },

    actions: {
      async prompt ({ state, commit }) {
        const userChoice = await state.event.prompt()

        commit('storeOutcome', userChoice.outcome)
      },

      dismissCustomPrompt ({ commit }) {
        commit('disableCustomPrompt', true)
      },
    },
  })

  /*
    Listen for the beforeinstallprompt event
  */
  window.addEventListener('beforeinstallprompt', function (event) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt:
    event.preventDefault()

    store.commit('pwa-installer/storeEvent', event)
  })

  /*
    Track how the PWA was launched
  */
  window.addEventListener('DOMContentLoaded', () => {
    let displayMode = 'browser tab'

    if (navigator.standalone) {
      displayMode = 'standalone-ios'
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      displayMode = 'standalone'
    }

    store.commit('pwa-installer/storeDisplayMode', displayMode)
  })

  /*
    Track when the display mode changes
  */
  window.addEventListener('DOMContentLoaded', () => {
    window.matchMedia('(display-mode: standalone)').addListener((evt) => {
      let displayMode = 'browser tab'

      if (evt.matches) {
        displayMode = 'standalone'
      }

      store.commit('pwa-installer/storeDisplayMode', displayMode)
    })
  })
}
