// Shared lot status checks and color helpers for the list, map, and forecast views.

export function isLotUpdating(lot) {
  return !lot || lot.status === 'UPDATING' || lot.percentFull === null || lot.percentFull === undefined;
}

export function isStaffLot(lot) {
  return (lot.permitType || '').toLowerCase() === 'staff';
}

// Occupancy thresholds shared by status bars, forecast bars, and map heat zones
export const OCCUPANCY_THRESHOLDS = {
  high: 80,
  moderate: 60
};

// Occupancy Color Helper
export function getOccupancyColor(pctFull) {
  if (pctFull >= OCCUPANCY_THRESHOLDS.high) return '#ef4444'; //Red
  if (pctFull >= OCCUPANCY_THRESHOLDS.moderate) return '#eab308'; //Yellow
  return '#22c55e'; //Green
}

// Status Bar Color Helper
export function getStatusBarColor(lot) {
  if (isLotUpdating(lot)) {
    return '#64748b'; //Grey
  }
  return getOccupancyColor(lot.percentFull);
}

// Map Polygon Color Helper: Matches Permit Colors
export function getMapPolygonColor(lot) {
  if (isLotUpdating(lot)) {
    return '#64748b';
  }
  return isStaffLot(lot) ? '#eab308' : '#16a34a';
}
