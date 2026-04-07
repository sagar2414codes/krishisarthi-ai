# KrishiSarthi - Agriculture AI Assistant (Frontend)

A modern, responsive React + TypeScript web application that provides AI-powered agricultural decision support for farmers. This frontend interfaces with the FastAPI backend to deliver crop recommendations, yield predictions, and offline disease detection.

![KrishiSarthi](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3.5-blueviolet)

## 🚀 Features

### 🌱 **Crop Recommendation**
- **AI-Powered Suggestions**: Get top 3 crop recommendations based on soil parameters
- **Auto Geolocation**: Automatically fetch weather data for precise recommendations
- **Interactive Sliders**: Adjust N-P-K levels and pH with real-time feedback
- **Seasonal Awareness**: Kharif, Rabi, and Summer season support

### 📊 **Yield Prediction** 
- **ML-Based Forecasting**: Predict crop yield in tons per hectare
- **Weather Integration**: Uses historical weather data for accurate predictions
- **Multiple Crops**: Support for rice, wheat, maize, sugarcane, and more
- **Visual Results**: Clear yield categories and confidence indicators

### 🔬 **Disease Detection** (Offline Ready)
- **Offline AI**: Works completely without internet using TensorFlow.js
- **Camera Integration**: Capture images directly or upload existing photos
- **Instant Results**: Real-time disease classification with confidence scores
- **38+ Disease Types**: Comprehensive plant disease database

### 🎨 **Modern UI/UX**
- **Mobile-First**: Fully responsive design optimized for all devices
- **Dark/Light Mode**: System preference aware with manual toggle
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Accessibility**: WCAG compliant with proper touch targets

## 📁 Project Structure

```
frontend/
├── public/
│   ├── models/                     # TensorFlow.js models and metadata
│   │   ├── class_indices.json      # Disease classification labels
│   │   └── disease_detector/       # Converted TFJS model files
│   └── index.html
├── src/
│   ├── api/                        # API services and type definitions
│   │   ├── client.ts              # Axios HTTP client configuration
│   │   ├── agriculture.ts         # Agriculture-specific API calls
│   │   └── types.ts               # TypeScript interfaces
│   ├── components/                 # Reusable UI components
│   │   ├── Button.tsx             # Customizable button component
│   │   ├── Card.tsx               # Card containers and feature cards
│   │   ├── Form.tsx               # Input, Select, and Slider components
│   │   ├── Loading.tsx            # Loading states and skeletons
│   │   ├── Error.tsx              # Error boundaries and states
│   │   └── index.ts               # Component exports
│   ├── hooks/                      # Custom React hooks
│   │   ├── useGeolocation.ts      # Location access and management
│   │   ├── useOnlineStatus.ts     # Network connectivity detection
│   │   ├── useTheme.ts            # Dark/light mode management
│   │   └── index.ts               # Hook exports
│   ├── pages/                      # Route components
│   │   ├── HomePage.tsx           # Landing page with feature cards
│   │   ├── CropRecommendationPage.tsx  # Crop recommendation interface
│   │   ├── YieldPredictionPage.tsx     # Yield prediction interface
│   │   └── DiseaseDetectionPage.tsx    # Disease detection interface
│   ├── services/                   # Business logic services
│   │   ├── tfliteService.ts       # TensorFlow.js model management
│   │   ├── cacheService.ts        # LocalForage caching layer
│   │   └── index.ts               # Service exports
│   ├── store/                      # Redux Toolkit state management
│   │   ├── appSlice.ts            # Global app state
│   │   └── index.ts               # Store configuration
│   ├── styles/
│   │   └── index.css              # Tailwind CSS with custom utilities
│   ├── App.tsx                     # Main app component with routing
│   └── main.tsx                    # React app entry point
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://127.0.0.1:8000`

### 1. Clone and Install
```bash
cd frontend
npm install
```

