export function sum(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0);
}

export function average(values: number[]) {
  return sum(values) / Math.max(values.length, 1);
}

export function calculateBudgetPacing(totalBudget: number, spentBudget: number) {
  return Math.round((spentBudget / Math.max(totalBudget, 1)) * 100);
}

export function calculateUtilization(plannedHours: number, actualHours: number) {
  return Math.round((actualHours / Math.max(plannedHours, 1)) * 100);
}
