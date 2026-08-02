// Utility functions
const Utils = {
    /**
     * Định dạng dung lượng byte sang B, KB, MB, GB
     * @param {number} bytes 
     * @returns {string}
     */
    formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    },

    /**
     * Định dạng giây sang chuỗi thời gian h m s
     * @param {number} seconds 
     * @returns {string}
     */
    formatDuration(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '--';
        if (seconds < 60) return `${Math.ceil(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    },

    /**
     * Tạo khoảng hoãn async
     * @param {number} ms 
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Kiểm tra extension file .uf2
     * @param {string} filename 
     * @returns {boolean}
     */
    isUf2File(filename) {
        return typeof filename === 'string' && filename.toLowerCase().endsWith('.uf2');
    },

    /**
     * Kiểm tra kích thước file
     * @param {File} file 
     * @param {number} maxSizeMB 
     * @returns {boolean}
     */
    validateFileSize(file, maxSizeMB = 10) {
        return file && file.size <= maxSizeMB * 1024 * 1024;
    }
};