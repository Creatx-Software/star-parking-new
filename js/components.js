/**
 * Star Parking Component System
 * Handles loading and managing reusable components
 */
class ComponentManager {
    constructor() {
        this.loadedComponents = new Map();
        this.currentPage = this.getCurrentPageName();
        this.initializeComponents();
    }

    /**
     * Initialize components with inline HTML to avoid fetch issues
     */
    initializeComponents() {
        // Navbar component HTML
        this.loadedComponents.set('navbar', `
            <nav class="navbar">
                <div class="nav-left">
                    <button class="hamburger-menu" id="hamburgerMenu">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="logo" onclick="window.location.href='${this.getBasePath()}index.html'" style="cursor: pointer;">Star Parking Ltd.</div>
                    <div class="navbar-search-container">
                        <i class="fas fa-search navbar-search-icon"></i>
                        <input type="text" placeholder="Search" class="navbar-search-input">
                    </div>
                </div>
                <div class="nav-right">
                    <a href="${this.getBasePath()}pages/home.html" class="nav-link" data-page="home">Home</a>
                    <a href="${this.getBasePath()}pages/activities.html" class="nav-link" data-page="activities">Activities</a>
                    <a href="${this.getBasePath()}pages/history.html" class="nav-link" data-page="history">History</a>
                    <a href="${this.getBasePath()}pages/payout.html" class="nav-link" data-page="payout">Payout</a>
                    <a href="#" class="nav-link">Contact us</a>
                    <button class="logout-btn-nav" onclick="window.componentManager.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        
                    </button>
                </div>
            </nav>
        `);

        // Sidebar component HTML
        this.loadedComponents.set('sidebar', `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <aside class="sidebar" id="sidebar">
                <!-- Title -->
                <div class="sidebar-title">
                    <h1>Star Parking Ltd.</h1>
                </div>

                <!-- User Details -->
                <div class="sidebar-user">
                    <div class="user-profile">
                        <img src="https://via.placeholder.com/50" alt="User Profile" class="user-avatar">
                        <div class="user-text-block">
                            <div class="user-name">Salman Faris</div>
                            <div class="user-role">Admin</div>
                        </div>
                        <i class="fas fa-chevron-down dropdown-arrow"></i>
                    </div>
                </div>

                <!-- Navigation Menu -->
                <nav class="sidebar-nav">
                    <a href="${this.getBasePath()}index.html" class="sidebar-link" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="${this.getBasePath()}pages/activities.html" class="sidebar-link" data-page="activities">
                        <i class="fas fa-users"></i>
                        <span>Activities</span>
                    </a>
                    <a href="${this.getBasePath()}pages/analysis.html" class="sidebar-link" data-page="analysis">
                        <i class="fas fa-clock"></i>
                        <span>Analysis</span>
                    </a>
                    <a href="${this.getBasePath()}pages/history.html" class="sidebar-link" data-page="history">
                        <i class="fas fa-history"></i>
                        <span>History</span>
                    </a>
                    <a href="${this.getBasePath()}pages/payout.html" class="sidebar-link" data-page="payout">
                        <i class="fas fa-credit-card"></i>
                        <span>Payout</span>
                    </a>
                    <a href="${this.getBasePath()}pages/notification.html" class="sidebar-link" data-page="alerts">
                        <i class="fas fa-bell"></i>
                        <span>Alerts</span>
                    </a>
                    <a href="#" class="sidebar-link" data-page="contact">
                        <i class="fas fa-headset"></i>
                        <span>Contact Us</span>
                    </a>
                    <a href="#" class="sidebar-link" data-page="settings">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </nav>

                <!-- Logout Button -->
                <div class="sidebar-logout">
                    <a href="#" class="logout-link">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </aside>
        `);
    }

