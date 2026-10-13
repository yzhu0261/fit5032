<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'

const resources = ref([
  { id: 1, name: 'River Red Gum', category: 'Native Plant', location: 'Melbourne' },
  { id: 2, name: 'Rainbow Lorikeet', category: 'Wildlife', location: 'Melbourne' },
  { id: 3, name: 'Golden Wattle', category: 'Native Plant', location: 'Victoria' },
  { id: 4, name: 'Common Brushtail Possum', category: 'Wildlife', location: 'Clayton' },
  { id: 5, name: 'Coastal Banksia', category: 'Native Plant', location: 'Bayside' },
  { id: 6, name: 'Superb Fairy-wren', category: 'Wildlife', location: 'Melbourne' },
  { id: 7, name: 'Tree Planting Guide', category: 'Guide', location: 'Victoria' },
  { id: 8, name: 'Eastern Grey Kangaroo', category: 'Wildlife', location: 'Dandenong' },
  { id: 9, name: 'Kangaroo Grass', category: 'Native Plant', location: 'Victoria' },
  { id: 10, name: 'Native Garden Guide', category: 'Guide', location: 'Melbourne' },
  { id: 11, name: 'Silver Wattle', category: 'Native Plant', location: 'Victoria' },
  { id: 12, name: 'Australian Magpie', category: 'Wildlife', location: 'Clayton' }
])

// Store the table search filters.
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
</script>

<!-- This page helps users learn more about biodiversity and related resources. -->
<template>
  <main class="container py-5">
    <h1>Biodiversity & Resources</h1>
    <p>Learn more about Melbourne's biodiversity and find out how you can help protect the local ecosystems.</p>

    <div class="row mt-4">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Native Plants</h2>
            <p class="card-text">Learn about native plants that support Melbourne's local biodiversity.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <!-- h-100 will help these cards in the same row same height. -->
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Urban Wildlife</h2>
            <p class="card-text">Discover local wildlife and learn how urban habitats can support different species.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Tree Planting Guide</h2>
            <p class="card-text">Explore basic information about planting and caring for trees in local communities. </p>
          </div>
        </div>
      </div>
    </div>

    <section class="mt-5">
      <h2 class="h4 mb-3">Biodiversity Resources Directory</h2>

      
<DataTable
  :value="resources"
  dataKey="id"
  v-model:filters="filters"
  :globalFilterFields="['name', 'category', 'location']"
  filterDisplay="row"
  paginator
  :rows="5"
  :rowsPerPageOptions="[5, 10]"
  stripedRows
  showGridlines
>
  <template #header>
    <div class="d-flex justify-content-end">
      <input
        v-model="filters.global.value"
        type="text"
        class="form-control w-auto"
        placeholder="Search all resources"
        aria-label="Search all resources"
      />
    </div>
  </template>

  <Column field="name" header="Resource Name" sortable>
    <template #filter="{ filterModel, filterCallback }">
      <input
        v-model="filterModel.value"
        type="text"
        class="form-control"
        placeholder="Search name"
        aria-label="Search resource name"
        @input="filterCallback()"
      />
    </template>
  </Column>

  <Column field="category" header="Category" sortable>
    <template #filter="{ filterModel, filterCallback }">
      <input
        v-model="filterModel.value"
        type="text"
        class="form-control"
        placeholder="Search category"
        aria-label="Search resource category"
        @input="filterCallback()"
      />
    </template>
  </Column>

  <Column field="location" header="Location" sortable>
    <template #filter="{ filterModel, filterCallback }">
      <input
        v-model="filterModel.value"
        type="text"
        class="form-control"
        placeholder="Search location"
        aria-label="Search resource location"
        @input="filterCallback()"
      />
    </template>
  </Column>

  <template #empty>
    No resources found.
  </template>
</DataTable>
    </section>
  </main>
</template>