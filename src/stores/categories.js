import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([
    {
      id: 'cat1',
      name: 'Shopping',
      icon: 'shopping_bag',
      color: '#FFA500', // orange
      budgetAmount: 2134,
    },
    {
      id: 'cat2',
      name: 'Food & drinks',
      icon: 'restaurant',
      color: '#4169E1', // blue
      budgetAmount: 891,
    },
    {
      id: 'cat3',
      name: 'Entertainment',
      icon: 'movie',
      color: '#FF1493', // pink
      budgetAmount: 487,
    },
    {
      id: 'cat4',
      name: 'Transportation',
      icon: 'directions_car',
      color: '#9370DB', // purple
      budgetAmount: 344,
    },
    {
      id: 'cat5',
      name: 'Miscellaneous',
      icon: 'more_horiz',
      color: '#808080', // gray
      budgetAmount: 400,
    },
  ])

  // Getters
  const getCategoryById = computed(() => {
    return (categoryId) => {
      return categories.value.find((c) => c.id === categoryId)
    }
  })

  const getCategoryByName = computed(() => {
    return (name) => {
      return categories.value.find((c) => c.name === name)
    }
  })

  const totalBudget = computed(() => {
    return categories.value.reduce((sum, cat) => sum + cat.budgetAmount, 0)
  })

  // Actions
  const addCategory = (category) => {
    categories.value.push(category)
  }

  const updateCategory = (categoryId, updates) => {
    const index = categories.value.findIndex((c) => c.id === categoryId)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  const deleteCategory = (categoryId) => {
    const index = categories.value.findIndex((c) => c.id === categoryId)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }

  return {
    // State
    categories,
    // Getters
    getCategoryById,
    getCategoryByName,
    totalBudget,
    // Actions
    addCategory,
    updateCategory,
    deleteCategory,
  }
})
