/**
 * Dashboard JavaScript - Star Parking Ltd.
 * Handles chart initialization, animations, and interactive features
 */

// Dashboard data
const dashboardData = {
    earnings: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [800, 1100, 900, 1220, 1400, 1200]
    },
    trips: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [5, 15, 8, 12, 9, 6, 4]
    },
    engagement: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        data: [800, 850, 720, 780, 820, 600, 950, 850, 900, 200]
    }
};

// Chart configurations
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3B82F6',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
                title: function(context) {
                    return context[0].label;
                },
                label: function(context) {
                    const value = context.parsed.y;
                    if (context.chart.canvas.id === 'earningsChart') {
                        return `£${value.toFixed(2)}`;
                    }
                    if (context.chart.canvas.id === 'tripChart') {
                        return `${value} trips`;
                    }
                    return `${value} users`;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#6B7280',
                font: {
                    size: 12
                }
            }
        },
        y: {
            grid: {
                color: '#F3F4F6',
                borderDash: [2, 2]
            },
            ticks: {
                color: '#6B7280',
                font: {
                    size: 12
                }
            }
        }
    }
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeProgressBars();
    addAnimations();
});

// Initialize all charts
function initializeCharts() {
    initializeEarningsChart();
    initializeTripChart();
    initializeEngagementChart();
}

// Earnings Summary Chart (Area Chart)
function initializeEarningsChart() {
    const ctx = document.getElementById('earningsChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.earnings.labels,
            datasets: [{
                data: dashboardData.earnings.data,
                borderColor: '#3B82F6',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#3B82F6',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        ...chartDefaults.plugins.tooltip.callbacks,
                        afterLabel: function(context) {
                            if (context.parsed.y === 1220) {
                                return 'Peak earnings this period';
                            }
                            return '';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Trip Overview Chart (Bar Chart)
function initializeTripChart() {
    const ctx = document.getElementById('tripChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.trips.labels,
            datasets: [{
                data: dashboardData.trips.data,
                backgroundColor: '#3B82F6',
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 32
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    beginAtZero: true,
                    max: 20,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        stepSize: 5,
                        callback: function(value) {
                            return value + ' Trip';
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    });
}

// User Engagement Chart (Line Chart)
function initializeEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.engagement.labels,
            datasets: [{
                data: dashboardData.engagement.data,
                borderColor: '#3B82F6',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    beginAtZero: true,
                    max: 1000,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        stepSize: 250
                    }
                }
            },
            animation: {
                duration: 1800,
                easing: 'easeInOutCubic'
            }
        }
    });
}

// Initialize progress bars with animations
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.dashboard-progress-fill');
    
    progressBars.forEach(bar => {
        const progress = parseInt(bar.getAttribute('data-progress'));
        
        // Delay the animation slightly for better visual effect
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });
}

// Add entrance animations to dashboard elements
function addAnimations() {
    const animatedElements = [
        { selector: '.dashboard-stat-card', delay: 100 },
        { selector: '.dashboard-chart-card', delay: 200 },
        { selector: '.dashboard-metric-card', delay: 300 },
        { selector: '.dashboard-passengers-card', delay: 400 }
    ];

    animatedElements.forEach(({ selector, delay }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('dashboard-fade-in');
            }, delay + (index * 100));
        });
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    }).format(amount);
}

// Utility function to format numbers with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-GB').format(num);
}

// Handle dropdown changes (can be extended for real functionality)
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('dashboard-filter-dropdown') || 
        e.target.classList.contains('dashboard-period-dropdown')) {
        // Add loading state
        e.target.style.opacity = '0.6';
        
        // Simulate API call delay
        setTimeout(() => {
            e.target.style.opacity = '1';
            // Here you would typically refresh the data/charts
        }, 500);
    }
});

// Handle export button click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('dashboard-export-btn') || 
        e.target.closest('.dashboard-export-btn')) {
        e.preventDefault();
        
        // Add loading state
        const btn = e.target.closest('.dashboard-export-btn') || e.target;
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        btn.disabled = true;
        
        // Simulate export process
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Exported!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        }, 2000);
    }
});

// Add hover effects for passenger cards
document.addEventListener('DOMContentLoaded', function() {
    const passengerCards = document.querySelectorAll('.dashboard-passenger-item');
    
    passengerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// Responsive chart resize handler
window.addEventListener('resize', function() {
    // Charts will automatically resize due to responsive: true option
    // This can be extended for custom responsive behavior
});

// Export functions for potential external use
window.DashboardJS = {
    formatCurrency,
    formatNumber,
    refreshCharts: function() {
        // Function to refresh all charts with new data
        initializeCharts();
    }
};