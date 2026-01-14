// Navigation and Authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not on login page and not logged in, redirect to login
    if (currentPage !== 'index.html' && !isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // If on login page and already logged in, redirect to dashboard
    if (currentPage === 'index.html' && isLoggedIn) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Set active nav link
    setActiveNavLink();
    
    // Initialize page-specific functionality
    if (currentPage === 'dashboard.html') {
        initDashboard();
    } else if (currentPage === 'transactions.html') {
        initTransactions();
    } else if (currentPage === 'settings.html') {
        initSettings();
    } else if (currentPage === 'alerts.html') {
        initAlerts();
    }
});

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('active');
        }
    });
}

// Login functionality
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, use proper authentication)
    if (username && password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        window.location.href = 'dashboard.html';
    } else {
        alert('Please enter both username and password');
    }
}

// Logout functionality
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Dashboard initialization
function initDashboard() {
    // Load dashboard data
    updateDashboardStats();
    loadRecentTransactions();
    
    // Update hopper coins in real-time every 2 seconds
    setInterval(updateHopperCoins, 2000);
}

function updateDashboardStats() {
    // Simulated data - in production, fetch from API
    const stats = {
        totalTransactions: 676,
        totalCoinsDispensed: 6767,
        coinLevels: {
            'P1': 100,
            'P5': 50,
            'P10': 30,
            'P20': 20,
            'P50': 180,
            'P100': 100
        },
        systemStatus: 'ONLINE'
    };
    
    // Update stats display
    document.getElementById('total-transactions').textContent = stats.totalTransactions;
    document.getElementById('total-coins').textContent = stats.totalCoinsDispensed.toLocaleString() + ' Coins';
    
    // Calculate total peso coins in hopper (sum of all coin counts)
    const totalCoinsInHopper = Object.values(stats.coinLevels).reduce((sum, count) => sum + count, 0);
    const hopperCoinsElement = document.getElementById('hopper-coins');
    if (hopperCoinsElement) {
        hopperCoinsElement.textContent = totalCoinsInHopper.toLocaleString() + ' Coins';
    }
    
    // Store coin levels for real-time updates
    const coinLevelsContainer = document.getElementById('coin-levels');
    if (coinLevelsContainer) {
        coinLevelsContainer.setAttribute('data-coin-levels', JSON.stringify(stats.coinLevels));
    }
    
    // Store coin levels in localStorage for alerts page
    localStorage.setItem('coinLevels', JSON.stringify(stats.coinLevels));
}

// Real-time hopper coin count update
function updateHopperCoins() {
    // In production, fetch real-time data from API/device
    // Simulate fetching current hopper coin count from device
    fetchHopperCoinCount().then(totalCoins => {
        const hopperCoinsElement = document.getElementById('hopper-coins');
        if (hopperCoinsElement) {
                    hopperCoinsElement.textContent = totalCoins.toLocaleString() + ' Coins';
        }
    }).catch(error => {
        console.error('Error fetching hopper coin count:', error);
        // Fallback to stored data
        const coinLevelsContainer = document.getElementById('coin-levels');
        if (coinLevelsContainer) {
            const coinLevelsData = coinLevelsContainer.getAttribute('data-coin-levels');
            if (coinLevelsData) {
                const coinLevels = JSON.parse(coinLevelsData);
                const totalCoinsInHopper = Object.values(coinLevels).reduce((sum, count) => sum + count, 0);
                const hopperCoinsElement = document.getElementById('hopper-coins');
                if (hopperCoinsElement) {
                    hopperCoinsElement.textContent = totalCoinsInHopper.toLocaleString() + ' Coins';
                }
                // Update localStorage for alerts page
                localStorage.setItem('coinLevels', coinLevelsData);
            }
        }
    });
}

// Fetch hopper coin count from device/API
function fetchHopperCoinCount() {
    // In production, replace with actual API call to device
    // Example: return fetch('/api/hopper/coins').then(res => res.json()).then(data => data.count);
    
    // Simulate API call with stored coin levels
    return new Promise((resolve) => {
        // Simulate async API call
        setTimeout(() => {
            const coinLevelsContainer = document.getElementById('coin-levels');
            if (coinLevelsContainer) {
                const coinLevelsData = coinLevelsContainer.getAttribute('data-coin-levels');
                if (coinLevelsData) {
                    const coinLevels = JSON.parse(coinLevelsData);
                    const totalCoinsInHopper = Object.values(coinLevels).reduce((sum, count) => sum + count, 0);
                    // Update localStorage for alerts page
                    localStorage.setItem('coinLevels', coinLevelsData);
                    resolve(totalCoinsInHopper);
                } else {
                    resolve(0);
                }
            } else {
                resolve(0);
            }
        }, 100);
    });
}

