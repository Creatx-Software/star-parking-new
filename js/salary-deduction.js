/**
 * Salary Deduction Page JavaScript
 * Handles payroll table functionality
 */

// Payroll Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to load before initializing payroll functionality
    window.addEventListener('componentsLoaded', function() {
        console.log('Components loaded, initializing payroll section...');
        initializePayrollSection();
    });
    
    // Fallback initialization in case event doesn't fire
    setTimeout(() => {
        if (document.querySelector('.payroll-section')) {
            initializePayrollSection();
        }
    }, 1000);
});

function initializePayrollSection() {
    console.log('Initializing payroll section...');
    
    // Handle select all checkbox
    const selectAllCheckbox = document.querySelector('.select-all');
    const rowCheckboxes = document.querySelectorAll('.row-select');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            console.log('Select all checkbox changed:', this.checked);
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Handle individual row checkboxes
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('.row-select:checked');
            const allChecked = checkedBoxes.length === rowCheckboxes.length;
            const someChecked = checkedBoxes.length > 0;
            
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
            
            console.log(`Row checkbox changed. Checked: ${checkedBoxes.length}/${rowCheckboxes.length}`);
        });
    });
    
    // Handle search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('Search input:', this.value);
            filterPayrollTable(this.value);
        });
    }
    
    // Handle payment plan dropdowns
    const paymentPlanDropdowns = document.querySelectorAll('.payment-plan-dropdown');
    paymentPlanDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Payment plan dropdown clicked');
            
            // Toggle dropdown appearance or show menu
            this.classList.toggle('active');
            
            // You can add dropdown menu logic here
            showPaymentPlanMenu(this);
        });
    });
    
    // Handle action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Action button clicked');
            
            // Get the row data
            const row = this.closest('tr');
            const rowData = getRowData(row);
            
            // Show action menu
            showActionMenu(this, rowData);
        });
    });
    
    // Handle table sorting
    const sortableHeaders = document.querySelectorAll('.payroll-table th i.fa-sort');
    sortableHeaders.forEach(sortIcon => {
        const header = sortIcon.parentElement;
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', function() {
            const columnIndex = Array.from(this.parentElement.children).indexOf(this);
            const columnName = this.textContent.trim().replace(' ', '');
            console.log(`Sorting by column: ${columnName} (index: ${columnIndex})`);
            
            // Implement sorting logic here
            sortTableByColumn(columnIndex, columnName);
        });
    });
    
    console.log('Payroll section initialized successfully');
}

function filterPayrollTable(searchTerm) {
    const tableRows = document.querySelectorAll('.payroll-table tbody tr');
    const searchLower = searchTerm.toLowerCase();
    let visibleRows = 0;
    
    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const isVisible = rowText.includes(searchLower);
        
        row.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleRows++;
    });
    
    console.log(`Filtered payroll table: ${visibleRows}/${tableRows.length} rows visible`);
}

