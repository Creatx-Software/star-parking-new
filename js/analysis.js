// Analysis Page Chart Implementation
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('earningsChart');
    
    if (!ctx) return;
    
    // Sample data for the earnings chart - matching the months in the image
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Earnings',
            data: [800, 1200, 900, 1600, 1400, 1800],
            borderColor: '#3b82f6',
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                
                if (!chartArea) {
                    return null;
                }
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
                
                return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#3b82f6',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    external: function(context) {
                        // Custom tooltip implementation
                        const {chart, tooltip} = context;
                        
                        // Create tooltip element
                        let tooltipEl = chart.canvas.parentNode.querySelector('.chartjs-tooltip');
                        
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.className = 'chartjs-tooltip';
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.pointerEvents = 'none';
                            tooltipEl.style.transition = 'all 0.2s ease';
                            chart.canvas.parentNode.appendChild(tooltipEl);
                        }
                        
                        // Hide if no tooltip
                        if (tooltip.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
                        
                        // Set content
                        if (tooltip.body) {
                            const titleLines = tooltip.title || [];
                            const bodyLines = tooltip.body.map(b => b.lines);
                            
                            let innerHtml = '';
                            
                            // Add body
                            bodyLines.forEach((body, i) => {
                                const value = body[0].split(':')[1].trim();
                                innerHtml += `£${value}.00`;
                            });
                            
                            tooltipEl.innerHTML = innerHtml;
                        }
                        
                        // Position tooltip
                        const canvasPosition = Chart.helpers.getRelativePosition(tooltip, chart);
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = canvasPosition.x + 'px';
                        tooltipEl.style.top = (canvasPosition.y - 60) + 'px';
                        tooltipEl.style.transform = 'translateX(-50%)';
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        color: '#9ca3af',
                        padding: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 2000,
                    grid: {
                        color: '#f3f4f6',
                        borderDash: [5, 5]
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        color: '#9ca3af',
                        padding: 15,
                        stepSize: 500,
                        callback: function(value) {
                            return '£' + value;
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
    
    // Add interactive hover effect for the highlighted point (£1220.00)
    setTimeout(() => {
        const chart = Chart.getChart(ctx);
        if (chart) {
            // Simulate hover on the Mar data point to show the £1220.00 tooltip
            chart.setActiveElements([{datasetIndex: 0, index: 2}]);
            chart.update('none');
        }
    }, 1000);
    
    // User Engagement Chart Implementation
    const userEngagementCtx = document.getElementById('userEngagementChart');
    
    if (userEngagementCtx) {
        // Data points based on the image - showing engagement trends
        const engagementData = {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'User Engagement',
                data: [900, 850, 750, 800, 780, 600, 950, 850, 900, 200],
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#3b82f6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,
            }]
        };
        
        const engagementConfig = {
            type: 'line',
            data: engagementData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1f2937',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#374151',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        titleFont: {
                            family: 'Poppins',
                            size: 12,
                            weight: '500'
                        },
                        bodyFont: {
                            family: 'Poppins',
                            size: 12,
                            weight: '400'
                        },
                        callbacks: {
                            title: function() {
                                return '';
                            },
                            label: function(context) {
                                return context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#f3f4f6',
                            borderDash: [2, 2]
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Poppins',
                                size: 11
                            },
                            color: '#9ca3af',
                            padding: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1000,
                        grid: {
                            color: '#f3f4f6',
                            borderDash: [2, 2]
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Poppins',
                                size: 11
                            },
                            color: '#9ca3af',
                            padding: 10,
                            stepSize: 250
                        }
                    }
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        };
        
        // Create the User Engagement chart
        new Chart(userEngagementCtx, engagementConfig);
    }
    
    // Trip Overview Chart Implementation
    const tripOverviewCtx = document.getElementById('tripOverviewChart');
    
    if (tripOverviewCtx) {
        // Data for the bar chart - weekly trip data
        const tripData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Trips',
                data: [5, 18, 12, 15, 10, 8, 4],
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                borderSkipped: false,
            }]
        };
        
        const tripConfig = {
            type: 'bar',
            data: tripData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1f2937',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#374151',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        titleFont: {
                            family: 'Poppins',
                            size: 12,
                            weight: '500'
                        },
                        bodyFont: {
                            family: 'Poppins',
                            size: 12,
                            weight: '400'
                        },
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `${context.parsed.y} Trip${context.parsed.y !== 1 ? 's' : ''}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Poppins',
                                size: 11
                            },
                            color: '#9ca3af',
                            padding: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 20,
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 4
                    }
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        };
        
        // Create the Trip Overview chart
        new Chart(tripOverviewCtx, tripConfig);
    }
});