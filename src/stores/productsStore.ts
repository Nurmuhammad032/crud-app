import { date, useQuasar } from 'quasar';
import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { IProduct } from '../types/product';

interface IProductTypes {
  id: number;
  name_uz: string;
  name_ru: string;
  name_uk: string;
  typeId: number;
  description: null | string;
}

interface IRows {
  name: string;
  cost: string;
  typeId: number;
  address: string;
  type: string;
  createdAt: string;
  id: number;
}

// Updating details extracted from the row
type IEditingProduct = IRows;

interface IState {
  products: IProduct[];
  productTypes: IProductTypes[];
  pending: boolean;
  rows: IRows[];
  isOpenModal: boolean;
  isEdit: boolean;
  editingProduct: IEditingProduct | null;
}

const quasar = useQuasar();

export const useProductsStore = defineStore('products', {
  state: (): IState => ({
    products: [],
    pending: true,
    productTypes: [],
    rows: [],
    isOpenModal: false,
    isEdit: false,
    editingProduct: null,
  }),

  actions: {
    async fetchProducts() {
      this.pending = true;
      try {
        const res = await api<IProduct[]>('/product');
        const products = res.data;
        this.products = products.map((product) => ({
          ...product,
          createdAt: date.formatDate(product.created_date, 'DD-MM-YYYY'),
        }));
        this.rows = products.map(this.formatRow);
      } catch (error) {
        this.showErrorMessage((error as Error).message);
      } finally {
        this.pending = false;
      }
    },

    async fetchProductTypes() {
      try {
        const res = await api<IProductTypes[]>('/product/get-product-types');
        this.productTypes = res.data;
      } catch (error) {
        this.showErrorMessage((error as Error).message);
      }
    },

    async deleteProduct(productId: number) {
      this.pending = true;
      try {
        const res = await api.delete(`/product/${productId}`);
        if (res.status === 200) {
          await this.fetchProducts();
        }
      } catch (error) {
        this.showErrorMessage((error as Error).message);
      } finally {
        this.pending = false;
      }
    },

    openCreateModal() {
      this.editingProduct = null;
      this.isEdit = false;
      this.isOpenModal = true;
    },

    openEditModal(product: IEditingProduct) {
      this.editingProduct = product;
      this.isEdit = true;
      this.isOpenModal = true;
    },

    formatRow(product: IProduct): IRows {
      return {
        name: product.name_uz,
        cost: product.cost,
        type:
          this.productTypes.find((type) => type.id === product.product_type_id)
            ?.name_uz ?? 'Not specified',
        typeId:
          this.productTypes.find((type) => type.id === product.product_type_id)
            ?.id ?? 0,
        address: product.address,
        createdAt: date.formatDate(product.created_date, 'DD-MM-YYYY'),
        id: product.id as number,
      };
    },

    async createOrUpdateProduct({
      productData,
      action,
    }: {
      productData: IProduct;
      action: 'update' | 'create';
    }) {
      try {
        const method = action === 'create' ? 'POST' : 'PUT';
        await api.request({
          url: '/product',
          method,
          data: {
            ...productData,
            created_date: Date.now(),
          },
        });
        this.fetchProducts();
        this.isOpenModal = false;
        this.isEdit = false;
      } catch (error) {
        this.showErrorMessage((error as Error).message);
      }
    },

    showErrorMessage(message: string) {
      quasar.notify({
        message,
        color: 'negative',
        icon: 'report_problem',
      });
    },
  },
});
