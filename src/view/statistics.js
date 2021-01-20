import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeUniquePoints, countMoneyByType, countTypesByType, countDurationByType} from '../utils/statistics';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, points) => {
  const pointsTypes = points.map((point) => point.type);
  const uniquePoints = makeUniquePoints(pointsTypes);
  const moneyByTypes = uniquePoints.map((type) => countMoneyByType(points, type));

  moneyCtx.height = uniquePoints.length * BAR_HEIGHT;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniquePoints,
      datasets: [{
        data: moneyByTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, points) => {
  const pointsTypes = points.map((point) => point.type);
  const uniquesTypes = makeUniquePoints(pointsTypes);
  const countTypes = uniquesTypes.map((type) => countTypesByType(points, type));

  typeCtx.height = uniquesTypes.length * BAR_HEIGHT;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniquesTypes,
      datasets: [{
        data: countTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (timeCtx, events) => {
  const eventsTypes = events.map((event) => event.type);
  const uniqTypes = makeUniquePoints(eventsTypes);
  const durationsByTypes = uniqTypes.map((type) => countDurationByType(events, type));

  timeCtx.height = uniqTypes.length * BAR_HEIGHT;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: durationsByTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}D`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderMoneyChart(moneyCtx, this._points._points);
    this._typeChart = renderTypeChart(typeCtx, this._points._points);
    this._timeChart = renderTimeChart(timeCtx, this._points._points);
  }
}
