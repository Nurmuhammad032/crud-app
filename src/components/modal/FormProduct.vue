<template>
  <q-dialog v-model="store.isOpenModal">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="column q-gutter-sm">
        <h6 class="text-h6 mb-3">
          {{ store.isEdit ? 'Create Product' : 'Edit Product' }}
        </h6>
        <q-form @submit="submit" class="column q-gutter-sm">
          <q-input outlined v-model="form.name_uz" label="Name" />
          <q-input outlined v-model="form.address" label="Address" />
          <q-select
            outlined
            v-model="form.product_type_id"
            :options="
              store.productTypes.map((type) => ({
                label: type.name_uz || '',
                value: type.id,
              }))
            "
            map-options
            emit-value
            label="Product type"
          />
          <q-input outlined type="number" v-model="form.cost" label="Price" />
          <p class="self-center" style="color: red" v-if="isError">
            All fields are required!
          </p>
          <q-btn type="submit" outline color="gray" size="" class="self-center"
            >Submit</q-btn
          >
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProductsStore } from '../../stores/productsStore';
import { checkAllForm } from '../../utils/checkAllForm';
import { IProduct } from 'src/types/product';

const store = useProductsStore();
const intialForm = () => ({
  name_uz: '',
  product_type_id: '',
  cost: '',
  address: '',
});
const form = ref<IProduct>(intialForm());
const isError = ref(false);

const submit = async () => {
  isError.value = false;
  const isFilled = checkAllForm(form.value);
  if (isFilled) {
    await store.createOrUpdateProduct({
      productData: form.value,
      action: store.editingProduct && store.isEdit ? 'update' : 'create',
    });
  } else {
    isError.value = true;
  }
};

watch(
  () => store.isOpenModal,
  (newValue) => {
    if (!newValue) {
      store.isEdit = false;
    } else if (store.editingProduct && store.isEdit) {
      form.value = {
        id: store.editingProduct.id,
        name_uz: store.editingProduct.name,
        product_type_id: +store.editingProduct.typeId || '',
        cost: store.editingProduct.cost,
        address: store.editingProduct.address,
        created_date: Date.now(),
      };
    } else {
      form.value = intialForm();
    }
  }
);
</script>
