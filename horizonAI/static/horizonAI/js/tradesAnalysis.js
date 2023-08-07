document.addEventListener('DOMContentLoaded', () => {
  const calculateTradeDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate - startDate;

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor(duration / (1000 * 60));

    if (hours >= 1 && minutes / (hours * 60) > 0) {
      return `${hours} hr(s), ${minutes - (hours * 60)} min`;
    } else if (hours >= 1) {
      return hours + ' hr(s)';
    } else {
      return minutes + ' min';
    }
  }

  const getDayOfTheWeek = (dateString) => {
    const date = new Date(dateString);

    switch (date.getDay()) {
      case 0:
        return 'Sunday';
      
      case 1:
        return 'Monday';
      
      case 2:
        return 'Tuesday';
      
      case 3:
        return 'Wednesday';
      
      case 4:
        return 'Thursday';
      
      case 5:
        return 'Friday';
      
      case 6:
        return 'Saturday';
    }
  }

  const formatDate = (dateString) => {
    // Define the options for formatting the date
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // Define the options for formatting the time
    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };

    // Create a new Date object from the provided dateString
    const date = new Date(dateString);

    // Format the date portion of the date object
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    // Format the time portion of the date object
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    // Return the formatted date and time as a string
    return `${formattedDate} ${formattedTime}`;
  }

  const calculateEquity = (profits) => {
    let sum = 0;
    for (const profit of profits) {
      sum += profit;
    };
    return sum.toFixed(2);
  }

  const calculateROI = (profit, equity_before) => {
    const ans = (profit/equity_before) * 100;
    return ans % 1 === 0 ? ans : ans.toFixed(2);
  }

  const calculateRiskToRewardRatio = (entry, sl, tp) => {
    // If the difference is negative, convert to a positive number
    const difBetweenSLAndEntry = entry - sl < 0 ? Number(-(entry - sl).toFixed(5)) : Number((entry - sl).toFixed(5));
    
    // If the difference is negative, convert to a positive number
    const difBetweenTPAndEntry = entry - tp < 0 ? Number(-(entry - tp).toFixed(5)) : Number((entry - tp).toFixed(5));

    const riskRatio = difBetweenSLAndEntry / difBetweenSLAndEntry;
    const rewardRatio = Math.round(difBetweenTPAndEntry / difBetweenSLAndEntry);

    return { riskRatio, rewardRatio };
  }

  const calculateEquityRisked = (entry, sl, exit, profit, equity_before) => {
    if (profit <= 0) {
      const ans = -(profit / equity_before) * 100;
      return ans % 1 === 0 ? ans : ans.toFixed(2);
    } 

    // If negative, convert to a positive number
    const a = Number((exit - entry).toFixed(5)) < 0 
      ? -(Number((exit - entry).toFixed(5)))
      : Number((exit - entry).toFixed(5));

    // If negative, convert to a positive number
    const b = Number((sl - entry).toFixed(5)) < 0 
      ? -(Number((sl - entry).toFixed(5)))
      : Number((sl - entry).toFixed(5));

    const ans = ((100 * profit * b) / (a * equity_before));

    return ans % 1 === 0 ? ans : ans.toFixed(2);
  }

  const tradeStatistics = (trades) => {
    const equityBefore = [];
    const equityRisked = [];
    const lossDays = [];
    const profit = [];
    const ROI = [];
    const winDays = [];
    
    let tradesWon = 0;

    for (const trade of trades) {
      equityBefore.push(trade.equity_before);
      equityRisked.push(Number(calculateEquityRisked(trade.entry_price, trade.stop_loss, trade.exit_price, trade.profit, trade.equity_before)));
      profit.push(trade.profit);
      ROI.push(Number(calculateROI(trade.profit, trade.equity_before)));

      if (trade.profit > 0) {
        winDays.push(getDayOfTheWeek(trade.entry_datetime));
        tradesWon++;
      } else {
        lossDays.push(getDayOfTheWeek(trade.entry_datetime));
      }
    }

    equityBefore.push(equityBefore[equityBefore.length - 1] + profit[profit.length - 1]);

    const winDaysData = [0, 0, 0, 0, 0, 0, 0];

    for (const day of winDays) {
      switch (day) {
          case 'Sunday':
              winDaysData[0]++;
              break;
          case 'Monday':
              winDaysData[1]++;
              break;
          case 'Tuesday':
              winDaysData[2]++;
              break;
          case 'Wednesday':
              winDaysData[3]++;
              break;
          case 'Thursday':
              winDaysData[4]++;
              break;
          case 'Friday':
              winDaysData[5]++;
              break;
          case 'Saturday':
              winDaysData[6]++;
              break;
      }
    }

    const lossDaysData = [0, 0, 0, 0, 0, 0, 0];

    for (const day of lossDays) {
      switch (day) {
          case 'Sunday':
              lossDaysData[0]++;
              break;
          case 'Monday':
              lossDaysData[1]++;
              break;
          case 'Tuesday':
              lossDaysData[2]++;
              break;
          case 'Wednesday':
              lossDaysData[3]++;
              break;
          case 'Thursday':
              lossDaysData[4]++;
              break;
          case 'Friday':
              lossDaysData[5]++;
              break;
          case 'Saturday':
              lossDaysData[6]++;
              break;
      }
    }

    const winRate = ((tradesWon / trades.length) * 100).toFixed(1);

    const [peakValue, troughValue] = (() => {
      const sorted = equityBefore.toSorted((a, b) => b - a);
      return [sorted[0], sorted[sorted.length - 1]];
    })();

    const indexOfEquity = profit.findLastIndex((val) => val === Math.min(...profit));

    console.log('profit', profit);
    console.log('equityBefore', equityBefore);
    console.log('indexOfEquity', indexOfEquity);

    console.log('peak', peakValue);
    console.log('trough', equityBefore[indexOfEquity + 1]);

    const maximumDrawdown = (((peakValue - equityBefore[indexOfEquity + 1]) / peakValue) * 100).toFixed(1);
    
    const overallProfit = equityBefore[equityBefore.length - 1] - equityBefore[0];
    const overallROI = calculateROI(overallProfit, equityBefore[0]);

    const stats = {
      equity: equityBefore,
      equityRisked,
      daysOfMostLosses: lossDays,
      daysOfMostWins: winDays,
      lossDaysData,
      maximumDrawdown,
      overallProfit,
      overallROI,
      peakValue,
      profit,
      roi: ROI,
      troughValue,
      winDaysData,
      winRate,
    }

    return { stats };
  }

  const renderStats = async () => {
    try {
      const response = await fetch('/trades/all');
      const { trades } = await response.json();
      alert('i work');
      const { stats } = tradeStatistics(trades);
  
      console.log('trades', trades);
      console.log('stats', stats);

    
      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
      
      const profitLabels = trades.map((_, index) => `Trade ${index + 1}`);

      // alert('i work');
      
      const profitData = {
        labels: profitLabels,
        datasets: [
          {
            type: 'bar',
            label: 'Profit',
            backgroundColor: 'rgb(53, 162, 235)',
            data: stats.profit,
          },
        ],
      };
    
      const equityData = {
        labels: profitLabels,
        datasets: [
          {
            type: 'line',
            label: 'Equity',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            data: stats.equity,
          },
        ],
      };
    
      const ROIData = {
        labels: profitLabels,
        datasets: [
          {
            type: 'bar',
            label: 'ROI',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            data: stats.roi,
          },
        ]
      }
    
      const equityRiskedData = {
        labels: profitLabels,
        datasets: [
          {
            type: 'line',
            label: 'Equity Risked',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            data: stats.equityRisked,
          },
        ]
      }
    
      const periodOfMostWins = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
          {
            label: 'Period Of Most Wins (Days of the Week)',
            data: stats.winDaysData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    
      const periodOfMostLosses = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
          {
            label: 'Period Of Most Losses (Days of the Week)',
            data: stats.lossDaysData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    
      const profit = stats.equity[stats.equity.length - 1] - stats.equity[0];

      document.querySelector('.equity').innerText = `R${stats.equity[stats.equity.length - 1]}`;

      document.querySelector('.profit').innerText = `R${profit.toFixed(2)}`;

      document.querySelector('.roi').innerText = `${calculateROI(profit, stats.equity[0])}%`;

      document.querySelector('.win-rate').innerText = `${stats.winRate}%`;

      document.querySelector('.maximum-drawdown').innerText = `${stats.maximumDrawdown}%`;

      document.querySelector('.peak-value').innerText = `R${stats.peakValue}`;

      document.querySelector('.trough-value').innerText = `R${stats.troughValue}`;

      new Chart(document.querySelector('#profit-chart'), {
        type: 'bar',
        data: profitData,
        options: options
      });
  
      new Chart(document.querySelector('#roi-chart'), {
        type: 'bar',
        data: ROIData,
        options: options
      });
  
      new Chart(document.querySelector('#equity-chart'), {
        type: 'bar',
        data: equityData,
        options: options
      });
      
      new Chart(document.querySelector('#equity-risked-chart'), {
        type: 'bar',
        data: equityRiskedData,
        options: options
      });
  
      new Chart(document.querySelector('#period-of-most-wins'), {
        type: 'pie',
        data: periodOfMostWins,
        options: options
      });
      
      new Chart(document.querySelector('#period-of-most-losses'), {
        type: 'pie',
        data: periodOfMostLosses,
        options: options
      });

    } catch (error){
      console.error(error);
      alert('There was an error');
      throw new Error("We couldn't fetch all the trades.");
    }
  }

  renderStats();
})