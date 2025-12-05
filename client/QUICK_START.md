# 🚀 Laptomania - Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend setup)

## 📦 Installation

The project already has all dependencies installed. If you need to reinstall:

```bash
npm install
```

## ⚙️ Configuration

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Update the `.env` file with your backend API URL:

```env
VITE_API_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design Features

### Light Blue Theme
- Modern, professional design
- Gradient backgrounds (blue to cyan)
- Consistent color scheme throughout

### Responsive Design
- Mobile-first approach
- Works perfectly on all screen sizes
- Touch-friendly on mobile devices

### Key Pages
1. **Home** (`/`) - Hero section, features, featured laptops
2. **Catalog** (`/laptops`) - Browse all laptops with search/filter
3. **Laptop Detail** (`/laptops/:id`) - Detailed product view
4. **Login** (`/login`) - User authentication
5. **Register** (`/register`) - New user signup
6. **Admin Panel** (`/panel`) - Add/manage laptops (admin only)

## 🛒 Features

### For Customers
- Browse laptop catalog
- Search and filter products
- View detailed specifications
- Add items to cart
- Manage cart quantities
- Responsive shopping experience

### For Admins
- Add new laptops with images
- Edit existing products
- Delete products
- Manage inventory
- Protected admin routes

## 🎯 User Roles

### Guest Users
- Can browse catalog
- Can view product details
- Must sign in to purchase

### Registered Users
- All guest features
- Can add items to cart
- Can manage cart

### Admin Users
- All user features
- Access to admin panel
- Can add/edit/delete products

## 📱 Navigation

### Desktop
- Top navigation bar with links
- Cart icon with badge
- User menu (login/logout)

### Mobile
- Hamburger menu
- Slide-out navigation
- Touch-optimized buttons

## 🛍️ Shopping Cart

- Slide-in sidebar from right
- Add/remove items
- Adjust quantities
- View total price
- Clear cart option

## 🎨 Styling

Built with **Tailwind CSS v4** - no additional CSS frameworks needed.

### Key Design Elements
- Rounded corners (rounded-lg, rounded-2xl)
- Gradient buttons and backgrounds
- Smooth transitions and hover effects
- Consistent spacing and typography
- Professional shadows and borders

## 🔧 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router v7** - Routing
- **React Toastify** - Notifications
- **Context API** - State management

## 📂 Project Structure

```
client/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   │   ├── UI/         # UI components (Nav)
│   │   └── utils/      # Utility components (Protect)
│   ├── context/        # Context providers
│   ├── hooks/          # Custom hooks
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
└── index.html          # HTML template
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### API Connection Issues
1. Ensure backend is running
2. Check `.env` file has correct API URL
3. Verify CORS is enabled on backend

### Build Errors
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm run build -- --force`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 🎯 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR - changes appear immediately without full page reload.

### TypeScript
The project uses TypeScript for type safety. JSX files work seamlessly with the TS setup.

### Tailwind CSS
Use Tailwind utility classes directly in JSX. No need to write custom CSS.

### State Management
Uses React Context API for global state (auth, laptops, cart).

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables in Production
Don't forget to set `VITE_API_URL` in your hosting platform's environment variables.

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## 🎉 You're All Set!

The application is fully designed and ready to use. Enjoy your elegant laptop online shop!

---

**Need Help?** Check the `DESIGN_README.md` for detailed design documentation or `CHANGES_SUMMARY.md` for a complete list of changes.
