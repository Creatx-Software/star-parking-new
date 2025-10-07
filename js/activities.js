// Activities Page JavaScript

// Sample data for different filter categories
const activitiesData = {
    pending: [
        {
            user: { name: "Sierra Ferguson", phone: "(252) 555-0126", avatar: "../assets/Medal .png" },
            carComfort: "simple",
            orderedTime: "04.12.2025 20:30",
            startLocation: "ANDOVER HOUSE, GEORGE YARD",
            finishLocation: "105 LONDON STREET",
            income: "£20.50"
        },
        {
            user: { name: "Sierra Ferguson", phone: "(252) 555-0126", avatar: "../assets/Medal .png" },
            carComfort: "extra",
            orderedTime: "04.12.2025 20:24",
            startLocation: "8 CAMP ROAD, NORTH CAMP, FARNBOROUGH",
            finishLocation: "COMMERCE HOUSE, HIGH ST",
            income: "£34.00"
        },
        {
            user: { name: "Sierra Ferguson", phone: "(252) 555-0126", avatar: "../assets/Medal .png" },
            carComfort: "convenient",
            orderedTime: "04.12.2025 20:23",
            startLocation: "8 CAMP ROAD, NORTH CAMP, FARNBOROUGH",
            finishLocation: "7-9 CLIFFORD STREET",
            income: "£30.50"
        },
        {
            user: { name: "Sierra Ferguson", phone: "+688 (55) 586-88-10", avatar: "../assets/Medal .png" },
            carComfort: "convenient",
            orderedTime: "17.11.2025 12:16",
            startLocation: "CLAYMONT HOUSE, 145-149 KILMARNOCK ROAD",
            finishLocation: "DEVONSHIRE HOUSE, ELDON STREET",
            income: "£20.00"
        },
        {
            user: { name: "Sierra Ferguson", phone: "(406) (55) 586-88-10", avatar: "../assets/Medal .png" },
            carComfort: "convenient",
            orderedTime: "04.12.2025 20:30",
            startLocation: "57 GREAT GEORGE STREET",
            finishLocation: "7-9 CLIFFORD STREET",
            income: "£23.50"
        }
    ],
    "in-progress": [
        {
            user: { name: "John Smith", phone: "(555) 123-4567", avatar: "../assets/Medal .png" },
            carComfort: "extra",
            orderedTime: "04.12.2025 21:15",
            startLocation: "MAIN STREET PLAZA",
            finishLocation: "CENTRAL PARK AVENUE",
            income: "£45.00"
        }
    ],
    completed: [
        {
            user: { name: "Emma Wilson", phone: "(444) 987-6543", avatar: "../assets/Medal .png" },
            carComfort: "simple",
            orderedTime: "03.12.2025 18:30",
            startLocation: "SHOPPING CENTER WEST",
            finishLocation: "RESIDENTIAL AREA NORTH",
            income: "£25.50"
        },
        {
            user: { name: "Michael Brown", phone: "(333) 456-7890", avatar: "../assets/Medal .png" },
            carComfort: "convenient",
            orderedTime: "03.12.2025 16:45",
            startLocation: "BUSINESS DISTRICT",
            finishLocation: "AIRPORT TERMINAL",
            income: "£65.00"
        }
    ],
    upcoming: [],
    "pre-cancelled": [
        {
            user: { name: "Sarah Davis", phone: "(222) 345-6789", avatar: "../assets/Medal .png" },
            carComfort: "simple",
            orderedTime: "05.12.2025 09:00",
            startLocation: "HOTEL GRAND PLAZA",
            finishLocation: "CONFERENCE CENTER",
            income: "£18.00"
        }
    ],
    cancelled: [
        {
            user: { name: "Robert Johnson", phone: "(111) 234-5678", avatar: "../assets/Medal .png" },
            carComfort: "extra",
            orderedTime: "04.12.2025 14:20",
            startLocation: "DOWNTOWN MALL",
            finishLocation: "UNIVERSITY CAMPUS",
            income: "£32.00"
        }
    ]
};

// Current active filter
let currentFilter = 'pending';
let currentPage = 1;
const itemsPerPage = 5;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    loadTableData();
    initializePagination();
});

