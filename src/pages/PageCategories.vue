<template>
  <div class="page-categories">
    <!-- Header -->
    <div class="row items-center justify-between q-pa-md q-mb-md">
      <div class="text-h6 text-white">Expenses</div>
      <q-btn icon="add" flat round dense color="primary" />
    </div>

    <!-- Balance Cards -->
    <div class="row q-col-gutter-sm q-mb-md q-px-md">
      <div class="col-4">
        <q-card class="text-center balance-card-dark">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-5">Total</div>
            <div class="text-subtitle1 text-weight-bold text-positive">
              {{ currencyFormat(totalBalance) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card class="text-center balance-card-dark">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-5">Expenses</div>
            <div class="text-subtitle1 text-weight-bold text-negative">
              {{ currencyFormat(-totalExpenses) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card class="text-center balance-card-dark">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-5">Left</div>
            <div class="text-subtitle1 text-weight-bold text-white">
              {{ currencyFormat(balance) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Donut Chart -->
    <div class="row justify-center q-mb-md q-px-md">
      <div class="donut-chart-container" style="position: relative; width: 200px; height: 200px;">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            v-for="(segment, index) in donutSegments"
            :key="index"
            cx="100"
            cy="100"
            r="70"
            fill="none"
            :stroke="segment.color"
            :stroke-width="30"
            :stroke-dasharray="`${segment.length} ${circumference - segment.length}`"
            :stroke-dashoffset="-segment.offset"
            transform="rotate(-90 100 100)"
          />
          <!-- Center icon -->
          <circle cx="100" cy="100" r="40" fill="#FFA500" />
          <text x="100" y="110" text-anchor="middle" fill="white" font-size="30" font-weight="bold">$</text>
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
          <div class="text-center">
            <div class="text-h6 text-weight-bold text-white">{{ currencyFormat(balance) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category List -->
    <div class="q-px-md">
      <q-card class="category-list-card">
        <q-list separator>
          <q-item
            v-for="category in categoriesWithExpenses"
            :key="category.id"
            clickable
            v-ripple
            class="category-item"
          >
            <q-item-section avatar>
              <q-icon :name="category.icon" :color="getCategoryColor(category.color)" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium text-white">{{ category.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="column items-end">
                <q-item-label class="text-weight-bold text-white">
                  {{ currencyFormat(getCategorySpent(category.id)) }}
                </q-item-label>
                <q-icon name="chevron_right" size="xs" color="grey-6" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { currencyFormat } from 'src/js/utils'
import { useCategoriesStore } from 'src/stores/categories'
import { useTransactionsStore } from 'src/stores/transactions'

const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()

const categories = computed(() => categoriesStore.categories)
const balance = computed(() => transactionsStore.balance)
const totalExpenses = computed(() => transactionsStore.totalExpenses)
const totalBalance = computed(() => transactionsStore.balance)

const categoriesWithExpenses = computed(() => {
  const expensesByCategory = transactionsStore.expensesByCategory
  return categories.value.filter(cat => {
    const spent = expensesByCategory[cat.id]?.total || 0
    return spent > 0
  })
})

const getCategorySpent = (categoryId) => {
  const expensesByCategory = transactionsStore.expensesByCategory
  return -(expensesByCategory[categoryId]?.total || 0)
}

const getCategoryColor = (colorHex) => {
  // Convert hex to Quasar color name or return custom
  const colorMap = {
    '#FFA500': 'orange',
    '#4169E1': 'blue',
    '#FF1493': 'pink',
    '#9370DB': 'purple',
    '#808080': 'grey',
  }
  return colorMap[colorHex] || 'primary'
}

// Donut chart calculations
const circumference = 2 * Math.PI * 70 // radius = 70

const donutSegments = computed(() => {
  const expensesByCategory = transactionsStore.expensesByCategory
  const total = transactionsStore.totalExpenses
  
  if (total === 0) return []
  
  let currentOffset = 0
  const segments = []
  
  categories.value.forEach((category) => {
    const spent = expensesByCategory[category.id]?.total || 0
    if (spent > 0) {
      const percentage = spent / total
      const length = percentage * circumference
      
      segments.push({
        color: category.color,
        length,
        offset: currentOffset,
        category: category.name,
      })
      
      currentOffset += length
    }
  })
  
  return segments
})
</script>

<style scoped>
.page-categories {
  background: #1a1a1a;
  min-height: 100vh;
  padding-bottom: 70px;
}

.balance-card-dark {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
}

.donut-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-list-card {
  background: #2a2a2a;
  border-radius: 12px;
}

.category-item {
  background: #2a2a2a;
}

.category-item:hover {
  background: #3a3a3a;
}
</style>
