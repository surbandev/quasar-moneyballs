<template>
  <div class="page-home">
    <!-- Header with Overview and Budget Selector -->
    <div class="header-section q-pa-md">
      <div class="row items-center justify-between">
        <div class="text-h6 text-weight-medium text-grey-9">Overview</div>
        <q-select
          v-model="activeBudgetId"
          :options="budgetOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          borderless
          dense
          class="budget-select text-grey-9"
          popup-content-class="budget-dropdown"
        >
          <template v-slot:prepend>
            <q-icon name="account_balance_wallet" size="xs" color="grey-7" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Balance Card with Chart -->
    <div class="balance-card q-mx-md q-mb-md">
      <div class="balance-content">
        <div class="text-caption text-grey-5 q-mb-xs">{{ currentMonth }}</div>
        <div class="balance-amount q-mb-md">
          {{ currencyFormat(totalBalance) }}
        </div>

        <!-- Line chart -->
        <div class="chart-container">
          <svg width="100%" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <!-- Gradient definition -->
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: #8b5cf6; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #a78bfa; stop-opacity: 1" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color: #8b5cf6; stop-opacity: 0.3" />
                <stop offset="100%" style="stop-color: #8b5cf6; stop-opacity: 0" />
              </linearGradient>
            </defs>

            <!-- Area fill -->
            <path :d="chartAreaPath" fill="url(#areaGradient)" />

            <!-- Line -->
            <polyline
              :points="chartPointsNormalized"
              fill="none"
              stroke="url(#lineGradient)"
              stroke-width="0.8"
              vector-effect="non-scaling-stroke"
            />

            <!-- Dots -->
            <circle
              v-for="(point, index) in chartPointsArrayNormalized"
              :key="index"
              :cx="point.x"
              :cy="point.y"
              r="1.2"
              :fill="index === chartPointsArrayNormalized.length - 1 ? '#A78BFA' : '#666'"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="q-mx-md q-mb-md">
      <div class="calendar-card">
        <div class="calendar-header q-pa-md">
          <div class="row items-center justify-between">
            <q-btn icon="chevron_left" flat round dense size="sm" color="grey-4" />
            <div class="text-h6 text-white">{{ currentMonth }}</div>
            <q-btn icon="chevron_right" flat round dense size="sm" color="grey-4" />
          </div>
        </div>

        <!-- Day labels -->
        <div class="calendar-days-header q-px-md q-pb-sm">
          <div class="row">
            <div
              v-for="day in dayLabels"
              :key="day"
              class="col text-center text-caption text-grey-5"
            >
              {{ day }}
            </div>
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="calendar-grid q-px-sm q-pb-md">
          <div class="row">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              style="width: 14.28%; padding: 2px"
            >
              <div
                v-if="day.day !== null"
                class="calendar-day-cell"
                :class="getDayClass(day.amount)"
              >
                <div class="day-number">{{ day.day }}</div>
                <div class="day-amount">{{ formatDayAmount(day.amount) }}</div>
              </div>
              <div v-else class="calendar-day-empty"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Summary -->
    <div class="q-mx-md q-mb-md">
      <div class="budget-card">
        <div class="q-pa-md">
          <div class="text-h6 text-white q-mb-md">Budget</div>
          <div class="text-caption text-grey-5 q-mb-xs">LEFT TO SPEND</div>
          <div class="text-h4 text-white text-weight-bold q-mb-md">$127</div>
          <q-linear-progress
            :value="0.85"
            color="purple-5"
            track-color="grey-8"
            size="8px"
            rounded
          />

          <div class="text-subtitle2 text-grey-4 q-mt-lg q-mb-sm">POPULAR CATEGORIES</div>
          <div class="row q-col-gutter-md justify-center q-mt-md">
            <div class="col-auto" v-for="category in popularCategories" :key="category.name">
              <div class="category-circle" :style="{ background: category.color }">
                <q-icon :name="category.icon" size="32px" color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Transactions -->
    <div class="q-mx-md q-mb-md">
      <div class="upcoming-card">
        <div class="q-pa-md">
          <div class="text-h6 text-white q-mb-md">Upcoming transactions</div>

          <!-- Transaction list with timeline -->
          <div class="transactions-list">
            <div
              v-for="(transaction, index) in upcomingTransactions"
              :key="transaction.id"
              class="transaction-item"
            >
              <!-- Timeline connector -->
              <div v-if="index < upcomingTransactions.length - 1" class="timeline-connector"></div>

              <div class="row items-center q-mb-md">
                <!-- Days badge -->
                <div class="days-badge">
                  {{ transaction.daysUntil }} DAYS
                </div>

                <!-- Service icon -->
                <div class="service-icon q-ml-md">
                  <img
                    v-if="transaction.icon"
                    :src="transaction.icon"
                    :alt="transaction.name"
                    width="40"
                    height="40"
                  />
                  <q-avatar v-else size="40px" :color="transaction.color || 'grey-7'">
                    <q-icon :name="transaction.iconName || 'payment'" color="white" size="24px" />
                  </q-avatar>
                </div>

                <!-- Service name -->
                <div class="service-name text-white text-body1 q-ml-md flex-1">
                  {{ transaction.name }}
                </div>

                <!-- Amount -->
                <div class="transaction-amount text-white text-h6 text-weight-bold">
                  ${{ transaction.amount }}
                </div>
              </div>
            </div>
          </div>

          <!-- See all button -->
          <q-btn
            label="See all upcoming transactions"
            flat
            no-caps
            class="full-width see-all-btn q-mt-md"
            color="white"
          />
        </div>
      </div>
    </div>

    <!-- Demo Mode Toggle -->
    <div class="q-mx-md q-mb-md">
      <div class="demo-card">
        <div class="row items-center justify-between q-pa-md">
          <div class="row items-center">
            <q-icon name="science" size="sm" class="q-mr-sm" />
            <span class="text-body2">Demo mode enabled</span>
          </div>
          <q-btn label="Disable" flat dense no-caps color="white" @click="toggleDemoMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { currencyFormat } from 'src/js/utils'
