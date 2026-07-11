import type { SelectOption } from '~/types'

export const departmentOptions: SelectOption[] = [
  { value: 'all', label: '全部' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'HR', label: 'HR' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Finance', label: 'Finance' },
]

export const statusOptions: SelectOption[] = [
  { value: 0, label: '全部' },
  { value: -1, label: 'On Leave' },
  { value: 1, label: 'Active' },
  { value: 2, label: 'Terminated' },
]