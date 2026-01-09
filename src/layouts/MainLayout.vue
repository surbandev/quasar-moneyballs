<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white">
      <q-tabs
        v-model="currentTab"
        class="text-grey-5"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab
          name="overview"
          icon="visibility"
          label="Overview"
          to="/"
          exact
        />
        <q-route-tab
          name="budget"
          icon="donut_large"
          label="Budget"
          to="/categories"
        />
        <q-route-tab
          name="save"
          icon="favorite"
          label="Save"
          to="/entries"
        />
        <q-route-tab
          name="tools"
          icon="work"
          label="Tools"
          to="/settings"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTab = ref('overview')

// Update current tab based on route
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      currentTab.value = 'overview'
    } else if (newPath === '/categories') {
      currentTab.value = 'budget'
    } else if (newPath === '/entries') {
      currentTab.value = 'save'
    } else if (newPath === '/settings') {
      currentTab.value = 'tools'
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.q-footer {
  background: #2a2a2a !important;
  border-top: 1px solid #3a3a3a;
  padding: 8px 0;
}

:deep(.q-tabs) {
  min-height: 60px;
}

:deep(.q-tab) {
  padding: 8px 12px;
  min-height: 56px;
}

:deep(.q-tab__label) {
  font-size: 11px;
  margin-top: 4px;
}

:deep(.q-tab__icon) {
  font-size: 24px;
}
</style>