import { useBudgetsStore } from 'src/stores/budgets'

const budgetsStore = useBudgetsStore()

const activeBudgetId = computed({
  get: () => budgetsStore.activeBudgetId,
  set: (value) => budgetsStore.setActiveBudget(value),
})

const budgetOptions = computed(() => {
  return budgetsStore.budgets.map((b) => ({
    label: b.name,
    value: b.id,
  }))
})

const totalBalance = computed(() => budgetsStore.totalBalance)

const currentMonth = ref('January 2026')

// Day labels for calendar
const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// Calendar days with spending data (matching screenshot)
// January 1, 2026 is a Thursday, so we need 4 empty days before it (Sun, Mon, Tue, Wed)
const calendarDays = ref([
  { day: null, amount: 0 }, // Sunday (empty)
  { day: null, amount: 0 }, // Monday (empty)
  { day: null, amount: 0 }, // Tuesday (empty)
  { day: null, amount: 0 }, // Wednesday (empty)
  { day: 1, amount: -210 }, // Thursday - Jan 1
  { day: 2, amount: -141 }, // Friday - Jan 2
  { day: 3, amount: 0 }, // Saturday - Jan 3
  { day: 4, amount: -98 }, // Sunday - Jan 4
  { day: 5, amount: -365 }, // Monday - Jan 5
  { day: 6, amount: -47 }, // Tuesday - Jan 6
  { day: 7, amount: 0 }, // Wednesday - Jan 7
  { day: 8, amount: 0 }, // Thursday - Jan 8
  { day: 9, amount: 0 }, // Friday - Jan 9
  { day: 10, amount: 0 }, // Saturday - Jan 10
  { day: 11, amount: -81 }, // Sunday - Jan 11
  { day: 12, amount: -52 }, // Monday - Jan 12
  { day: 13, amount: 0 }, // Tuesday - Jan 13
  { day: 14, amount: 0 }, // Wednesday - Jan 14
  { day: 15, amount: -28 }, // Thursday - Jan 15
  { day: 16, amount: 2300 }, // Friday - Jan 16
  { day: 17, amount: -517 }, // Saturday - Jan 17
  { day: 18, amount: 0 }, // Sunday - Jan 18
  { day: 19, amount: 0 }, // Monday - Jan 19
  { day: 20, amount: -297 }, // Tuesday - Jan 20
  { day: 21, amount: -44 }, // Wednesday - Jan 21
  { day: 22, amount: 0 }, // Thursday - Jan 22
  { day: 23, amount: -597 }, // Friday - Jan 23
  { day: 24, amount: -157 }, // Saturday - Jan 24
  { day: 25, amount: -32 }, // Sunday - Jan 25
  { day: 26, amount: -1800 }, // Monday - Jan 26
  { day: 27, amount: 0 }, // Tuesday - Jan 27
  { day: 28, amount: 0 }, // Wednesday - Jan 28
  { day: 29, amount: 0 }, // Thursday - Jan 29
  { day: 30, amount: 0 }, // Friday - Jan 30
  { day: 31, amount: 0 }, // Saturday - Jan 31
])

