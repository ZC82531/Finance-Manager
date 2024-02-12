import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../utils/seperator';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

const BG_COLORS = [
  'rgba(239,68,68,0.8)',
  'rgba(59,130,246,0.8)',
  'rgba(234,179,8,0.8)',
  'rgba(20,184,166,0.8)',
  'rgba(168,85,247,0.8)',
  'rgba(249,115,22,0.8)',
  'rgba(107,114,128,0.8)',
];

const BORDER_COLORS = [
  'rgba(239,68,68,1)',
  'rgba(59,130,246,1)',
  'rgba(234,179,8,1)',
  'rgba(20,184,166,1)',
  'rgba(168,85,247,1)',
  'rgba(249,115,22,1)',
  'rgba(107,114,128,1)',
];

export function Chartss({ exdata }) {
  const totals = sortCategoryWise(exdata, CATEGORIES);

  const data = {
    labels: CATEGORIES,
    datasets: [
      {
        label: 'USD',
        data: totals,
        backgroundColor: BG_COLORS,
        borderColor: BORDER_COLORS,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#d1d5db',
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 13, family: 'Montserrat' },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `  $${ctx.parsed.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '320px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}


