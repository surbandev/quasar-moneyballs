import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBudgetsStore = defineStore('budgets', () => {
  // State
  const budgets = ref([
    {
      id: 'budget1',
      name: 'Demo Budget',
      isActive: true,
    },
  ])

  const activeBudgetId = ref('budget1')

  const accounts = ref([
    {
      id: 'account1',
      name: 'Citibank Checking',
      balance: 1422,
      lastUpdate: 'Last synced 1 minute ago',
    },
    {
      id: 'account2',
      name: 'Robinhood Saving',
      balance: 3762,
      lastUpdate: 'Last synced 1 minute ago',
    },
  ])

  const demoMode = ref(true)

  // Getters
  const activeBudget = computed(() => {
    return budgets.value.find((b) => b.id === activeBudgetId.value)
  })

  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.balance, 0)
  })

  // Actions
  const setActiveBudget = (budgetId) => {
    activeBudgetId.value = budgetId
  }

  const addBudget = (budget) => {
    budgets.value.push(budget)
  }

  const toggleDemoMode = () => {
    demoMode.value = !demoMode.value
  }

  const addAccount = (account) => {
    accounts.value.push(account)
  }

  const updateAccount = (accountId, updates) => {
    const index = accounts.value.findIndex((a) => a.id === accountId)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updates }
    }
  }

  const deleteAccount = (accountId) => {
    const index = accounts.value.findIndex((a) => a.id === accountId)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  return {
    // State
    budgets,
    activeBudgetId,
    accounts,
    demoMode,
    // Getters
    activeBudget,
    totalBalance,
    // Actions
    setActiveBudget,
    addBudget,
    toggleDemoMode,
    addAccount,
    updateAccount,
    deleteAccount,
  }
})
