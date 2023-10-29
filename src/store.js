import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  state: {
    count: 0,
    selectedTheme: 'light-theme', // За замовчуванням світла тема
  },
  mutations: {
    setCount: (state, count) => (state.count = count),
    setTheme: (state, theme) => (state.selectedTheme = theme),
  },
  getters: {
    getCount: (state) => {
      return state.count;
    },
    getSelectedTheme: (state) => {
      return state.selectedTheme;
    },
  },
  plugins: [createPersistedState()],
});

export default store;