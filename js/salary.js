// Payroll Dashboard JavaScript - Exact Design Match
class PayrollDashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeCharts();
        this.initializeEventListeners();
    }
    
    // Initialize all charts
    initializeCharts() {
        this.drawMonthlyTrendChart();
        this.drawDistributionChart();
    }
    
    // Draw monthly trend line chart
    drawMonthlyTrendChart() {
        const canvas = document.getElementById('monthlyTrendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Sample data for 6 months (Oct, Nov, Dec, Jan, Feb, Mar)
        const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        const data = [250000, 260000, 340360, 300000, 280000, 269700];
        
        // Chart dimensions
        const padding = 60;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Calculate points
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        
        const points = data.map((value, index) => ({
            x: padding + (index / (data.length - 1)) * chartWidth,
            y: padding + chartHeight - ((value - minValue) / range) * chartHeight
        }));
        
        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i / 5) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        for (let i = 0; i < months.length; i++) {
            const x = padding + (i / (months.length - 1)) * chartWidth;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Draw the main line
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#4f46e5';
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw month labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        months.forEach((month, index) => {
            const x = padding + (index / (months.length - 1)) * chartWidth;
            ctx.fillText(month, x, height - 20);
        });
        
        // Add hover tooltip for December (highest point)
        const decIndex = 2; // December is at index 2
        const decPoint = points[decIndex];
        
        // Tooltip background
        ctx.fillStyle = '#111827';
        ctx.fillRect(decPoint.x - 40, decPoint.y - 40, 80, 30);
        
        // Tooltip text
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('$340,360', decPoint.x, decPoint.y - 30);
        ctx.fillText('+2.4% from previous month', decPoint.x, decPoint.y - 18);
    }
    
    // Draw department distribution bar chart
    drawDistributionChart() {
        const canvas = document.getElementById('distributionChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Sample data for departments
        const departments = ['IT', 'Drivers', 'Finance', 'Operations', 'HR', 'Others'];
        const values = [45000, 75000, 60000, 50000, 35000, 30000];
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        const barWidth = chartWidth / departments.length * 0.7;
        const barSpacing = chartWidth / departments.length;
        
        const maxValue = Math.max(...values);
        
        // Draw bars
        values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = height - padding - barHeight;
            
            // Bar
            ctx.fillStyle = '#4f46e5';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Department label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Poppins';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + barWidth / 2, height - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(departments[index], 0, 0);
            ctx.restore();
        });
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Month selector
        const monthSelector = document.getElementById('monthSelector');
        if (monthSelector) {
            monthSelector.addEventListener('change', (e) => {
                console.log('Month changed to:', e.target.value);
            });
        }
        
        // Trend period selector
        const trendPeriod = document.getElementById('trendPeriod');
        if (trendPeriod) {
            trendPeriod.addEventListener('change', (e) => {
                console.log('Trend period changed to:', e.target.value);
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('employeeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTable(e.target.value);
            });
        }
        
        // Department filter
        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                this.filterByDepartment(e.target.value);
            });
        }
        
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }
        
        // Action buttons
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        const addPayrollBtn = document.querySelector('.add-payroll-btn');
        if (addPayrollBtn) {
            addPayrollBtn.addEventListener('click', () => {
                this.showAddPayrollModal();
            });
        }
        
        // Manage and more buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('manage-btn')) {
                this.manageEmployee(e.target);
            }
            
            if (e.target.classList.contains('more-btn') || e.target.parentElement.classList.contains('more-btn')) {
                this.showMoreOptions(e.target);
            }
        });
    }
    
    // Filter table by search term
    filterTable(searchTerm) {
        const rows = document.querySelectorAll('.payroll-table tbody tr');
        
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const department = row.cells[1].textContent.toLowerCase();
            
            if (name.includes(searchTerm.toLowerCase()) || department.includes(searchTerm.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Filter by department
    filterByDepartment(department) {
        const rows = document.querySelectorAll('.payroll-table tbody tr');
        
        rows.forEach(row => {
            const rowDepartment = row.cells[1].textContent.toLowerCase();
            
            if (department === '' || rowDepartment.includes(department.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Filter by status
    filterByStatus(status) {
        const rows = document.querySelectorAll('.payroll-table tbody tr');
        
        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            const rowStatus = statusBadge ? statusBadge.textContent.toLowerCase() : '';
            
            if (status === '' || rowStatus.includes(status.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Export data functionality
    exportData() {
        const table = document.querySelector('.payroll-table');
        let csvContent = '';
        
        // Get headers
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        csvContent += headers.join(',') + '\n';
        
        // Get visible rows
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        
        rows.forEach(row => {
            const cells = Array.from(row.cells).map(cell => {
                let content = cell.textContent.trim();
                content = content.replace(/\s+/g, ' ');
                return content;
            });
            csvContent += cells.join(',') + '\n';
        });
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // Show add payroll modal
    showAddPayrollModal() {
        const modal = this.createModal('Add New Payroll Entry', this.getAddPayrollForm());
        document.body.appendChild(modal);
        
        modal.querySelector('input').focus();
    }
    
    // Manage employee
    manageEmployee(button) {
        const row = button.closest('tr');
        const name = row.cells[0].textContent.trim();
        
        const modal = this.createModal(`Manage ${name}`, this.getManageEmployeeForm(row));
        document.body.appendChild(modal);
    }
    
    // Show more options menu
    showMoreOptions(button) {
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 0.5rem;
            z-index: 1000;
            min-width: 120px;
        `;
        
        menu.innerHTML = `
            <div style="padding: 0.5rem; cursor: pointer; border-radius: 4px; font-family: 'Poppins', sans-serif; font-size: 14px;" onclick="this.parentElement.remove()">View Details</div>
            <div style="padding: 0.5rem; cursor: pointer; border-radius: 4px; font-family: 'Poppins', sans-serif; font-size: 14px;" onclick="this.parentElement.remove()">Edit</div>
            <div style="padding: 0.5rem; cursor: pointer; border-radius: 4px; font-family: 'Poppins', sans-serif; font-size: 14px; color: #ef4444;" onclick="this.parentElement.remove()">Delete</div>
        `;
        
        const rect = button.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY) + 'px';
        menu.style.left = (rect.left + window.scrollX - 80) + 'px';
        
        document.body.appendChild(menu);
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
    
    // Create modal
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h3 style="margin-bottom: 1.5rem; color: #111827; font-size: 1.25rem; font-weight: 600; font-family: 'Poppins', sans-serif;">${title}</h3>
                ${content}
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        return modal;
    }
    
    // Get add payroll form
    getAddPayrollForm() {
        return `
            <form onsubmit="event.preventDefault(); this.closest('[style*=\"position: fixed\"]').remove();">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Employee Name</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Department</label>
                    <select required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                        <option value="">Select Department</option>
                        <option value="drivers">Drivers</option>
                        <option value="finance">Finance</option>
                        <option value="operations">Operations</option>
                        <option value="hr">HR</option>
                        <option value="others">Others</option>
                    </select>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Base Salary</label>
                    <input type="number" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Bonuses</label>
                    <input type="number" value="0" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button type="button" onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="padding: 0.75rem 1.5rem; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Poppins', sans-serif;">Cancel</button>
                    <button type="submit" style="padding: 0.75rem 1.5rem; border: none; background: #4f46e5; color: white; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Poppins', sans-serif;">Add Employee</button>
                </div>
            </form>
        `;
    }
    
    // Get manage employee form
    getManageEmployeeForm(row) {
        const name = row.cells[0].textContent.trim();
        const department = row.cells[1].textContent.trim();
        const status = row.querySelector('.status-badge')?.textContent.trim() || 'Paid';
        
        return `
            <form onsubmit="event.preventDefault(); this.closest('[style*=\"position: fixed\"]').remove();">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Status</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                        <option value="paid" ${status.toLowerCase() === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="pending" ${status.toLowerCase() === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${status.toLowerCase() === 'processing' ? 'selected' : ''}>Processing</option>
                    </select>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-family: 'Poppins', sans-serif;">Department</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">
                        <option value="drivers" ${department.toLowerCase() === 'drivers' ? 'selected' : ''}>Drivers</option>
                        <option value="finance" ${department.toLowerCase() === 'finance' ? 'selected' : ''}>Finance</option>
                        <option value="operations" ${department.toLowerCase() === 'operations' ? 'selected' : ''}>Operations</option>
                        <option value="hr" ${department.toLowerCase() === 'hr' ? 'selected' : ''}>HR</option>
                        <option value="others" ${department.toLowerCase() === 'others' ? 'selected' : ''}>Others</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button type="button" onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="padding: 0.75rem 1.5rem; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Poppins', sans-serif;">Cancel</button>
                    <button type="submit" style="padding: 0.75rem 1.5rem; border: none; background: #4f46e5; color: white; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Poppins', sans-serif;">Update</button>
                </div>
            </form>
        `;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('salary.html')) {
        window.payrollDashboard = new PayrollDashboard();
    }
});