import { getRiskColor } from '../../utils/riskUtils';

export default function RiskIndicator({ score }) {
  const color = getRiskColor(score);
  return (
    <div className="risk-indicator" style={{ backgroundColor: color }}>
      Safety: {score}%
    </div>
  );
}