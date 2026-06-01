export const RISK_COLORS = {
  high: '#e63946',
  medium: '#f4a261',
  low: '#2a9d8f',
};

export const getRiskColor = (score) => {
  if (score >= 80) return RISK_COLORS.low;
  if (score >= 50) return RISK_COLORS.medium;
  return RISK_COLORS.high;
};