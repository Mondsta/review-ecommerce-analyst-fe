# Project Setup

## Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda memiliki hal-hal berikut:

1. **Node.js** dan **Yarn** telah terinstall di komputer Anda.
2. **File konfigurasi** yang disebut `.env.local` telah dibuat di root direktori project.

---

## Environment Setup

Sebelum memulai atau running menggunakan command yarn dev di terminal visual studio code, buat file **`.env.local`** di direktori utama project dan tambahkan konfigurasi berikut:

```bash
NEXT_PUBLIC_NODE_ENV=development || production
APP_VERSION=$npm_package_version
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000
PORT=8000
```

Wajib untuk melakukan running File Backend Python terlebih dahulu kemudian baru running FrontEnd nya menggunakan command "yarn dev" di terminal visual studio code
