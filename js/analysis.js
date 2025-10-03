// analysis.js - Dashboard functionality for Analysis page
// All code is scoped to the analysis dashboard only

// Chart.js initialization for Earnings Summary (Area Chart)
const earningsCtx = document.getElementById('dashboard-earnings-chart');
if (earningsCtx) {
    const earningsChart = new Chart(earningsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Earnings',
                data: [500, 900, 1220, 800, 1500, 1200],
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    return gradient;
                },
                borderColor: '#3B82F6',
                borderWidth: 3,
                pointBackgroundColor: '#3B82F6',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return `£${context.parsed.y.toFixed(2)}`;
                        }
                    }
                },
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: value => `£${value}` }
                }
            }
        }
    });
}

// Chart.js initialization for Trip Overview (Bar Chart)
const tripCtx = document.getElementById('dashboard-trip-chart');
if (tripCtx) {
    const tripChart = new Chart(tripCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Trips',
                data: [15, 7, 12, 18, 13, 14, 5],
                backgroundColor: '#3B82F6',
                borderRadius: 8,
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} Trip`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 5 }
                }
            }
        }
    });
}

// Chart.js initialization for User Engagement (Line Chart)
const engagementCtx = document.getElementById('dashboard-engagement-chart');
if (engagementCtx) {
    const engagementChart = new Chart(engagementCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 10}, (_, i) => i + 1),
            datasets: [{
                label: 'Engagement',
                data: [900, 800, 850, 870, 650, 950, 900, 880, 990, 300],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                pointBackgroundColor: '#3B82F6',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Animated Progress Bars
function animateProgressBar(barId, percent) {
    const bar = document.getElementById(barId);
    if (bar) {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
            bar.style.width = percent + '%';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    animateProgressBar('dashboard-progress-amount', 32);
    animateProgressBar('dashboard-progress-hours', 8);
    animateProgressBar('dashboard-progress-trip', 48);
});

// All code is scoped to dashboard page only
