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
    
    // Close action menus when table container scrolls
    const tableContainer = document.querySelector('.payroll-table-container');
    if (tableContainer) {
        tableContainer.addEventListener('scroll', function() {
            document.querySelectorAll('.action-menu').forEach(menu => menu.remove());
        });
    }
    
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
    
    // Handle payment plan dropdowns - Simple and reliable approach
    initializePaymentDropdowns();
    
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

function initializePaymentDropdowns() {
    // Remove any existing event listeners by cloning elements
    const dropdowns = document.querySelectorAll('.payment-plan-dropdown');
    
    dropdowns.forEach(dropdown => {
        // Clone to remove all event listeners
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
    });
    
    // Re-select dropdowns after cloning
    const freshDropdowns = document.querySelectorAll('.payment-plan-dropdown');
    
    freshDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns first
            closeAllDropdowns(this);
            
            // Toggle this dropdown
            const isActive = this.classList.contains('active');
            
            if (!isActive) {
                this.classList.add('active');
                createDropdownMenu(this);
            }
        });
    });
    
    // Global click handler to close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.payment-plan-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns(except = null) {
    const dropdowns = document.querySelectorAll('.payment-plan-dropdown');
    dropdowns.forEach(dropdown => {
        if (dropdown !== except) {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.payment-plan-menu');
            if (menu) {
                menu.remove();
            }
        }
    });
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

function createDropdownMenu(dropdown) {
    // Remove any existing menu first
    const existingMenu = dropdown.querySelector('.payment-plan-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'payment-plan-menu';
    
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
        optionElement.className = 'dropdown-option';
        
        optionElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Update the dropdown text
            const spanElement = dropdown.querySelector('span');
            if (spanElement) {
                spanElement.textContent = option;
            }
            
            // Close dropdown
            dropdown.classList.remove('active');
            menu.remove();
            
            console.log(`Payment plan changed to: ${option}`);
            
            // Re-initialize dropdowns to ensure they keep working
            setTimeout(() => {
                initializePaymentDropdowns();
            }, 50);
        });
        
        menu.appendChild(optionElement);
    });
    
    dropdown.appendChild(menu);
}

function showActionMenu(button, rowData) {
    // Remove any existing menus
    document.querySelectorAll('.action-menu').forEach(menu => menu.remove());
    
    // Get button position for fixed positioning
    const buttonRect = button.getBoundingClientRect();
    
    // Create action menu
    const menu = document.createElement('div');
    menu.className = 'action-menu';
    menu.style.cssText = `
        position: fixed;
        top: ${buttonRect.bottom + 4}px;
        right: ${window.innerWidth - buttonRect.right}px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
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
    
    // Append to body for fixed positioning
    document.body.appendChild(menu);
    
    // Adjust position if menu goes off screen
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
        menu.style.right = '10px';
    }
    if (menuRect.bottom > window.innerHeight) {
        menu.style.top = `${buttonRect.top - menuRect.height - 4}px`;
    }
    
    // Close menu when clicking outside or on window resize
    setTimeout(() => {
        function closeMenu(e) {
            if (!button.contains(e.target) && !menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
                window.removeEventListener('resize', closeMenuOnResize);
            }
        }
        
        function closeMenuOnResize() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
            window.removeEventListener('resize', closeMenuOnResize);
        }
        
        document.addEventListener('click', closeMenu);
        window.addEventListener('resize', closeMenuOnResize);
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