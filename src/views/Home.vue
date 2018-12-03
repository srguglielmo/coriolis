<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src

import HelloWorld from "@/components/HelloWorld.vue";

import {Ship, Factory} from 'ed-forge';

export default {
	name: "home",
	components: {
  },
  data() {
    return {

    }
  },
  mounted() {
    const ship = Factory.newShip('anaconda');
    this.$store.dispatch('newShip', ship);
    console.log(this.$store);
    console.log(this.$store.state.Ship.forgeship);
  }
};
</script>
