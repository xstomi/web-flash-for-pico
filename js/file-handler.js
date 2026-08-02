// File handling module
const FileHandler = {
    selectedFile: null,
    selectedDrive: null,
    selectedPreset: null,
    firmwareCatalog: [], // Sẽ được tải từ tệp JSON

    /**
     * Tải danh mục firmware từ tệp JSON bên ngoài
     */
    async loadCatalog() {
        try {
            const response = await fetch('firmware/firmware.json');
            if (!response.ok) {
                throw new Error(`Không thể tải firmware.json (HTTP ${response.status})`);
            }
            const data = await response.json();
            
            // Chuẩn hóa đường dẫn URL: Chuyển tất cả '\' thành '/'
            this.firmwareCatalog = data.map(fw => ({
                ...fw,
                url: fw.url.replace(/\\/g, '/')
            }));

            App.addLog(`Đã tải danh mục firmware (${this.firmwareCatalog.length} tệp)`, 'info');
            return true;
        } catch (error) {
            App.addLog(`Lỗi nạp danh mục firmware: ${error.message}`, 'error');
            this.firmwareCatalog = [];
            return false;
        }
    },

    getFirmwareList(featuredOnly = false) {
        return featuredOnly 
            ? this.firmwareCatalog.filter(fw => fw.featured)
            : this.firmwareCatalog;
    },

    getFirmwareById(id) {
        return this.firmwareCatalog.find(fw => fw.id === id);
    },

    async selectPreset(presetId) {
        const preset = this.getFirmwareById(presetId);
        if (!preset) return false;

        try {
            App.addLog(`Đang tải: ${preset.name} ${preset.version}`, 'info');
            UI.showPresetLoading(presetId);

            const response = await fetch(preset.url);
            if (!response.ok) throw new Error(`Không thể tải tệp firmware (HTTP ${response.status})`);

            const blob = await response.blob();
            const file = new File([blob], `${presetId}.uf2`, { type: 'application/octet-stream' });

            if (!Utils.validateFileSize(file)) {
                throw new Error('Dung lượng tệp vượt quá giới hạn (10MB)');
            }

            this.clearCustomFileState();
            this.selectedFile = file;
            this.selectedPreset = presetId;

            UI.selectPresetItem(presetId);
            UI.updateFlashButton(this.selectedDrive !== null);

            App.addLog(`Đã chọn ${preset.name} ${preset.version} (${Utils.formatBytes(file.size)})`, 'success');
            return true;
        } catch (error) {
            App.addLog(`Lỗi tải preset ${preset.name}: ${error.message}`, 'error');
            UI.showPresetError(presetId);
            return false;
        } finally {
            UI.hidePresetLoading(presetId);
        }
    },

    clearPreset() {
        this.selectedFile = null;
        this.selectedPreset = null;
        UI.clearPresetSelection();
        UI.updateFlashButton(false);
        App.addLog('Đã bỏ chọn firmware', 'warning');
    },

    async selectDrive() {
        if (!window.showDirectoryPicker) {
            App.addLog('Trình duyệt không hỗ trợ File System Access API', 'error');
            return false;
        }

        try {
            const dirHandle = await window.showDirectoryPicker();

            let isPico = false;
            try {
                await dirHandle.getFileHandle('INFO_UF2.TXT');
                isPico = true;
            } catch (e) {
                isPico = false;
            }

            if (isPico) {
                this.selectedDrive = dirHandle;
                UI.updateDeviceStatus(true, dirHandle.name);
                UI.updateFlashButton(this.selectedFile !== null);
                App.addLog(`Đã kết nối Pi Pico (${dirHandle.name})`, 'success');
                return true;
            } else {
                App.addLog(`Thư mục "${dirHandle.name}" không phải Bootloader Pi Pico`, 'warning');
                return false;
            }
        } catch (e) {
            if (e.name !== 'AbortError') {
                App.addLog(`Lỗi truy cập ổ đĩa: ${e.message}`, 'error');
            }
            return false;
        }
    },

    clearDrive() {
        this.selectedDrive = null;
        UI.updateDeviceStatus(false);
        UI.updateFlashButton(false);
        App.addLog('Đã ngắt kết nối ổ đĩa', 'warning');
    },

    async selectFile(file) {
        if (!Utils.isUf2File(file.name)) {
            App.addLog(`Tệp "${file.name}" không đúng định dạng .uf2`, 'error');
            return false;
        }

        if (!Utils.validateFileSize(file)) {
            App.addLog(`Tệp "${file.name}" vượt quá kích thước 10MB`, 'error');
            return false;
        }

        if (this.selectedPreset) {
            UI.clearPresetSelection();
            this.selectedPreset = null;
        }

        this.selectedFile = file;
        UI.updateFileInfo(file.name, Utils.formatBytes(file.size));
        UI.updateFlashButton(this.selectedDrive !== null);

        App.addLog(`Đã chọn tệp: ${file.name} (${Utils.formatBytes(file.size)})`, 'success');
        return true;
    },

    clearFile() {
        this.selectedFile = null;
        UI.hideFileInfo();
        UI.updateFlashButton(false);
        App.addLog('Đã bỏ chọn tệp', 'warning');
    },

    clearCustomFileState() {
        UI.hideFileInfo();
    },

    getSelectedDrive() { return this.selectedDrive; },
    getSelectedFile() { return this.selectedFile; }
};