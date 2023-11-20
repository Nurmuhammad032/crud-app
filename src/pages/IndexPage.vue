<template>
  <q-page>
    <div class="container">
      <div class="content">
        <table-skeleton hidden />
        <q-table
          flat
          bordered
          title="Products"
          :rows="rows"
          :columns="columns"
          color="primary"
          row-key="name"
          :loading="pending"
        >
          <template v-slot:top-right>
            <q-btn
              icon="add"
              outline
              color="primary"
              @click="openCreateModal"
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  icon="delete"
                  color="red"
                  @click="deleteProduct(props.row.id)"
                />
                <q-btn icon="edit" color="green-14" />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
      <q-dialog v-model="isOpenCreateModal">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section class="col q-gutter-sm">
            <h6 class="text-h6 mb-3">Create Product</h6>
            <q-input outlined v-model="state.name_uz" label="Label" />
            <q-input outlined v-model="state.cost" label="Label" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            Click/Tap on the backdrop.
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IProduct } from '../types/product';
import { api } from '../boot/axios';
import TableSkeleton from '../components/TableSkeleton.vue';
import { useQuasar, QTableColumn, date } from 'quasar';
const isOpenCreateModal = ref(false);
const products = ref<IProduct[]>([]);
const pending = ref(true);
const rows = ref<any[]>([]);
const state = ref({
  product_type_id: 0,
  name_uz: 'string',
  cost: 0,
  address: 'string',
  created_date: '2023-11-20T10:22:00.833Z',
});
const openCreateModal = () => {
  isOpenCreateModal.value = true;
};

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
    name: 'action',
    align: 'right',
    label: 'Action',
    field: 'action',
  },
];
const { notify } = useQuasar();

const getProducts = async () => {
  try {
    const res = await api<IProduct[]>('/product');
    products.value = res.data;
    const formatRows = res.data?.map((product, i) => {
      return {
        name: product.name_uz,
        order: i + 1,
        cost: product.cost,
        address: product.address,
        createdAt: date.formatDate(product.created_date, 'DD-MM-YYYY'),
        id: product.id,
      };
    });
    rows.value = formatRows;
  } catch (error) {
    showErrorMessage((error as Error).message);
  } finally {
    pending.value = false;
  }
};

const deleteProduct = async (productId: number) => {
  pending.value = true;

  try {
    const res = await api.delete(`/product/${[productId]}`);
    if (res.status === 200) {
      await getProducts();
    }
  } catch (error) {
    showErrorMessage((error as Error).message);
  } finally {
    pending.value = false;
  }
};

const showErrorMessage = (message: string) => {
  notify({
    message: message,
    color: 'negative',
    icon: 'report_problem',
  });
};

onMounted(() => {
  getProducts();
});
</script>

<style scoped>
.content {
  padding: 1rem;
}
</style>
