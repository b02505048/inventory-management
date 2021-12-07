<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated class="migo-header">
      <img alt="Migo Content Marketing" src="~assets/header.png" />
      <q-tabs v-model="tab" inline-label>
        <q-tab name="inventory">
          <div class="inventory-tab">
            <img class="tab-icon" src="~assets/icons/home.png" />
            <div class="q-ml-sm text-bold text-16">INVENTORY</div>
          </div>
        </q-tab>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  data() {
    return {
      tab: "inventory",
    };
  },
});
</script>

<style scoped>
.migo-header {
  display: flex;
  height: 64px;
  background: #e31e30;
}

.inventory-tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-icon {
  height: 18px;
}
</style>
