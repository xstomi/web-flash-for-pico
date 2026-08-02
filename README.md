# ⚡ Web Flash For Pico

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)
![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Edge%20%7C%20Brave-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

[Truy Cập](#-truy-cập) • [✨ Tính Năng](#-tính-năng) • [🚀 Cài Đặt](#-cài-đặt) • [📁 Quản Lý Firmware](#-quản-lý-firmware-đã-xây-dựng) • [🤝 Đóng Góp](#-đóng-góp) • [👨 Tác Giả](#-tác-giả)

</div>

---

## 🔌 Truy Cập

🔗 **Link truy cập trực tiếp:** [Click vào đây để mở Web Flash For Pico](https://xstomi.github.io/web-flash-for-pico/)

## 📋 Tổng Quan

**Web Flash For Pico** là một ứng dụng web mã nguồn mở cho phép flash firmware vào Raspberry Pi Pico trực tiếp từ trình duyệt mà **không cần cài đặt bất kỳ phần mềm nào**. Ứng dụng sử dụng **File System Access API** của trình duyệt để tương tác trực tiếp với thiết bị Pico ở chế độ bootloader.

### 🎯 Mục đích

- Đơn giản hóa quy trình flash firmware cho Raspberry Pi Pico
- Không cần cài đặt công cụ dòng lệnh hay phần mềm thứ ba
- Hỗ trợ cả firmware có sẵn và upload file tùy chỉnh
- Giao diện trực quan, thân thiện với người dùng
- Hoạt động hoàn toàn trên trình duyệt, bảo mật và an toàn
- **Quản lý firmware tập trung, dễ dàng mở rộng**

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔌 **Kết nối trực tiếp** | Sử dụng File System Access API để truy cập ổ đĩa RPI-RP2 |
| 📦 **Firmware có sẵn** | Danh sách firmware được quản lý tập trung, sẵn sàng sử dụng |
| 📤 **Upload tùy chỉnh** | Hỗ trợ kéo thả hoặc chọn file .uf2 từ máy tính |
| 🚀 **Flash nhanh** | Flash firmware chỉ với một cú nhấp chuột |
| 📊 **Theo dõi tiến trình** | Hiển thị tiến độ, tốc độ và thời gian còn lại |
| 🖥️ **Console log** | Ghi lại mọi hoạt động để theo dõi và debug |
| 📋 **Export log** | Copy hoặc tải log xuống máy tính |
| 🎨 **Giao diện hiện đại** | Thiết kế tối giản, dễ sử dụng |
| 📱 **Responsive** | Hỗ trợ trên mọi thiết bị |

---

## 📁 Quản Lý Firmware

Trong dự án này, **tất cả firmware được quản lý tập trung** tại một nơi duy nhất: `firmware.json`. Điều này giúp việc quản lý, thêm mới, cập nhật firmware trở nên dễ dàng và có tổ chức.

### Ví dụ

```javascript
[
  {
    "id": "rp2040-zero-blink-ws2812",                         // ID Duy Nhất
    "name": "RP2040 Zero Blink WS2812",                       // Tên
    "icon": "fa-brands fa-battle-net",                        // Icon Font Awesome
    "description": "Khởi tạo LED WS2812 Đổi Màu Liên Tục",    // Mô Tả
    "version": "v1.0.0",                                      // Phiên Bản
    "tags": ["Adafruit NeoPixel", "WS2812 GPIO16"],           // Thẻ
    "size": "141.50KB",                                       // Kích Thước
    "url": "./firmware/rp2040-zero-blink-ws2812.uf2",         // Đường Dẫn
    "featured": true                                          // Hiển Thị
  },
  {
    "id": "rp2040-zero-random-serial",
    "name": "RP2040 Zero Random Serial",
    "icon": "fa-solid fa-rotate-right",
    "description": "Hiển Thị Tỉ Lệ Ngẫu Nhiên Qua Serial",
    "version": "v1.0.0",
    "tags": [],
    "size": "140.50KB",
    "url": "./firmware/rp2040-zero-random-serial.uf2",
    "featured": true
  }
]
```

---

## 🚀 Cài Đặt

### Yêu cầu

- **Trình duyệt**: Chrome 86+, Edge 86+, Brave 86+ (hỗ trợ File System Access API)
- **Thiết bị**: Raspberry Pi Pico (ở chế độ bootloader)

### Cách chạy

```bash
git clone https://github.com/xstomi/web-flash-for-pico.git
```

```bash
cd web-flash-for-pico
```

```bash
python -m http.server 8080
```

## 🤝 Đóng Góp

Tôi rất hoan nghênh mọi đóng góp từ cộng đồng! Dù bạn là developer, designer, hay người dùng, đều có thể đóng góp cho dự án.

## 👨 Tác Giả

**Trần Xuân Sơn**

**Automotive Mechatronics | Automotive Embedded Programming**

Made with ❤️ by the community