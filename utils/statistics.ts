export interface DataPoint {
  x: number;
  y: number;
  id: number;
}

export interface StatisticsResult {
  n: number;
  meanX: number;
  meanY: number;
  sampleCovariance: number;
  populationCovariance: number;
  data: DataPoint[];
}

export const parseInputData = (inputX: string, inputY: string): { data: DataPoint[]; error: string | null } => {
  const cleanX = inputX.split(/[\s,]+/).filter(val => val.trim() !== '').map(Number);
  const cleanY = inputY.split(/[\s,]+/).filter(val => val.trim() !== '').map(Number);

  if (cleanX.length === 0 || cleanY.length === 0) {
    return { data: [], error: 'Please enter data for both X and Y variables.' };
  }

  if (cleanX.some(isNaN) || cleanY.some(isNaN)) {
    return { data: [], error: 'Inputs must contain only numbers separated by spaces or commas.' };
  }

  if (cleanX.length !== cleanY.length) {
    return { data: [], error: `Data length mismatch: X has ${cleanX.length} points, Y has ${cleanY.length} points.` };
  }

  const data: DataPoint[] = cleanX.map((x, i) => ({
    x,
    y: cleanY[i],
    id: i,
  }));

  return { data, error: null };
};

export const calculateStatistics = (data: DataPoint[]): StatisticsResult => {
  const n = data.length;
  if (n === 0) {
    return { n: 0, meanX: 0, meanY: 0, sampleCovariance: 0, populationCovariance: 0, data };
  }

  const sumX = data.reduce((acc, p) => acc + p.x, 0);
  const sumY = data.reduce((acc, p) => acc + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let sumProductDiff = 0;
  for (const point of data) {
    sumProductDiff += (point.x - meanX) * (point.y - meanY);
  }

  const populationCovariance = sumProductDiff / n;
  const sampleCovariance = n > 1 ? sumProductDiff / (n - 1) : 0;

  return {
    n,
    meanX,
    meanY,
    sampleCovariance,
    populationCovariance,
    data,
  };
};