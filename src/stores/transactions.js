import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCategoriesStore } from './categories'

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref([
    {
      id: 'trans1',
      name: 'Salary',
      amount: 4999.99,
      categoryId: null,
      date: new Date('2026-01-01'),
      type: 'income',
    },
    {
      id: 'trans2',
      name: 'Rent',
      amount: -999.99,
      categoryId: 'cat5',
      date: new Date('2026-01-05'),
      type: 'expense',
    },
    {
      id: 'trans3',
      name: 'Groceries',
      amount: -251.53,
      categoryId: 'cat2',
      date: new Date('2026-01-08'),
      type: 'expense',
    },
    {
      id: 'trans4',
      name: 'Movie tickets',
      amount: -45.00,
      categoryId: 'cat3',
      date: new Date('2026-01-09'),
      type: 'expense',
    },
  ])

  // Getters
  const balance = computed(() => {
    return transactions.value.reduce((acc, trans) => acc + trans.amount, 0)
  })

  const expenseTransactions = computed(() => {
    return transactions.value.filter((t) => t.type === 'expense')
  })

  const incomeTransactions = computed(() => {
    return transactions.value.filter((t) => t.type === 'income')
  })

  const totalExpenses = computed(() => {
    return expenseTransactions.value.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  })

  const totalIncome = computed(() => {
    return incomeTransactions.value.reduce((sum, t) => sum + t.amount, 0)
  })

  const transactionsByCategory = computed(() => {
    return (categoryId) => {
      return transactions.value.filter((t) => t.categoryId === categoryId)
    }
  })

  const expensesByCategory = computed(() => {
    const categoriesStore = useCategoriesStore()
    const expenses = {}
    
    categoriesStore.categories.forEach((category) => {
      const categoryTransactions = transactions.value.filter(
        (t) => t.categoryId === category.id && t.type === 'expense'
      )
      const total = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      expenses[category.id] = {
        category,
        total,
        transactions: categoryTransactions,
      }
    })
    
    return expenses
  })

  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) => b.date - a.date)
  })

  // Actions
  const addTransaction = (transaction) => {
    transactions.value.push({
      ...transaction,
      date: transaction.date || new Date(),
      type: transaction.amount >= 0 ? 'income' : 'expense',
    })
  }

  const updateTransaction = (transactionId, updates) => {
    const index = transactions.value.findIndex((t) => t.id === transactionId)
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...updates,
        type: updates.amount !== undefined 
          ? (updates.amount >= 0 ? 'income' : 'expense')
          : transactions.value[index].type
      }
    }
  }

  const deleteTransaction = (transactionId) => {
    const index = transactions.value.findIndex((t) => t.id === transactionId)
    if (index !== -1) {
      transactions.value.splice(index, 1)
    }
  }

  const resetTransactions = () => {
    transactions.value = []
  }

  return {
    // State
    transactions,
    // Getters
    balance,
    expenseTransactions,
    incomeTransactions,
    totalExpenses,
    totalIncome,
    transactionsByCategory,
    expensesByCategory,
    sortedTransactions,
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactions,
  }
})