function loadRecentTransactions() {
    const transactions = [
        { date: '04/15/2024', type: 'Bill Accepted', amount: 'P100', coins: '100 Coins' },
        { date: '04/14/2024', type: 'Bill Accepted', amount: 'P50', coins: '50 Coins' },
        { date: '04/14/2024', type: 'Coin Change', amount: 'P20', coins: '20 Coins' }
    ];
    
    const tbody = document.querySelector('#recent-transactions tbody');
    if (tbody) {
        tbody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.coins}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Transactions page initialization
function initTransactions() {
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', handleFilter);
    }
    
    loadAllTransactions();
}

function loadAllTransactions() {
    const transactions = [
        { date: '04/15/2024', type: 'Bill Accepted', amount: 'P100', coins: '100 Coins' },
        { date: '04/15/2024', type: 'Bill Accepted', amount: 'P50', coins: '50 Coins' },
        { date: '04/15/2024', type: 'Coin Change', amount: 'P20', coins: '20 Coins' },
        { date: '04/15/2024', type: 'Coin Change', amount: 'P10', coins: '10 Coins' },
        { date: '04/16/2024', type: 'Bill Accepted', amount: 'P100', coins: '100 Coins' },
        { date: '04/15/2024', type: 'Coin Change', amount: 'P5', coins: '5 Coins' },
        { date: '04/13/2024', type: 'Bill Accepted', amount: 'P50', coins: '50 Coins' }
    ];
    
    const tbody = document.querySelector('#transactions-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.coins}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

function handleFilter() {
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    
    if (fromDate && toDate) {
        // In production, filter transactions based on date range
        console.log('Filtering transactions from', fromDate, 'to', toDate);
        // Reload transactions with filter applied
        loadAllTransactions();
    } else {
        alert('Please select both from and to dates');
    }
}

// Settings page initialization
function initSettings() {
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveSettings);
    }
    
    loadSettings();
}

function loadSettings() {
    // Load saved settings from localStorage or API
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    if (settings.p1Threshold) {
        document.getElementById('p1-threshold').value = settings.p1Threshold;
    }
    if (settings.smsAlerts !== undefined) {
        document.getElementById('sms-alerts').checked = settings.smsAlerts;
    }
    if (settings.emailAlerts !== undefined) {
        document.getElementById('email-alerts').checked = settings.emailAlerts;
    }
}

function handleSaveSettings() {
    const settings = {
        p1Threshold: document.getElementById('p1-threshold').value,
        smsAlerts: document.getElementById('sms-alerts').checked,
        emailAlerts: document.getElementById('email-alerts').checked
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

// Alerts page initialization
function initAlerts() {
    loadAlerts();
}

function loadAlerts() {
    // Get current P1 coin level from localStorage
    const coinLevelsData = localStorage.getItem('coinLevels');
    let p1CoinLevel = 0;
    if (coinLevelsData) {
        const coinLevels = JSON.parse(coinLevelsData);
        p1CoinLevel = coinLevels['P1'] || 0;
    }
    
    // Get threshold from settings
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const p1Threshold = parseInt(settings.p1Threshold) || 50;
    
    const alerts = [];
    
    // Only show low coin alert if peso coins are below threshold
    if (p1CoinLevel < p1Threshold) {
        alerts.push({
            title: 'Low Coin Level Alert',
            message: `Peso coin level is below threshold (${p1CoinLevel} coins remaining)`,
            time: '2 hours ago',
            type: 'warning'
        });
    }
    
    // Add other system alerts
    alerts.push(
        {
            title: 'System Online',
            message: 'All systems are operating normally',
            time: '5 hours ago',
            type: 'info'
        },
        {
            title: 'Transaction Completed',
            message: 'Successfully accepted P100 bill and dispensed 100 coins',
            time: '1 day ago',
            type: 'info'
        },
        {
            title: 'Security Alert',
            message: 'Multiple failed login attempts detected',
            time: '2 days ago',
            type: 'critical'
        }
    );
    
    const alertsContainer = document.getElementById('alerts-container');
    if (alertsContainer) {
        alertsContainer.innerHTML = '';
        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            alertItem.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                </div>
                <div class="alert-time">${alert.time}</div>
            `;
            alertsContainer.appendChild(alertItem);
        });
    }
}