### 2. Environment Configuration
The app automatically detects the environment:
- **Development**: Uses `http://127.0.0.1:8000`
- **Android Emulator**: Uses `http://10.0.2.2:8000`
- **Production**: Configure in `src/api/client.ts`

### 3. Model Setup (Disease Detection)
```bash
# Copy class indices (already included)
cp ../backend/models/class_indices.json public/models/

# Convert TFLite to TensorFlow.js format (if needed)
# pip install tensorflowjs
# tensorflowjs_converter --input_format=tf_lite --output_format=tfjs_graph_model \
#   ../backend/models/disease_detector_float32.tflite public/models/disease_detector/
```

### 4. Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Backend URL Configuration
Edit `src/api/client.ts` to change the backend URL:
```typescript
const getBaseURL = (): string => {
  // Add your production URL here
  return 'https://your-api-domain.com';
};
```

### Theme Customization
Modify `tailwind.config.js` for custom colors:
```javascript
colors: {
  primary: {
    500: '#2E7D32', // Your primary green
  },
  accent: {
    500: '#FFC107', // Your accent amber
  }
}
```

### Adding New ML Models
1. Place model files in `public/models/your-model/`
2. Create service in `src/services/yourModelService.ts`
3. Update `src/services/index.ts` with exports

## 📱 Mobile & PWA Support

### Android App Conversion
```bash
# Using Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npm run build
npx cap copy
npx cap open android
```

### PWA Configuration
Add to `public/manifest.json`:
```json
{
  "name": "KrishiSarthi",
  "short_name": "KrishiAI",
  "theme_color": "#2E7D32",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/"
}
```

## 🔍 API Integration

### Crop Recommendation
```typescript
const recommendations = await AgricultureAPI.recommendCrop({
  nitrogen: 50,
  phosphorus: 50, 
  potassium: 50,
  ph: 7.0,
  season: 'kharif',
  soil_type: 'Clay'
}, { lat: 19.07, lon: 72.87 });
```

### Yield Prediction
```typescript
const prediction = await AgricultureAPI.predictYield({
  nitrogen: 50,
  phosphorus: 50,
  potassium: 50, 
  ph: 7.0,
  season: 'kharif',
  crop: 'rice'
}, { lat: 19.07, lon: 72.87 });
```

### Disease Detection (Offline)
```typescript
const result = await tfliteService.detectDisease(imageFile);
```

## 🏗 Architecture Decisions

### **Why React + TypeScript?**
- Type safety for complex ML data structures
- Excellent tooling and developer experience
- Large ecosystem for mobile app conversion

### **Why Tailwind CSS?**
- Rapid UI development with consistent design
- Easy dark mode implementation
- Mobile-first responsive utilities

### **Why Redux Toolkit?**
- Centralized state for location, theme, and offline status
- Predictable state updates
- Great DevTools support

### **Why React Query?**
- Automatic caching and background refetching
- Optimistic updates and error handling
- Perfect for API-heavy agriculture app

### **Why TensorFlow.js?**
- True offline disease detection
- No server dependency for ML inference
- Works across all modern browsers

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Serve from dist/ folder
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Static Hosting (Netlify/Vercel)
```bash
# Build command
npm run build

# Publish directory  
dist
```

## 🔧 Troubleshooting

### Common Issues

**Location not working?**
- Ensure HTTPS in production
- Check browser permissions
- Verify geolocation API support

**Models not loading?**
- Check model files in `public/models/`
- Verify network requests in DevTools
- Ensure correct MIME types

**Backend connection issues?**
- Verify backend is running on correct port
- Check CORS configuration
- Review network requests in DevTools

**Build errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading for route components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: LocalForage for API responses
- **Bundle Analysis**: Use `npm run build -- --analyze`

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# E2E tests with Playwright
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- **Frontend Development**: React + TypeScript + Tailwind CSS
- **Backend Integration**: FastAPI + Python ML Models
- **Mobile Ready**: PWA + Capacitor Support

---

**Built with ❤️ for Indian Farmers** 🇮🇳

For support, email: support@krishisahayak.com