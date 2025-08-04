# Car Price Predictor 🚗📈

A full-stack machine learning web application that predicts the price of a car based on various features like year, mileage, brand, fuel type, etc. The app combines a React + Tailwind CSS frontend with a Node.js + Express backend serving predictions using a Linear Regression model trained via Python.

## ✨ Features
- Predicts car prices using a trained Linear Regression model
- Clean and responsive UI built with React and Tailwind CSS
- Interactive form to collect input features
- Exploratory Data Analysis (EDA) performed to understand feature relationships

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS

### Backend
- Node.js
- Express

### Machine Learning
- Python (Jupyter Notebook)
- scikit-learn
- Pandas, NumPy
- Pickle (for model serialization)

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shivaiitp/Car-Predictor.git
cd Car-Predictor
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install
```

### 4. Start the app
- Start backend:
  ```bash
  cd ../server
  npm run dev OR npm start
  ```

- Start frontend:
  ```bash
  cd ../client
  npm run dev
  ```

### 5. View in browser
Open [http://localhost:3000](http://localhost:3000)

## 📊 Machine Learning

- Linear Regression used for predicting car prices.
- EDA performed to visualize feature correlations, distributions, and remove outliers.
- Model saved using `pickle` and served via backend or Python API.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

---

> Made with ❤️ by [Shiva Singh](https://github.com/shivaiitp)
