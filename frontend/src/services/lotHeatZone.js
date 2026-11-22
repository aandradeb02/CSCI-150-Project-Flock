import { OCCUPANCY_THRESHOLDS } from './lotStatus';

// Heatmap shades, kept distinct from the green/yellow permit colors on the map
const HEAT_COLORS = {
  Low: '#059669', //Emerald
  Moderate: '#fb923c', //Light Orange
  High: '#ef4444' //Red
};

// Determines overall busyness using Django's data.
export function getLotHeatZone(lot) {
  const value = lot?.occupancy_percentage ?? lot?.percentFull;

  if (
    value == null ||
    value === '' ||
    lot?.status === 'UPDATING'
  ) {
    return {
      level: 'Unknown',
      percentage: null,
      color: '#64748b'
    };
  }

  const percentage = Number(value);

  if (!Number.isFinite(percentage) ||
      percentage < 0 || percentage > 100) {
    return {
      level: 'Unknown',
      percentage: null,
      color: '#64748b'
    };
  }

  const level = percentage >= OCCUPANCY_THRESHOLDS.high
    ? 'High'
    : percentage >= OCCUPANCY_THRESHOLDS.moderate
      ? 'Moderate'
      : 'Low';

  return {
    level,
    percentage,
    color: HEAT_COLORS[level]
  };
}

// Processes every parking lot using the same data.
export function generateLotHeatZones(lots) {
  return lots.map(lot => ({
    ...lot,
    heatZone: getLotHeatZone(lot)
  }));
}