// Popular categories
const popularCategories = ref([
  {
    name: 'Entertainment',
    icon: 'play_circle',
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  },
  {
    name: 'Parking',
    icon: 'local_parking',
    color: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  },
  { name: 'Food', icon: 'restaurant', color: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' },
])

// Upcoming transactions
const upcomingTransactions = ref([
  {
    id: 'upcoming1',
    name: 'HelloFresh',
    amount: 36,
    daysUntil: 9,
    iconName: 'restaurant',
    color: 'green-6',
  },
  {
    id: 'upcoming2',
    name: 'Disney Plus',
    amount: 12,
    daysUntil: 11,
    iconName: 'play_circle',
    color: 'blue-9',
  },
  {
    id: 'upcoming3',
    name: 'Hulu',
    amount: 15,
    daysUntil: 15,
    iconName: 'play_circle',
    color: 'green-7',
  },
])

// Helper function to get day class based on amount
const getDayClass = (amount) => {
  if (amount === 0) return 'day-zero'
  if (amount > 1000) return 'day-high-positive'
  if (amount > 0) return 'day-positive'
  if (amount < -500) return 'day-high-negative'
  if (amount < -100) return 'day-medium-negative'
  return 'day-low-negative'
}

// Helper function to format day amounts
const formatDayAmount = (amount) => {
  if (amount === 0) return '$0'
  if (Math.abs(amount) >= 1000) {
    return `$${(Math.abs(amount) / 1000).toFixed(1)}K`
  }
  return `$${Math.abs(amount)}`
}

// Chart data
const chartData = ref([2100, 2300, 2000, 2400, 2200, 2800, 3100, 2900, 3400, 3800, 4200, 4466])

// Normalized chart points for SVG viewBox
const chartPointsNormalized = computed(() => {
  const points = chartData.value
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min
  const padding = 5

  return points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * (100 - 2 * padding) + padding
      const y = 100 - (((value - min) / range) * (100 - 2 * padding) + padding)
      return `${x},${y}`
    })
    .join(' ')
})

const chartPointsArrayNormalized = computed(() => {
  const points = chartData.value
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min
  const padding = 5

  return points.map((value, index) => {
    const x = (index / (points.length - 1)) * (100 - 2 * padding) + padding
    const y = 100 - (((value - min) / range) * (100 - 2 * padding) + padding)
    return { x, y }
  })
})

const chartAreaPath = computed(() => {
  const points = chartData.value
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min
  const padding = 5

  const pathPoints = points.map((value, index) => {
    const x = (index / (points.length - 1)) * (100 - 2 * padding) + padding
    const y = 100 - (((value - min) / range) * (100 - 2 * padding) + padding)
    return { x, y }
  })

  let path = `M ${padding},100 `
  path += `L ${pathPoints[0].x},${pathPoints[0].y} `
  pathPoints.slice(1).forEach((point) => {
    path += `L ${point.x},${point.y} `
  })
  path += `L ${100 - padding},100 Z`

  return path
})

const toggleDemoMode = () => {
  budgetsStore.toggleDemoMode()
}
</script>

<style scoped>
.page-home {
  background: #1a1a1a;
  min-height: 100vh;
  padding-bottom: 70px;
}

.header-section {
  background: #1a1a1a;
}

.budget-select {
  font-size: 14px;
  font-weight: 500;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.balance-content {
  position: relative;
}

.balance-amount {
  font-size: 36px;
  font-weight: bold;
  letter-spacing: -0.5px;
}

.chart-container {
  height: 100px;
  margin: 0 -10px;
}

/* Calendar Styles */
.calendar-card {
  background: #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
}

.calendar-header {
  background: #2a2a2a;
}

.calendar-days-header {
  background: #2a2a2a;
}

.calendar-grid {
  background: #2a2a2a;
}

.calendar-day-cell {
  aspect-ratio: 1;
  border-radius: 12px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.calendar-day-empty {
  aspect-ratio: 1;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.day-amount {
  font-size: 11px;
  font-weight: 600;
}

/* Day color classes */
.day-zero {
  background: #3a3a3a;
  color: #666;
}

.day-high-positive {
  background: #10b981;
  color: white;
}

.day-positive {
  background: #34d399;
  color: white;
}

.day-high-negative {
  background: #8b5cf6;
  color: white;
}

.day-medium-negative {
  background: #a78bfa;
  color: white;
}

.day-low-negative {
  background: #6b7280;
  color: white;
}

/* Budget Card */
.budget-card {
  background: #2a2a2a;
  border-radius: 16px;
}

.category-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Upcoming Transactions */
.upcoming-card {
  background: #2a2a2a;
  border-radius: 16px;
}

.transactions-list {
  position: relative;
}

.transaction-item {
  position: relative;
}

.timeline-connector {
  position: absolute;
  left: 49px;
  top: 50px;
  width: 2px;
  height: 50px;
  background: repeating-linear-gradient(
    to bottom,
    #555 0px,
    #555 4px,
    transparent 4px,
    transparent 8px
  );
  z-index: 0;
}

.days-badge {
  background: #3a3a3a;
  border: 2px solid #555;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  white-space: nowrap;
}

.service-icon {
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon img {
  border-radius: 8px;
}

.service-name {
  font-weight: 500;
}

.transaction-amount {
  font-size: 18px;
}

.see-all-btn {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 12px;
  font-weight: 500;
}

/* Demo Card */
.demo-card {
  background: #2a2a2a;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
}
</style>
