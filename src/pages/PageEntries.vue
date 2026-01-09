<template>
  <div class="q-pa-md">
    <q-list bordered separator>
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

const $q = useQuasar()

const entries = ref([
  {
    id: 'id1',
    name: 'Salary',
    amount: 4999.99,
  },
  {
    id: 'id2',
    name: 'Rent',
    amount: -999.99,
  },
  {
    id: 'id3',
    name: 'Phone',
    amount: -251.53,
  },
  {
    id: 'id4',
    name: 'Unknown',
    amount: 0,
  },
])

const nameRef = ref(null)

const balance = computed(() => {
  return entries.value.reduce((acc, entry) => acc + entry.amount, 0)
})

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
  const newEntry = Object.assign({}, addEntryForm, { id: uid() })
  entries.value.push(newEntry)
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
  const index = entries.value.findIndex((e) => e.id === entryId)
  entries.value.splice(index, 1)
  $q.notify({
    message: 'Entry deleted',
    color: 'positive',
    icon: 'check',
    position: 'top',
  })
}
</script>
