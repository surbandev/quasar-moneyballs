<template>
  <div class="page-entries">
    <q-list class="transactions-list q-mx-md" bordered separator>
      <q-slide-item
        v-for="entry in entries"
        right-color="negative"
        :key="entry.id"
        @right="onEntrySlideRight($event, entry)"
      >
        <template v-slot:right>
          <q-icon name="delete" />
        </template>
        <q-item>
          <q-item-section class="text-weight-bold" :class="useAmountColorClass(entry.amount)">
            {{ entry.name }}
          </q-item-section>

          <q-item-section side class="text-weight-bold" :class="useAmountColorClass(entry.amount)">
            {{ currencyFormat(entry.amount) }}
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
  <q-footer class="bg-transparent">
    <div class="row q-px-md q-py-sm shadow-up-3 q-mb-sm">
      <div class="col text-grey-7 text-h6">Balance:</div>
      <div :class="useAmountColorClass(balance)" class="col text-h6 text-right">
        {{ currencyFormat(balance) }}
      </div>
    </div>
    <q-form @submit="addEntry" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
      <div class="col">
        <q-input
          placeholder="Name"
          v-model="addEntryForm.name"
          ref="nameRef"
          bg-color="white"
          outlined
          dense
        />
      </div>
      <div class="col">
        <q-input
          v-model.number="addEntryForm.amount"
          placeholder="Amount"
          bg-color="white"
          type="number"
          step="0.01"
          input-class="text-right"
          outlined
          dense
        />
      </div>
      <div class="col col-auto">
        <q-btn icon="add" type="submit" color="primary" round />
      </div>
    </q-form>
  </q-footer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { currencyFormat, useAmountColorClass } from 'src/js/utils'
import { uid, useQuasar } from 'quasar'
import { useTransactionsStore } from 'src/stores/transactions'

const $q = useQuasar()
const transactionsStore = useTransactionsStore()

// Use store data
const entries = computed(() => transactionsStore.sortedTransactions)
const balance = computed(() => transactionsStore.balance)

const nameRef = ref(null)

const addEntryFormInitialState = {
  name: '',
  amount: null,
}

const addEntryForm = reactive({
  ...addEntryFormInitialState,
})

const addEntryFormReset = () => {
  Object.assign(addEntryForm, addEntryFormInitialState)
  nameRef.value.focus()
}

const addEntry = () => {
  const newEntry = {
    id: uid(),
    name: addEntryForm.name,
    amount: addEntryForm.amount,
    date: new Date(),
  }
  transactionsStore.addTransaction(newEntry)
  addEntryFormReset()
}

const onEntrySlideRight = ({ reset }, entry) => {
  $q.dialog({
    title: 'Delete Entry',
    message: `
    Delete this entry?
    <div class="q-mt-md text-weight-bold ${useAmountColorClass(entry.amount)}">${entry.name} : ${currencyFormat(entry.amount)}</div>
    `,
    color: 'negative',
    ok: {
      label: 'Delete',
      color: 'negative',
      noCaps: true,
    },
    cancel: {
      label: 'Cancel',
      color: 'primary',
      noCaps: true,
    },
    persistent: true,
    html: true,
  })
    .onOk(() => {
      deleteEntry(entry.id)
      reset()
    })
    .onCancel(() => {
      reset()
    })
}

const deleteEntry = (entryId) => {
  transactionsStore.deleteTransaction(entryId)
  $q.notify({
    message: 'Entry deleted',
    color: 'positive',
    icon: 'check',
    position: 'top',
  })
}
</script>

<style scoped>
.page-entries {
  background: #1a1a1a;
  min-height: 100vh;
  padding-top: 16px;
  padding-bottom: 140px;
}

.transactions-list {
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
}

:deep(.q-item) {
  background: #2a2a2a;
  color: white;
}

:deep(.q-item:hover) {
  background: #3a3a3a;
}

:deep(.q-separator) {
  background: #3a3a3a;
}
</style>
