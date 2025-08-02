# 🌱 Plowtion - AI-Powered Crop Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

Plowtion harnesses the power of AI to generate personalized crop schedules tailored to your specific location and crop type. By integrating real-time weather data, we help farmers make informed decisions that optimize growth and maximize yield, adapting to the challenges posed by changing climate conditions.

## ✨ Features

- **🤖 AI-Powered Crop Recommendations**: Machine learning model provides personalized crop suggestions based on environmental factors
- **📅 Smart Scheduling**: Generate optimized planting and harvesting schedules
- **🌤️ Weather Integration**: Real-time weather data integration for informed decision-making
- **🛒 Marketplace**: Robust platform for buying and selling seeds and farming equipment
- **💬 AI Chatbot**: NLP-powered assistant providing instant farming tips and guidance
- **👤 User Profiles**: Personalized farmer profiles and preferences
- **🔐 Secure Authentication**: OAuth integration with Google authentication

## 🏗️ Project Structure

```
Plowtion/
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── dataset/            # ML training datasets
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container config
├── frontend/               # Next.js React application
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable React components
│   ├── lib/              # Utility libraries
│   ├── services/         # API service layer
│   └── Dockerfile        # Frontend container config
├── model/                 # Machine learning models
│   └── crop_model.joblib # Trained crop recommendation model
└── docker-compose.yml    # Multi-container orchestration
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Python 3.8+** (for local development)
- **Node.js 18+** (for local development)
- **MongoDB** (included in Docker setup)

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Plowtion
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys and secrets
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### 💻 Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   export FLASK_ENV=development
   export PERPLEXITY_API_KEY=your_api_key_here
   # ... other environment variables from .env.example
   ```

5. **Run the Flask application**
   ```bash
   python app.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

### Required API Keys

- **PERPLEXITY_API_KEY**: For AI chatbot functionality
- **WEATHER_API_KEY**: For weather data integration  
- **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**: For OAuth authentication
- **NEXTAUTH_SECRET**: For NextAuth.js session encryption
- **AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY**: For AWS services

### Configuration

Create a `.env` file based on `.env.example` and fill in your actual values:

```bash
# API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key
WEATHER_API_KEY=your_weather_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/plowtion

# AWS (if using AWS services)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com/api`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/predict` | Get crop recommendations |
| POST | `/chat` | Chat with AI assistant |
| GET | `/crops` | Get crop information |
| POST | `/schedule` | Generate crop schedule |

### Example API Usage

```javascript
// Get crop recommendation
const response = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nitrogen: 40,
    phosphorus: 50,
    potassium: 30,
    temperature: 25,
    humidity: 80,
    ph: 6.5,
    rainfall: 200
  })
});
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Docker Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with production configuration**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

The application is containerized and can be deployed on:
- **AWS ECS/EKS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript/TypeScript
- Write tests for new features
- Update documentation for API changes
- Ensure Docker builds pass

## 🔒 Security

- **No hardcoded secrets**: All sensitive data is managed through environment variables
- **Authentication**: Secure OAuth integration
- **API Security**: Rate limiting and input validation
- **Data Protection**: Encrypted data transmission

## 📈 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced weather predictions
- [ ] IoT sensor integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with farming equipment APIs

## 🐛 Troubleshooting

### Common Issues

**Docker containers not starting**
- Check Docker daemon is running
- Verify environment variables are set
- Check port conflicts (3000, 5000, 27017)

**API authentication errors**
- Verify Google OAuth credentials
- Check NEXTAUTH_SECRET is set
- Ensure NEXTAUTH_URL matches your domain

**Database connection issues**
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure network connectivity between containers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Scikit-learn** for machine learning capabilities
- **Next.js** for the robust frontend framework
- **Flask** for the lightweight backend API
- **Perplexity AI** for intelligent chatbot functionality
- **MongoDB** for flexible data storage

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our community discussions
- Check the documentation wiki

---

Built with ❤️ for farmers around the world 🌾