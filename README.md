# 🛒 Zyvero — Modern E-Commerce Platform

Zyvero is a modern, e-commerce web application built using **Next.js App Router**.  
It demonstrates real-world shopping features such as authentication, product discovery, cart management, and responsive UI — designed for production and portfolio use.

---

## ✨ Features

- 🔐 User Authentication (Sign In / Sign Up)
- 🛍️ Product Listings & Product Detail Pages
- 🛒 Real-time Cart Management
- 🔔 Toast Notifications (Add to Cart, Auth Feedback)
- 🔎 Search & Category Filtering
- 🔁 Recently Viewed Products
- 🧠 Similar Products & “Customers Also Bought”
- 📱 Fully Responsive Design
- ⚡ Fast Performance with Next.js App Router
- ☁️ CI/CD Deployment on Vercel

---

## 🧑‍💻 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Notifications:** react-hot-toast
- **API:** DummyJSON
- **Deployment:** Vercel
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/srimanpoloju/Zyvero-ecommerce-platform.git
cd zyvero

Install dependencies
npm install

Run the development server
npm run dev

Open http://localhost:3000 in your browser.

**📂 Project Structure**
app/
 ├── components/        # Reusable UI components
 ├── product/[id]/      # Product detail pages
 ├── cart/              # Cart page
 ├── login/ register/   # Authentication pages
 ├── store/             # Zustand state stores
 ├── layout.tsx         # Root layout (Header + Toaster)
 └── page.tsx           # Home page

**🛠️ Scripts**
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
