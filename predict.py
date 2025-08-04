# Filename: predict.py
# Description: A standalone command-line script to make predictions.
# This version reads data from system arguments, not a web request.

import sys
import pickle
import pandas as pd
import numpy as np
import os

# --- Load Model ---
# This builds a reliable path to the model file, which should be
# located one directory above this script.
try:
    # Get the directory where this script is located
    script_dir = os.path.dirname(__file__)
    # Build the path to the model file in the parent directory
    model_path = os.path.join(script_dir, 'LinearRegressionModel.pkl')
    model = pickle.load(open(model_path, 'rb'))
except FileNotFoundError:
    # This error will be sent to the Node.js server if the file isn't found
    print("Error: 'LinearRegressionModel.pkl' not found in the parent directory.", file=sys.stderr)
    sys.exit(1)


# --- Get Data from Command-Line Arguments ---
# sys.argv is a list containing the command-line arguments.
# sys.argv[0] is the script name itself ('predict.py').
# sys.argv[1], sys.argv[2], etc., are the arguments passed by Node.js.
try:
    car_model = sys.argv[1]
    company = sys.argv[2]
    year = sys.argv[3]
    driven = sys.argv[4]
    fuel_type = sys.argv[5]
except IndexError:
    print("Error: Not all required arguments were provided to the script.", file=sys.stderr)
    sys.exit(1)


# --- Create DataFrame for Prediction ---
# The model expects a pandas DataFrame with these specific column names.
input_data = pd.DataFrame(
    columns=['name', 'company', 'year', 'kms_driven', 'fuel_type'],
    data=np.array([car_model, company, year, driven, fuel_type]).reshape(1, 5)
)

# --- Make and Print Prediction ---
# The output of the 'print' function is captured by the Node.js server.
try:
    prediction = model.predict(input_data)
    # Print the final result to standard output
    print(str(np.round(prediction[0], 2)))
except Exception as e:
    print(f"Error during prediction: {e}", file=sys.stderr)
    sys.exit(1)
