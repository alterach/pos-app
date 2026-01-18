# POS App - OpenCode Task List

## ✅ Completed Features
- [x] Dashboard dengan stats cards
- [x] POS page dengan cart & checkout
- [x] Products page (CRUD)
- [x] Customers page
- [x] Reports page dengan charts
- [x] CartContext (state management)
- [x] DataContext (products, customers, transactions)
- [x] LocalStorage persistence
- [x] React Router navigation

---

## 🔴 High Priority

### 1. Settings Page
```
File: src/pages/Settings.jsx + Settings.css
Route: /settings

Features:
- Store name (editable, saved to localStorage)
- Tax percentage (PPN, default 11%)
- Currency format (IDR)
- Theme toggle (light/dark mode)
```

### 2. Print Receipt
```
File: src/components/Receipt.jsx + Receipt.css

Features:
- Modal dengan preview struk
- Tombol print (window.print atau react-to-print)
- Format: nama toko, tanggal, items, subtotal, tax, total
- Trigger setelah confirmPayment di POS.jsx
```

### 3. Stock Tracking
```
File: Update DataContext.jsx + POS.jsx

Features:
- Kurangi stock otomatis setelah checkout
- Validasi stock sebelum add to cart
- Warning "Out of Stock" jika stock = 0
- Low stock indicator (< 5)
```

---

## 🟡 Medium Priority

### 4. Export Reports
```
File: src/pages/Reports.jsx (update)
Library: npm install jspdf html2canvas

Features:
- Export to CSV button
- Export to PDF button
- Date range filter
```

### 5. Search & Filter Enhancement
```
Files: Products.jsx, Customers.jsx

Features:
- Advanced search dengan debounce
- Sort by name/price/stock
- Filter by category
```

### 6. Dashboard Dynamic Data
```
File: Update Dashboard in App.jsx

Features:
- Stats dari DataContext (real transactions)
- Today's revenue
- Active orders count
- Top selling products chart
```

---

## 🟢 Nice to Have

### 7. User Authentication
```
Files: src/context/AuthContext.jsx, src/pages/Login.jsx

Features:
- Simple login (username/password)
- Role-based access (admin/cashier)
- Protect routes
```

### 8. Dark Mode
```
Files: src/styles/variables.css, Settings.jsx

Features:
- CSS variables untuk dark theme
- Toggle di Settings
- Save preference ke localStorage
```

### 9. Keyboard Shortcuts
```
File: src/hooks/useKeyboardShortcuts.js

Features:
- F1: Dashboard
- F2: POS
- F3: Products
- ESC: Close modal
- Enter: Confirm checkout
```

### 10. Notification System
```
File: src/components/Toast.jsx

Features:
- Success/error/warning notifications
- Auto dismiss
- Replace alert() dengan Toast
```

---

## 📋 Quick Start Command

```bash
cd C:\Users\10\POS
npm run dev
# Open http://localhost:5173/
```

## 📚 Reference Files
- app_summary.md - Design specs
- development_workflow.md - Development guide

## 🔗 Repository
https://github.com/alterach/pos-app