// Initialize filter functionality
function initializeFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all filters
            filterItems.forEach(filter => filter.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get the filter type
            currentFilter = this.dataset.filter;
            currentPage = 1; // Reset to first page
            
            // Load data for the selected filter
            loadTableData();
            updatePagination();
        });
    });
}

// Load table data based on current filter
function loadTableData() {
    const tbody = document.getElementById('activities-tbody');
    const data = activitiesData[currentFilter] || [];
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    if (pageData.length === 0) {
        // Show empty state
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
                    No activities found for this category
                </td>
            </tr>
        `;
        return;
    }
    
    // Populate table with data
    pageData.forEach(activity => {
        const row = createTableRow(activity);
        tbody.appendChild(row);
    });
    
    // Update pagination info
    updatePaginationInfo();
}

// Create a table row element
function createTableRow(activity) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div class="user-info">
                <div class="avatar">
                    <img src="${activity.user.avatar}" alt="${activity.user.name}">
                </div>
                <div class="user-details">
                    <div class="user-name">${activity.user.name}</div>
                    <div class="user-phone">${activity.user.phone}</div>
                </div>
            </div>
        </td>
        <td>${activity.carComfort}</td>
        <td>${activity.orderedTime}</td>
        <td>${activity.startLocation}</td>
        <td>${activity.finishLocation}</td>
        <td>
            <div class="income-btn">${activity.income}</div>
        </td>
    `;
    
    return row;
}

// Initialize pagination
function initializePagination() {
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    const pageButtons = document.querySelectorAll('.pagination-btn.page-num');
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadTableData();
            updatePagination();
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            currentPage++;
            loadTableData();
            updatePagination();
        }
    });
    
    // Page number buttons
    pageButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const pageNum = index + 1;
            const totalPages = getTotalPages();
            if (pageNum <= totalPages) {
                currentPage = pageNum;
                loadTableData();
                updatePagination();
            }
        });
    });
    
    updatePagination();
}

// Update pagination state
function updatePagination() {
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    const pageButtons = document.querySelectorAll('.pagination-btn.page-num');
    const totalPages = getTotalPages();
    
    // Update previous button
    prevBtn.disabled = currentPage === 1;
    
    // Update next button
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
    
    // Update page buttons
    pageButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        btn.classList.toggle('active', pageNum === currentPage);
        btn.style.display = pageNum <= totalPages ? 'flex' : 'none';
    });
}

// Get total pages for current filter
function getTotalPages() {
    const data = activitiesData[currentFilter] || [];
    return Math.ceil(data.length / itemsPerPage);
}

// Update pagination info text
function updatePaginationInfo() {
    const paginationInfo = document.querySelector('.pagination-info');
    const data = activitiesData[currentFilter] || [];
    const totalItems = data.length;
    
    if (totalItems === 0) {
        paginationInfo.textContent = '0 of 0 items';
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
    
    paginationInfo.textContent = `${startIndex}–${endIndex} of ${totalItems} items`;
}

// Export functionality
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
});

// Export current filter data
function exportData() {
    const data = activitiesData[currentFilter] || [];
    
    if (data.length === 0) {
        alert('No data to export for the current filter.');
        return;
    }
    
    // Create CSV content
    const headers = ['User Name', 'Phone', 'Car Comfort', 'Ordered Time', 'Start Location', 'Finish Location', 'Income'];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            `"${row.user.name}"`,
            `"${row.user.phone}"`,
            `"${row.carComfort}"`,
            `"${row.orderedTime}"`,
            `"${row.startLocation}"`,
            `"${row.finishLocation}"`,
            `"${row.income}"`
        ].join(','))
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activities_${currentFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle responsive table scrolling
function handleResponsiveTable() {
    const tableWrapper = document.querySelector('.table-wrapper');
    const table = document.querySelector('.activities-table');
    
    if (window.innerWidth <= 768) {
        // Add scroll indicator on mobile
        if (table.scrollWidth > tableWrapper.clientWidth) {
            tableWrapper.classList.add('has-scroll');
        } else {
            tableWrapper.classList.remove('has-scroll');
        }
    }
}

// Handle window resize
window.addEventListener('resize', handleResponsiveTable);
window.addEventListener('load', handleResponsiveTable);