/* eslint-disable */

// Class definition
export const projectOverview = (function () {
  // Private functions
  const initChart = function () {
    // init chart
    const element = document.getElementById('project_overview_chart');

    if (!element) {
      return;
    }

    const data = [
      element.dataset.inprogress,
      element.dataset.completed,
      element.dataset.created,
      element.dataset.overdue,
    ];

    const config = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: ['#00A3FF', '#50CD89', '#E4E6EF', '#F8285A'],
          },
        ],
        labels: ['In Progress', 'Completed', 'Created', 'Overdue'],
      },
      options: {
        chart: {
          fontFamily: 'inherit',
        },
        cutoutPercentage: 75,
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        title: {
          display: false,
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: '#20D489',
          titleFontColor: '#ffffff',
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    const ctx = element.getContext('2d');
    const myDoughnut = new Chart(ctx, config);
  };

  // Public methods
  return {
    init: function () {
      initChart();
    },
  };
})();
