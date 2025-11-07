// src/exerciseCalculator.ts

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  if (!Array.isArray(dailyHours) || dailyHours.length === 0) {
    throw new Error('dailyHours must be a non-empty array');
  }
  if (typeof target !== 'number' || Number.isNaN(target)) {
    throw new Error('target must be a valid number');
  }
  if (dailyHours.some(h => typeof h !== 'number' || Number.isNaN(h))) {
    throw new Error('dailyHours must contain only numbers');
  }

  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;

  // Arvostelu: 3 = tavoite saavutettu, 2 = vähintään 80% tavoitteesta, 1 = muuten
  const ratio = average / target;
  const rating: 1 | 2 | 3 = ratio >= 1 ? 3 : ratio >= 0.8 ? 2 : 1;
  const ratingDescription =
    rating === 3 ? 'excellent, target reached!' :
    rating === 2 ? 'not too bad but could be better' :
    'you can do better next time';

  return {
    periodLength,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};

// CLI: npm run calculateExercises <target> <h1> <h2> ...
if (require.main === module) {
  try {
    const [targetStr, ...hoursStr] = process.argv.slice(2);
    if (!targetStr || hoursStr.length === 0) {
      throw new Error('Usage: npm run calculateExercises <target> <h1> <h2> ...');
    }
    const target = Number(targetStr);
    const hours = hoursStr.map(Number);
    if (Number.isNaN(target) || hours.some(h => Number.isNaN(h))) {
      throw new Error('All arguments must be numbers');
    }
    const result = calculateExercises(hours, target);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('Error:', msg);
    process.exit(1);
  }
}
