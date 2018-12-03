const types = {
	NEW_SHIP: 'NEW_SHIP'
};

export default {
	state: {
		forgeShip: null
	},
	mutations: {
		NEW_SHIP(state, data) {
			if (!data) {
				return
			}
			state.forgeShip = data;
		}
	},
	actions: {
		newShip({ commit }, ship) {
      commit(types.NEW_SHIP, ship);
		}
	},
	getters: {}
};
