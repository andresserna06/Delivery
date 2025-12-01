import { Chart, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';

// Registramos elementos necesarios
Chart.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

// Colores y fuentes base
export const colors = {
  gray: ['#f6f9fc','#e9ecef','#dee2e6','#ced4da','#adb5bd','#8898aa','#525f7f','#32325d','#212529'],
  theme: {
    primary: '#5e72e4',
    warning: '#fb6340',
    success: '#2dce89',
    danger: '#f5365c'
  }
};

export const fonts = {
  base: 'Open Sans'
};

// Opciones generales para todos los gráficos
export const globalChartOptions = {
  responsive: false,  // controlaremos tamaño vía height
  animation: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { usePointStyle: true, padding: 16 }
    },
    tooltip: { mode: 'index', intersect: false }
  },
  layout: { padding: 0 },
  font: { family: fonts.base, size: 13, color: colors.gray[700] }
};