function showPaymentPlanMenu(dropdown) {
    // Remove any existing menus
    document.querySelectorAll('.payment-plan-menu').forEach(menu => menu.remove());
    
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'payment-plan-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        margin-top: 4px;
    `;
    
    const options = [
        '£25 Per Month',
        '£50 Per Month',
        '£75 Per Month',
        '£100 Per Month',
        'One Time Payment'
    ];
    
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option;
        optionElement.style.cssText = `
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: #374151;
            border-bottom: 1px solid #f3f4f6;
        `;
        
        optionElement.addEventListener('click', function() {
            dropdown.querySelector('span').textContent = option;
            menu.remove();
            dropdown.classList.remove('active');
            console.log(`Payment plan changed to: ${option}`);
        });
        
        optionElement.addEventListener('mouseenter', function() {
            this.style.background = '#f9fafb';
        });
        
        optionElement.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
        
        menu.appendChild(optionElement);
    });
    
    // Remove border from last option
    const lastOption = menu.lastElementChild;
    if (lastOption) lastOption.style.borderBottom = 'none';
    
    dropdown.style.position = 'relative';
    dropdown.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!dropdown.contains(e.target)) {
                menu.remove();
                dropdown.classList.remove('active');
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function showActionMenu(button, rowData) {
    // Remove any existing menus
    document.querySelectorAll('.action-menu').forEach(menu => menu.remove());
    
    // Create action menu
    const menu = document.createElement('div');
    menu.className = 'action-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        margin-top: 4px;
        min-width: 150px;
    `;
    
    const actions = [
        { label: 'View Details', icon: 'fas fa-eye', action: () => viewPayrollDetails(rowData) },
        { label: 'Edit', icon: 'fas fa-edit', action: () => editPayrollEntry(rowData) },
        { label: 'Delete', icon: 'fas fa-trash', action: () => deletePayrollEntry(rowData) },
        { label: 'Print', icon: 'fas fa-print', action: () => printPayrollEntry(rowData) }
    ];
    
    actions.forEach(actionItem => {
        const actionElement = document.createElement('div');
        actionElement.innerHTML = `
            <i class="${actionItem.icon}"></i>
            <span>${actionItem.label}</span>
        `;
        actionElement.style.cssText = `
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: #374151;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        actionElement.addEventListener('click', function() {
            actionItem.action();
            menu.remove();
            console.log(`Action executed: ${actionItem.label}`);
        });
        
        actionElement.addEventListener('mouseenter', function() {
            this.style.background = '#f9fafb';
        });
        
        actionElement.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
        
        menu.appendChild(actionElement);
    });
    
    // Remove border from last action
    const lastAction = menu.lastElementChild;
    if (lastAction) lastAction.style.borderBottom = 'none';
    
    button.style.position = 'relative';
    button.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function getRowData(row) {
    const cells = row.querySelectorAll('td');
    return {
        date: cells[1]?.textContent.trim(),
        amount: cells[2]?.textContent.trim(),
        reason: cells[3]?.textContent.trim(),
        status: cells[4]?.textContent.trim(),
        paymentPlan: cells[5]?.textContent.trim()
    };
}

function sortTableByColumn(columnIndex, columnName) {
    const table = document.querySelector('.payroll-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = table.dataset.sortColumn;
    const currentDirection = table.dataset.sortDirection || 'asc';
    const newDirection = (currentSort === columnIndex.toString() && currentDirection === 'asc') ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex]?.textContent.trim() || '';
        const bText = b.cells[columnIndex]?.textContent.trim() || '';
        
        // Handle different data types
        let comparison = 0;
        if (columnName.toLowerCase().includes('amount')) {
            // Sort by numeric value
            const aNum = parseFloat(aText.replace(/[£,]/g, '')) || 0;
            const bNum = parseFloat(bText.replace(/[£,]/g, '')) || 0;
            comparison = aNum - bNum;
        } else if (columnName.toLowerCase().includes('date')) {
            // Sort by date
            const aDate = new Date(aText);
            const bDate = new Date(bText);
            comparison = aDate - bDate;
        } else {
            // Sort alphabetically
            comparison = aText.localeCompare(bText);
        }
        
        return newDirection === 'asc' ? comparison : -comparison;
    });
    
    // Update table
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    table.querySelectorAll('th i.fa-sort').forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    const currentHeader = table.querySelectorAll('th')[columnIndex];
    const sortIcon = currentHeader.querySelector('i');
    if (sortIcon) {
        sortIcon.className = `fas fa-sort-${newDirection === 'asc' ? 'up' : 'down'}`;
    }
    
    // Store sort state
    table.dataset.sortColumn = columnIndex;
    table.dataset.sortDirection = newDirection;
    
    console.log(`Table sorted by ${columnName} (${newDirection})`);
}

// Action functions (placeholders for actual functionality)
function viewPayrollDetails(rowData) {
    alert(`Viewing details for:\nDate: ${rowData.date}\nAmount: ${rowData.amount}\nReason: ${rowData.reason}`);
}

function editPayrollEntry(rowData) {
    alert(`Editing entry for ${rowData.date} - ${rowData.amount}`);
}

function deletePayrollEntry(rowData) {
    if (confirm(`Are you sure you want to delete the entry for ${rowData.date} - ${rowData.amount}?`)) {
        // Find and remove the row
        const allRows = document.querySelectorAll('.payroll-table tbody tr');
        allRows.forEach(row => {
            const currentRowData = getRowData(row);
            if (currentRowData.date === rowData.date && 
                currentRowData.amount === rowData.amount && 
                currentRowData.reason === rowData.reason) {
                row.remove();
                console.log('Payroll entry deleted:', rowData);
            }
        });
    }
}

function printPayrollEntry(rowData) {
    // Create a printable view
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Payroll Entry - ${rowData.date}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .details { margin: 20px 0; }
                .detail-row { margin: 10px 0; }
                .label { font-weight: bold; display: inline-block; width: 120px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Star Parking Ltd.</h1>
                <h2>Salary Deduction Entry</h2>
            </div>
            <div class="details">
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span>${rowData.date}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Amount:</span>
                    <span>${rowData.amount}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Reason:</span>
                    <span>${rowData.reason}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span>${rowData.status}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Payment Plan:</span>
                    <span>${rowData.paymentPlan}</span>
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}