import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();
const PORT = 3003;

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const { height, weight } = req.query;

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (
    height === undefined ||
    weight === undefined ||
    Number.isNaN(heightNum) ||
    Number.isNaN(weightNum)
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const bmi = calculateBmi(heightNum, weightNum);
    return res.json({ height: heightNum, weight: weightNum, bmi });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'malformatted parameters';
    return res.status(400).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
