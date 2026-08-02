// UI Controller module
const UI = {
    elements: {},
    startTime: null,

    init() {
        this.elements = {
            statusDot: document.querySelector('.status-dot'),
            connectionStatus: document.getElementById('connectionStatus'),
            driveCard: document.getElementById('driveCard'),
            driveName: document.getElementById('driveName'),
            driveStatus: document.getElementById('driveStatus'),
            disconnectBtn: document.getElementById('disconnectDriveBtn'),
            selectDriveBtn: document.getElementById('selectDriveBtn'),
            dropzone: document.getElementById('dropzone'),
            fileInput: document.getElementById('fileInput'),
            fileCard: document.getElementById('fileCard'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            clearFileBtn: document.getElementById('clearFileBtn'),
            flashBtn: document.getElementById('flashBtn'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressPercent: document.getElementById('progressPercent'),
            progressStats: document.getElementById('progressStats'),
            clearLogBtn: document.getElementById('clearLogBtn'),
            copyLogBtn: document.getElementById('copyLogBtn'),
            downloadLogBtn: document.getElementById('downloadLogBtn'),
            guideBtn: document.getElementById('guideBtn'),
            guideModal: document.getElementById('guideModal'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            presetList: document.getElementById('presetList'),
            clearPresetBtn: document.getElementById('clearPresetBtn')
        };

        this.renderFirmwareList();
    },

    renderFirmwareList() {
        const presetList = this.elements.presetList;
        if (!presetList) return;

        const firmwares = FileHandler.getFirmwareList(true);
        presetList.innerHTML = '';

        firmwares.forEach(fw => {
            const tagsHtml = fw.tags.map(tag => `<span class="badge">${tag}</span>`).join('');
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.dataset.firmware = fw.id;
            item.innerHTML = `
                <div class="preset-icon"><i class="${fw.icon}"></i></div>
                <div class="preset-info">
                    <div class="preset-name">${fw.name}</div>
                    <div class="preset-desc">${fw.description}</div>
                    <div class="preset-meta">
                        <span class="badge badge-version">${fw.version}</span>
                        ${tagsHtml}
                        <span class="badge badge-size">${fw.size}</span>
                    </div>
                </div>
                <div class="preset-action"><i class="fas fa-chevron-right"></i></div>
            `;
            presetList.appendChild(item);
        });
    },

    updateDeviceStatus(connected, driveName = '') {
        const { statusDot, connectionStatus, driveCard, driveName: nameEl, driveStatus, disconnectBtn } = this.elements;

        if (connected) {
            statusDot.classList.add('connected');
            connectionStatus.textContent = 'Đã kết nối';
            driveCard.classList.add('connected');
            nameEl.textContent = driveName;
            driveStatus.textContent = 'Sẵn sàng nạp';
            disconnectBtn.style.display = 'flex';
        } else {
            statusDot.classList.remove('connected');
            connectionStatus.textContent = 'Chưa kết nối';
            driveCard.classList.remove('connected');
            nameEl.textContent = 'Chưa chọn ổ đĩa';
            driveStatus.textContent = 'Vui lòng kết nối Pi Pico';
            disconnectBtn.style.display = 'none';
        }
    },

    updateFileInfo(name, size) {
        this.elements.fileName.textContent = name;
        this.elements.fileSize.textContent = size;
        this.elements.fileCard.style.display = 'flex';
        this.elements.dropzone.style.display = 'none';
        this.clearPresetSelection();
    },

    hideFileInfo() {
        this.elements.fileCard.style.display = 'none';
        this.elements.dropzone.style.display = 'block';
        this.elements.fileInput.value = '';
    },

    selectPresetItem(presetId) {
        this.clearPresetSelection();
        const selectedItem = document.querySelector(`[data-firmware="${presetId}"]`);
        if (selectedItem) selectedItem.classList.add('selected');
        this.hideFileInfo();
        this.showClearPresetButton();
    },

    clearPresetSelection() {
        document.querySelectorAll('.preset-item').forEach(item => item.classList.remove('selected'));
        this.hideClearPresetButton();
    },

    showClearPresetButton() {
        if (this.elements.clearPresetBtn) this.elements.clearPresetBtn.style.display = 'flex';
    },

    hideClearPresetButton() {
        if (this.elements.clearPresetBtn) this.elements.clearPresetBtn.style.display = 'none';
    },

    showPresetLoading(presetId) {
        const item = document.querySelector(`[data-firmware="${presetId}"]`);
        if (item) {
            item.classList.add('loading');
            const icon = item.querySelector('.preset-action i');
            if (icon) icon.className = 'fas fa-spinner fa-spin';
        }
    },

    hidePresetLoading(presetId) {
        const item = document.querySelector(`[data-firmware="${presetId}"]`);
        if (item) {
            item.classList.remove('loading');
            const icon = item.querySelector('.preset-action i');
            if (icon) icon.className = 'fas fa-chevron-right';
        }
    },

    showPresetError(presetId) {
        this.hidePresetLoading(presetId);
        this.clearPresetSelection();
    },

    updateFlashButton(enabled) {
        this.elements.flashBtn.disabled = !enabled;
    },

    setFlashingState(isFlashing) {
        const { flashBtn, selectDriveBtn, disconnectBtn, clearPresetBtn } = this.elements;
        flashBtn.disabled = isFlashing;
        selectDriveBtn.disabled = isFlashing;
        disconnectBtn.disabled = isFlashing;
        if (clearPresetBtn) clearPresetBtn.disabled = isFlashing;

        if (isFlashing) {
            this.showProgress();
            this.startTime = Date.now();
        } else {
            this.startTime = null;
        }
    },

    showProgress() {
        this.elements.progressContainer.style.display = 'block';
        this.updateProgress(0, 0, 0);
    },

    updateProgress(percent, loaded, total) {
        this.elements.progressFill.style.width = `${percent}%`;
        this.elements.progressPercent.textContent = `${Math.round(percent)}%`;

        if (loaded && total) {
            const speed = this.calculateSpeed(loaded);
            const eta = this.calculateETA(loaded, total);
            this.elements.progressStats.textContent = `${Utils.formatBytes(loaded)} / ${Utils.formatBytes(total)} • ${speed} • Còn ${eta}`;
        } else {
            this.elements.progressStats.textContent = 'Đang chuẩn bị...';
        }
    },

    hideProgress() {
        this.elements.progressContainer.style.display = 'none';
    },

    calculateSpeed(bytes) {
        if (!this.startTime) return '0 B/s';
        const elapsed = (Date.now() - this.startTime) / 1000;
        if (elapsed === 0) return '0 B/s';
        return `${Utils.formatBytes(bytes / elapsed)}/s`;
    },

    calculateETA(loaded, total) {
        if (!this.startTime || loaded === 0) return '--';
        const elapsed = (Date.now() - this.startTime) / 1000;
        const speed = loaded / elapsed;
        if (speed === 0) return '--';
        return Utils.formatDuration((total - loaded) / speed);
    },

    setupFirmwareTabs() {
        const tabs = document.querySelectorAll('.firmware-tab');
        const contents = document.querySelectorAll('.firmware-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(c => c.classList.remove('active'));
                const targetContent = document.getElementById(`${tabId}-tab`);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    },

    setupPresetSelection() {
        const presetList = this.elements.presetList;
        if (!presetList) return;

        presetList.addEventListener('click', (e) => {
            const item = e.target.closest('.preset-item');
            if (!item) return;

            const firmwareId = item.dataset.firmware;
            if (item.classList.contains('selected')) {
                FileHandler.clearPreset();
            } else {
                FileHandler.selectPreset(firmwareId);
            }
        });

        if (this.elements.clearPresetBtn) {
            this.elements.clearPresetBtn.addEventListener('click', () => FileHandler.clearPreset());
        }
    },

    setupEventListeners() {
        const { selectDriveBtn, disconnectBtn, dropzone, fileInput, clearFileBtn, flashBtn, 
                clearLogBtn, copyLogBtn, downloadLogBtn, guideBtn, guideModal, closeModalBtn } = this.elements;

        selectDriveBtn.addEventListener('click', () => FileHandler.selectDrive());
        disconnectBtn.addEventListener('click', () => FileHandler.clearDrive());
        flashBtn.addEventListener('click', () => FlashManager.startFlash());
        clearFileBtn.addEventListener('click', () => FileHandler.clearFile());

        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) FileHandler.selectFile(e.target.files[0]);
        });

        // Event Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(event => dropzone.addEventListener(event, () => dropzone.classList.add('drag-over')));
        ['dragleave', 'drop'].forEach(event => dropzone.addEventListener(event, () => dropzone.classList.remove('drag-over')));

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) {
                FileHandler.selectFile(e.dataTransfer.files[0]);
            }
        });

        clearLogBtn.addEventListener('click', () => App.clearLog());
        copyLogBtn.addEventListener('click', () => App.copyLog());
        downloadLogBtn.addEventListener('click', () => App.downloadLog());

        guideBtn.addEventListener('click', () => guideModal.classList.add('active'));
        closeModalBtn.addEventListener('click', () => guideModal.classList.remove('active'));
        guideModal.addEventListener('click', (e) => {
            if (e.target === guideModal) guideModal.classList.remove('active');
        });

        this.setupFirmwareTabs();
        this.setupPresetSelection();
        this.hideClearPresetButton();
    }
};