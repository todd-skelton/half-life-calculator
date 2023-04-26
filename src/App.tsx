import { CssBaseline, Stack, TextField, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DataPoint = {
  time: number;
  quantity: number;
}

function calculateHalfLifeFactor(halfLife: number): number {
  return Math.pow(0.5, 1 / halfLife);
}

function calculateQuantity(previousQuantity: number, additionalDose: number, halfLifeFactor: number): number {
  return previousQuantity * halfLifeFactor + additionalDose;
}

function calculateAdditionalDose(doseInterval: number, initialDose: number, doseIncrease: number, doseIncreaseInterval: number, maxDose: number, time: number): number {
  if (time === 0) {
    return initialDose;
  }
  if (time % doseInterval === 0) {
    const doseIncreaseCount = Math.floor(time / doseIncreaseInterval);
    const dose = initialDose + doseIncrease * doseIncreaseCount;
    return Math.min(dose, maxDose);
  }
  return 0;
}

function generateDataPoints(halfLife: number, initialDose: number, doseInterval: number, doseIncrease: number, doseIncreaseInterval: number, maxDose: number, timeSpan: number): DataPoint[] {
  const halfLifeFactor = calculateHalfLifeFactor(halfLife);
  const data: DataPoint[] = [];
  let quantity = 0;
  for (let time = 0; time <= timeSpan; time++) {
    const additionalDose = calculateAdditionalDose(doseInterval, initialDose, doseIncrease, doseIncreaseInterval, maxDose, time);
    quantity = calculateQuantity(quantity, additionalDose, halfLifeFactor);
    data.push({ time, quantity });
  }
  return data;
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Quantity over time',
    },
  },
};

function getborderColor(prefersDarkMode: boolean): string {
  return prefersDarkMode ? 'rgb(255, 255, 255)' : 'rbg(0, 0, 0)';
}

function getBackgroundColor(prefersDarkMode: boolean): string {
  return prefersDarkMode ? 'rgb(255, 255, 255, 0.5)' : 'rbg(0, 0, 0, 0.5)';
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  const [halfLife, setHalfLife] = React.useState('5');
  const [initialDose, setInitialDose] = React.useState('2.5');
  const [doseInterval, setDoseInterval] = React.useState('7');
  const [doseIncreaseInterval, setDoseIncreaseInterval] = React.useState('28');
  const [doseIncrease, setDoseIncrease] = React.useState('2.5');
  const [maxDose, setMaxDose] = React.useState('15');
  const [timeSpan, setTimeSpan] = React.useState('168');
  const dataPoints = generateDataPoints(+halfLife, +initialDose, +doseInterval, +doseIncrease, +doseIncreaseInterval, +maxDose, +timeSpan);

  const data = {
    labels: dataPoints.map((dataPoint) => dataPoint.time),
    datasets: [{
      label: 'Quantity',
      data: dataPoints.map((dataPoint) => dataPoint.quantity),
      borderColor: getborderColor(prefersDarkMode),
      backgroundColor: getBackgroundColor(prefersDarkMode),
    }]
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack spacing={2} margin={2}>
        <Typography variant="h3">Half-life Calculator</Typography>
        <TextField id="half-life" label="Halflife" variant="outlined" value={halfLife} onChange={(e) => setHalfLife(e.target.value)} />
        <TextField id="initial-dose" label="Initial Dose" variant="outlined" value={initialDose} onChange={(e) => setInitialDose(e.target.value)} />
        <TextField id="dose-interval" label="Dose Interval" variant="outlined" value={doseInterval} onChange={(e) => setDoseInterval(e.target.value)} />
        <TextField id="dose-increase" label="Dose Increase" variant="outlined" value={doseIncrease} onChange={(e) => setDoseIncrease(e.target.value)} />
        <TextField id="dose-increase-interval" label="Dose Increase Interval" variant="outlined" value={doseIncreaseInterval} onChange={(e) => setDoseIncreaseInterval(e.target.value)} />
        <TextField id="max-dose" label="Max Dose" variant="outlined" value={maxDose} onChange={(e) => setMaxDose(e.target.value)} />
        <TextField id="time-span" label="Time Span" variant="outlined" value={timeSpan} onChange={(e) => setTimeSpan(e.target.value)} />
        <Line options={options} data={data} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
