// Main App Module
const App = {
    async init() {
        // 1. Tải danh mục từ JSON trước
        await FileHandler.loadCatalog();

        // 2. Khởi tạo UI và sự kiện
        UI.init();
        UI.setupEventListeners();
        
        // 3. Kiểm tra trình duyệt & kéo thả
        this.checkBrowserSupport();
        this.preventGlobalDragDrop();

        this.addLog('Pico Flasher sẵn sàng', 'success');
        this.addLog('Chọn firmware có sẵn hoặc upload file .uf2', 'info');
    },

    checkBrowserSupport() {
        if (!window.showDirectoryPicker) {
            this.addLog('Trình duyệt không hỗ trợ File System Access API', 'error');
            this.addLog('Vui lòng sử dụng Chrome, Edge hoặc Brave', 'error');
            document.getElementById('selectDriveBtn').disabled = true;
        }
    },

    preventGlobalDragDrop() {
        window.addEventListener('dragover', (e) => e.preventDefault(), false);
        window.addEventListener('drop', (e) => e.preventDefault(), false);
    },

    addLog(message, type = 'info') {
        const logDiv = document.getElementById('consoleLog');
        if (!logDiv) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;

        const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: '📌' };

        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-icon">${icons[type] || '📌'}</span>
            <span class="log-message">${message}</span>
        `;

        logDiv.appendChild(entry);
        entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (logDiv.children.length > 50) {
            logDiv.removeChild(logDiv.firstChild);
        }
    },

    clearLog() {
        const logDiv = document.getElementById('consoleLog');
        if (logDiv) logDiv.innerHTML = '';
        this.addLog('Đã xóa log', 'info');
    },

    async copyLog() {
        const logs = Array.from(document.querySelectorAll('.log-entry'))
            .map(e => `[${e.querySelector('.log-time').textContent}] ${e.querySelector('.log-message').textContent}`)
            .join('\n');

        try {
            await navigator.clipboard.writeText(logs);
            this.addLog('📋 Đã sao chép log vào bộ nhớ tạm', 'success');
        } catch {
            this.addLog('Không thể sao chép log', 'error');
        }
    },

    downloadLog() {
        const logs = Array.from(document.querySelectorAll('.log-entry'))
            .map(e => `[${e.querySelector('.log-time').textContent}] ${e.querySelector('.log-message').textContent}`)
            .join('\n');

        const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url });
        a.download = `pico-flash-${Date.now()}.log`;
        a.click();
        URL.revokeObjectURL(url);

        this.addLog('Đã tải tệp log', 'success');
    }
};

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});