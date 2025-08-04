// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, Car, Calendar, Fuel, Gauge, IndianRupee } from 'lucide-react';

// The URL of your Node.js backend
const API_URL = 'http://localhost:8000';

// A reusable component for our form inputs to keep the code clean
const InputGroup = ({ icon, label, children }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    {children}
  </div>
);

// A simple SVG component for the background pattern
const GridPattern = () => (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full fill-gray-400/5 stroke-gray-400/5 [mask-image:radial-gradient(200%_100%_at_top_right,white,transparent)]"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="90"
          height="90"
          patternUnits="userSpaceOnUse"
          x="100%"
          y="-1"
          patternTransform="translate(0 -1)"
        >
          <path d="M.5 90V.5H90" fill="none"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)"></rect>
    </svg>
);


function CarPricePredictor() {
  // State for form inputs
  const [company, setCompany] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [kmsDriven, setKmsDriven] = useState('');

  // State to hold data fetched from the backend
  const [carData, setCarData] = useState({
      companies: [],
      car_models: [],
      years: [],
      fuel_types: []
  });

  // State for the dynamically filtered list of car models
  const [availableModels, setAvailableModels] = useState([]);

  // State for prediction logic
  const [prediction, setPrediction] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState('');

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchCarData = async () => {
        try {
            const response = await axios.get(`${API_URL}/data`);
            setCarData(response.data);
        } catch (err) {
            console.error("Failed to fetch car data:", err);
            setError("Could not load car data. Is the backend server running?");
        }
    };
    fetchCarData();
  }, []);

  // --- Model Filtering Effect ---
  useEffect(() => {
    if (company && carData.car_models.length > 0) {
      const filteredModels = carData.car_models.filter(model =>
        model.toLowerCase().startsWith(company.toLowerCase())
      );
      setAvailableModels(filteredModels);
      if (filteredModels.length > 0) {
          setCarModel(filteredModels[0]);
      } else {
          setCarModel('');
      }
    } else {
      setAvailableModels([]);
      setCarModel('');
    }
  }, [company, carData.car_models]);

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company || !carModel || !year || !fuelType || !kmsDriven) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setPrediction('');
    setIsPredicting(true);

    const formData = new FormData();
    formData.append('company', company);
    formData.append('car_models', carModel);
    formData.append('year', year);
    formData.append('fuel_type', fuelType);
    formData.append('kilo_driven', kmsDriven);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err) {
      console.error("Prediction API error:", err);
      setError(err.response?.data || 'Failed to get a prediction. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <GridPattern />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-900/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 w-full max-w-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-gray-600/50">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                    Car Price Predictor
                </h1>
                <p className="text-gray-400 mt-2">Enter your car's details to get an estimated market value.</p>
            </div>
            <div className="p-8">
                <form onSubmit={handleSubmit} name="Modelform" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup icon={<Building size={20} className="text-blue-400"/>} label="Select Company">
                            <select
                                id="company"
                                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            >
                                <option value="">-- Select --</option>
                                {carData.companies.map((comp) => (
                                    <option key={comp} value={comp}>{comp}</option>
                                ))}
                            </select>
                        </InputGroup>

                        <InputGroup icon={<Car size={20} className="text-blue-400"/>} label="Select Model">
                            <select
                                id="car_models"
                                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                                required
                                disabled={!company || availableModels.length === 0}
                            >
                                {availableModels.length > 0 ? (
                                    availableModels.map((model) => (
                                        <option key={model} value={model}>{model}</option>
                                    ))
                                ) : (
                                    <option value="">-- Select company first --</option>
                                )}
                            </select>
                        </InputGroup>

                        <InputGroup icon={<Calendar size={20} className="text-blue-400"/>} label="Year of Purchase">
                            <select
                                id="year"
                                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            >
                                <option value="">-- Select --</option>
                                {carData.years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </InputGroup>

                        <InputGroup icon={<Fuel size={20} className="text-blue-400"/>} label="Fuel Type">
                            <select
                                id="fuel_type"
                                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                required
                            >
                                <option value="">-- Select --</option>
                                {carData.fuel_types.map((fuel) => (
                                    <option key={fuel} value={fuel}>{fuel}</option>
                                ))}
                            </select>
                        </InputGroup>

                        <div className="md:col-span-2">
                            <InputGroup icon={<Gauge size={20} className="text-blue-400"/>} label="Kilometres Travelled">
                                <input
                                    type="number"
                                    id="kilo_driven"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="e.g., 50000"
                                    value={kmsDriven}
                                    onChange={(e) => setKmsDriven(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                disabled={isPredicting}
                            >
                                {isPredicting ? 'Calculating...' : 'Predict Price'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center h-16 flex items-center justify-center">
                    {error && <p className="text-red-400 animate-pulse">{error}</p>}
                    {isPredicting && <p className="text-blue-300 animate-pulse">Getting prediction...</p>}
                    {prediction && !isPredicting && (
                        <div className="animate-fade-in-up">
                            <p className="text-gray-400 text-lg">Estimated Price:</p>
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 flex items-center justify-center">
                                <IndianRupee size={30} className="mr-1"/>{prediction}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default CarPricePredictor;
