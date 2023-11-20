<template>
  <q-page>
    <div class="container">
      <div class="content">
        <table-skeleton hidden />
        <q-table
          flat
          bordered
          title="Products"
          :rows="store.rows"
          :columns="columns"
          color="primary"
          :pagination="{ rowsPerPage: 10 }"
          row-key="name"
          :loading="store.pending"
        >
          <template v-slot:top-right>
            <q-btn
              icon="add"
              outline
              color="primary"
              @click="store.openCreateModal"
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  icon="delete"
                  color="red"
                  @click="store.deleteProduct(props.row.id)"
                />
                <q-btn
                  icon="edit"
                  color="green-14"
                  @click="store.openEditModal(props.row)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
        <modal-form-product />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductsStore } from '../stores/productsStore';
import TableSkeleton from '../components/TableSkeleton.vue';
import { QTableColumn } from 'quasar';
import ModalFormProduct from '../components/modal/FormProduct.vue';
const store = useProductsStore();

const columns: QTableColumn[] = [
  {
    name: 'name',
    align: 'left',
    label: 'Name',
    field: 'name',
  },
  {
    name: 'cost',
    align: 'right',
    label: 'Cost',
    field: 'cost',
  },
  {
    name: 'address',
    align: 'right',
    label: 'Adress',
    field: 'address',
  },
  {
    name: 'created_at',
    align: 'right',
    label: 'Created Date',
    field: 'createdAt',
  },
  {
    name: 'type',
    align: 'right',
    label: 'Product Type',
    field: 'type',
  },
  {
    name: 'action',
    align: 'right',
    label: 'Action',
    field: 'action',
  },
];

onMounted(async () => {
  await store.fetchProductTypes();
  await store.fetchProducts();
  store.pending = false;
});
</script>

<style scoped>
.content {
  padding: 1rem;
}
</style>
