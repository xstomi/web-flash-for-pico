import { PicoFlasher } from './flasher.js';
import { FirmwareParser } from './file-parser.js';
import { UIController } from './ui.js';

const flasher = new PicoFlasher();
const ui = new UIController();

// Đăng ký sự kiện Kết nối
ui.btnConnect.addEventListener('click', async () => {
  try {
    await flasher.connect();
    ui.setConnectState(true);
    ui.updateStatus('Đã kết nối thành công với Pico.');
  } catch (err) {
    ui.updateStatus(err.message, true);
  }
});

// Đăng ký sự kiện Nạp Firmware
ui.btnFlash.addEventListener('click', async () => {
  try {
    const file = ui.fileInput.files[0];
    const firmwareData = await FirmwareParser.parseFile(file);

    ui.updateStatus('Đang nạp firmware...');
    await flasher.flash(firmwareData, (progress) => {
      ui.updateProgress(progress);
    });

    ui.updateStatus('Nạp Firmware hoàn tất!');
  } catch (err) {
    ui.updateStatus(err.message, true);
  }
});