// src/bmiCalculator.ts
export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if ([heightCm, weightKg].some(v => typeof v !== 'number' || Number.isNaN(v))) {
    throw new Error('Height and weight must be valid numbers');
  }
  if (heightCm <= 0) throw new Error('Height must be > 0');

  const h = heightCm / 100;
  const bmi = weightKg / (h * h);

  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal (healthy weight)';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// CLI
if (require.main === module) {
  try {
    const [heightStr, weightStr] = process.argv.slice(2);
    if (!heightStr || !weightStr) {
      throw new Error('Usage: npm run calculateBmi <heightCm> <weightKg>');
    }
    const height = Number(heightStr);
    const weight = Number(weightStr);
    console.log(calculateBmi(height, weight));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('Error:', msg);
    process.exit(1);
  }
}