    /**
     * Load a component by name
     * @param {string} componentName - Name of the component
     * @param {string} targetSelector - CSS selector where to inject the component
     */
    loadComponent(componentName, targetSelector) {
        try {
            const component = this.loadedComponents.get(componentName);
            if (!component) {
                throw new Error(`Component '${componentName}' not found`);
            }
            
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = component;
                console.log(`Component '${componentName}' loaded successfully`);
            } else {
                console.error(`Target element '${targetSelector}' not found`);
            }
        } catch (error) {
            console.error(`Error loading component '${componentName}':`, error);
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = `<div class="component-error">Failed to load ${componentName}</div>`;
            }
        }
    }

    /**
     * Load multiple components
     * @param {Array} components - Array of {name, target} objects
     */
    loadComponents(components) {
        components.forEach(component => {
            this.loadComponent(component.name, component.target);
        });
        
        // Initialize navigation after components are loaded
        setTimeout(() => {
            this.initializeNavigation();
        }, 100);
    }

    /**
     * Get current page name from URL
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        
        if (fileName === '' || fileName === 'index.html') {
            return 'home';
        }
        
        return fileName.replace('.html', '');
    }

    /**
     * Get the base path for navigation links
     */
    getBasePath() {
        const isInPagesFolder = window.location.pathname.includes('/pages/');
        return isInPagesFolder ? '../' : '';
    }

    /**
     * Initialize navigation and active states
     */
    initializeNavigation() {
        // Set active states for navigation links
        this.setActiveNavigation();
        
        // Initialize sidebar toggle
        this.initializeSidebarToggle();
        
        // Initialize sidebar interactions
        this.initializeSidebarInteractions();
        
        // Initialize search functionality
        this.initializeSearch();
    }

    /**
     * Set active states for navigation based on current page
     */
    setActiveNavigation() {
        // Remove all active classes
        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page links
        document.querySelectorAll(`[data-page="${this.currentPage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    /**
     * Initialize sidebar-specific interactions
     */
    initializeSidebarInteractions() {
        setTimeout(() => {
            // Handle dropdown arrow click
            const dropdownArrow = document.querySelector('.dropdown-arrow');
            if (dropdownArrow) {
                dropdownArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle arrow rotation
                    dropdownArrow.style.transform = 
                        dropdownArrow.style.transform === 'rotate(180deg)' ? 
                        'rotate(0deg)' : 'rotate(180deg)';
                    
                    console.log('User dropdown clicked');
                    // Add dropdown menu functionality here if needed
                });
            }

            // Handle logout click
            const logoutLink = document.querySelector('.logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Show confirmation dialog
                    if (confirm('Are you sure you want to logout?')) {
                        console.log('User logged out');
                        // Add logout functionality here
                        // For demo purposes, redirect to index page
                        window.location.href = this.getBasePath() + 'index.html';
                    }
                });
            }

            // Handle sidebar link active states
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Remove active class from all sidebar links
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Close sidebar on mobile after clicking a link
                    if (window.innerWidth <= 768) {
                        const sidebar = document.getElementById('sidebar');
                        const overlay = document.getElementById('sidebarOverlay');
                        if (sidebar && overlay) {
                            this.closeSidebar(sidebar, overlay);
                        }
                    }
                });
            });
        }, 250);
    }

    /**
     * Initialize sidebar toggle functionality
     */
    initializeSidebarToggle() {
        // Use a small delay to ensure elements are rendered
        setTimeout(() => {
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const closeBtn = document.getElementById('closeBtn');

            console.log('Initializing sidebar toggle...', {
                hamburgerMenu: !!hamburgerMenu,
                sidebar: !!sidebar,
                sidebarOverlay: !!sidebarOverlay
            });

            if (hamburgerMenu && sidebar && sidebarOverlay) {
                // Remove any existing listeners
                hamburgerMenu.replaceWith(hamburgerMenu.cloneNode(true));
                const newHamburgerMenu = document.getElementById('hamburgerMenu');
                
                newHamburgerMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Hamburger menu clicked!');
                    
                    const isOpen = sidebar.classList.contains('open');
                    
                    if (isOpen) {
                        this.closeSidebar(sidebar, sidebarOverlay);
                    } else {
                        this.openSidebar(sidebar, sidebarOverlay);
                    }
                });
                
                console.log('Hamburger menu event listener added');
            } else {
                console.error('Required elements not found:', {
                    hamburgerMenu: !!hamburgerMenu,
                    sidebar: !!sidebar,
                    sidebarOverlay: !!sidebarOverlay
                });
            }

            if (closeBtn && sidebar && sidebarOverlay) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeSidebar(sidebar, sidebarOverlay);
                });
            }

            // Close sidebar when clicking on overlay
            if (sidebarOverlay && sidebar) {
                sidebarOverlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeSidebar(sidebar, sidebarOverlay);
                    console.log('Sidebar closed by clicking overlay');
                });
            }

            // Close sidebar when clicking outside (but not on sidebar itself)
            document.addEventListener('click', (e) => {
                if (sidebar && sidebar.classList.contains('open')) {
                    if (!sidebar.contains(e.target) && 
                        !document.getElementById('hamburgerMenu')?.contains(e.target)) {
                        this.closeSidebar(sidebar, sidebarOverlay);
                        console.log('Sidebar closed by clicking outside');
                    }
                }
            });

            // Add keyboard support (ESC key to close sidebar)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
                    this.closeSidebar(sidebar, sidebarOverlay);
                    console.log('Sidebar closed via ESC key');
                }
            });
        }, 200);
    }

    /**
     * Open the sidebar with overlay effect
     */
    openSidebar(sidebar, overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Sidebar opened');
    }

    /**
     * Close the sidebar and remove overlay
     */
    closeSidebar(sidebar, overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
        console.log('Sidebar closed');
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        const searchInput = document.querySelector('.navbar-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                console.log('Search query:', query);
                // Implement search functionality here
            });
        }
    }

    /**
     * Handle logout functionality
     */
    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            console.log('User logged out from navbar');
            // Add logout functionality here
            // For demo purposes, redirect to index page
            window.location.href = this.getBasePath() + 'index.html';
        }
    }

    /**
     * Show loading state
     */
    showLoading(targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    /**
     * Utility method to update page title
     */
    updatePageTitle(title) {
        document.title = `${title} - Star Parking Ltd.`;
    }
}

// Global instance
window.componentManager = new ComponentManager();

// Auto-load common components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing components...');
    
    const commonComponents = [
        { name: 'navbar', target: '#navbar-container' },
        { name: 'sidebar', target: '#sidebar-container' }
    ];
    
    window.componentManager.loadComponents(commonComponents);
    
    // Trigger custom event to notify page-specific scripts
    setTimeout(() => {
        console.log('Components loaded, dispatching event...');
        window.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { success: true, components: commonComponents }
        }));
    }, 300);
});