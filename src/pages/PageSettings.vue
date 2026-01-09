<template>
  <div class="page-settings">
    <!-- Header -->
    <div class="text-h6 q-mb-md q-pa-md text-white">Tools</div>

    <!-- Tools Grid -->
    <div class="row q-col-gutter-md q-mb-xl q-px-md">
      <div class="col-6">
        <q-card class="tool-card cursor-pointer" flat @click="onResetData">
          <q-card-section class="text-center">
            <q-avatar size="60px" color="blue-4" text-color="white" class="q-mb-md">
              <q-icon name="refresh" size="30px" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">Reset Data</div>
            <div class="text-caption text-grey-7">Start fresh again, or restore previous</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="tool-card cursor-pointer" flat @click="onConnect">
          <q-card-section class="text-center">
            <q-avatar size="60px" color="green-4" text-color="white" class="q-mb-md">
              <q-icon name="chat" size="30px" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">Connect</div>
            <div class="text-caption text-grey-7">Use it live to help what's on your mind</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="tool-card cursor-pointer" flat @click="onFAQ">
          <q-card-section class="text-center">
            <q-avatar size="60px" color="grey-5" text-color="white" class="q-mb-md">
              <q-icon name="help" size="30px" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">FAQ</div>
            <div class="text-caption text-grey-7">Frequently asked questions</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="tool-card cursor-pointer" flat @click="onSubscription">
          <q-card-section class="text-center">
            <q-avatar size="60px" color="yellow-6" text-color="white" class="q-mb-md">
              <q-icon name="star" size="30px" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">Subscription</div>
            <div class="text-caption text-grey-7">Manage your Premium subscription</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Version -->
    <div class="text-center text-grey-5 text-caption q-mb-xl">Version 15.21</div>

    <!-- Demo Mode Toggle -->
    <div class="q-px-md">
      <q-card flat class="demo-card-dark">
        <q-card-section class="q-py-sm">
          <div class="row items-center justify-between">
            <div>
              <q-icon name="science" size="sm" class="q-mr-sm" color="white" />
              <span class="text-white">Demo mode enabled</span>
            </div>
            <q-btn label="Disable" flat dense no-caps color="white" @click="toggleDemoMode" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useBudgetsStore } from 'src/stores/budgets'
import { useTransactionsStore } from 'src/stores/transactions'

const $q = useQuasar()
const budgetsStore = useBudgetsStore()
const transactionsStore = useTransactionsStore()

const toggleDemoMode = () => {
  budgetsStore.toggleDemoMode()
  $q.notify({
    message: budgetsStore.demoMode ? 'Demo mode enabled' : 'Demo mode disabled',
    color: 'info',
    position: 'top',
  })
}

const onResetData = () => {
  $q.dialog({
    title: 'Reset Data',
    message: 'Are you sure you want to reset all data? This action cannot be undone.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    transactionsStore.resetTransactions()
    $q.notify({
      message: 'Data reset successfully',
      color: 'positive',
      icon: 'check',
      position: 'top',
    })
  })
}

const onConnect = () => {
  $q.notify({
    message: 'Connect feature coming soon',
    color: 'info',
    position: 'top',
  })
}

const onFAQ = () => {
  $q.notify({
    message: 'FAQ section coming soon',
    color: 'info',
    position: 'top',
  })
}

const onSubscription = () => {
  $q.notify({
    message: 'Subscription management coming soon',
    color: 'info',
    position: 'top',
  })
}
</script>

<style scoped>
.page-settings {
  background: #1a1a1a;
  min-height: 100vh;
  padding-bottom: 70px;
}

.tool-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: #333;
}

:deep(.q-avatar) {
  background: var(--avatar-bg) !important;
}

:deep(.q-card-section) {
  color: white;
}

:deep(.text-caption) {
  color: #999;
}

.demo-card-dark {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
