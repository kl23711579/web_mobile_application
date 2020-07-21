import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';

function StockChart(props) {
  const { labels, stockdata } = props;

  const chartRef = React.createRef()
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {

    if(!chartInstance) {
      const myChartRef = chartRef.current.getContext("2d");

      const myChart = new Chart(myChartRef, {
        type: "line",
        data: {
          //Bring in data
          labels: labels,
          datasets: [
            {
              label: "Closing Price",
              data: stockdata,
              fill: false,
              pointRadius: 0,
              lineTension: 0,
              borderWidth: 2,
              borderColor: '#0e36e8',
              backgroundColor: '#0e36e8',
            }
          ]
        },
        options: {
          // maintainAspectRatio: false,
          // responsive: false
          title: {
            display: true,
            text: 'Closing Price',
            fontSize: 20,
            fontColor: 'black'
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Day'
              },
              ticks: {
                maxTicksLimit: 15,
                labelOffset: 0,
                maxRotation: 50,
                minRotation: 0,
                padding: 10
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Closing price ($)'
              },
              ticks: {
                stepSize: 10
              }
            }]
          },
          tooltips: {
            intersect: false,
            mode: 'index',
          }
        }
      });

      setChartInstance(myChart);
    } else {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = stockdata;
      if(stockdata.length === 1) {
        chartInstance.data.datasets[0].pointRadius = 2;
      } else {
        chartInstance.data.datasets[0].pointRadius = 0;
      }
      chartInstance.update();
    }
  }, [stockdata, labels]);

  return (
    <div className="wrapper">
      <canvas
        id="myChart"
        ref={chartRef}
      />
    </div>
  );
}

export default StockChart;