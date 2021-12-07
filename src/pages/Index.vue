<template>
  <q-page class="page">
    <div class="text-16 text-line-30">Inventory Manager</div>

    <inventory-table />
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import formatDate from "src/helpers/formatDate";
import InventoryTable from "src/components/InventoryTable.vue";

export default defineComponent({
  name: "PageIndex",

  components: {
    InventoryTable,
  },
});
</script>

<style scoped>
.page {
  margin: 16px 24px;
}
</style>
