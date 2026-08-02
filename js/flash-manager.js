// Flash management module
const FlashManager = {
    isFlashing: false,

    async startFlash() {
        const drive = FileHandler.getSelectedDrive();
        const file = FileHandler.getSelectedFile();

        if (!drive) {
            App.addLog('Chưa kết nối Raspberry Pi Pico', 'error');
            return;
        }

        if (!file) {
            App.addLog('Chưa chọn tệp firmware (.uf2)', 'error');
            return;
        }

        if (this.isFlashing) {
            App.addLog('⏳ Tiến trình flash đang chạy, vui lòng chờ...', 'warning');
            return;
        }

        this.isFlashing = true;
        UI.setFlashingState(true);
        let writable = null;

        try {
            App.addLog(`🚀 Bắt đầu quá trình nạp: ${file.name}`, 'info');

            // 1. Đọc tệp dữ liệu vào bộ nhớ
            UI.updateProgress(5, 0, file.size);
            const fileData = await file.arrayBuffer();
            App.addLog(`Đã nạp vào bộ nhớ tạm: ${Utils.formatBytes(fileData.byteLength)}`, 'success');

            // 2. Mở file stream trên Raspberry Pi Pico
            UI.updateProgress(15, 0, file.size);
            const picoFile = await drive.getFileHandle('firmware.uf2', { create: true });
            writable = await picoFile.createWritable();

            // 3. Ghi dữ liệu theo Chunk lớn (64KB per chunk) để tăng tốc độ truyền
            const chunkSize = 65536; 
            let offset = 0;
            const totalBytes = fileData.byteLength;

            while (offset < totalBytes) {
                const chunk = fileData.slice(offset, Math.min(offset + chunkSize, totalBytes));
                await writable.write(chunk);
                offset += chunk.byteLength;

                const percent = 15 + Math.floor((offset / totalBytes) * 85);
                UI.updateProgress(percent, offset, totalBytes);
            }

            // 4. Đóng file stream chính xác
            await writable.close();
            writable = null; 

            UI.updateProgress(100, totalBytes, totalBytes);
            App.addLog(`NẠP FIRMWARE THÀNH CÔNG!`, 'success');
            App.addLog(`Pi Pico sẽ tự động khởi động lại`, 'success');

            await Utils.delay(1500);

        } catch (error) {
            App.addLog(`Quá trình nạp thất bại: ${error.message}`, 'error');
            // Nếu có lỗi, đảm bảo giải phóng Stream ngay lập tức
            if (writable) {
                try {
                    await writable.abort();
                } catch (e) { /* ignore abort error */ }
            }
        } finally {
            this.isFlashing = false;
            UI.hideProgress();
            UI.setFlashingState(false);
            UI.updateFlashButton(FileHandler.getSelectedDrive() !== null && FileHandler.getSelectedFile() !== null);
        }
    }
};