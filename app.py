from flask import Flask, request, jsonify, send_file,url_for
import folium
import pandas as pd
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)
# earthquake feed URLs
hourly = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv'
daily = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv'
weekly = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv'
monthly = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.csv'

# Function to create the earthquake map
def create_map(period):
    df = pd.read_csv(period)
    m = folium.Map(location=(0, 0), zoom_start=2)

    for i in range(len(df)):
        if df.iloc[i]['mag'] > 3:
            folium.Circle(
                location=[df.iloc[i]['latitude'], df.iloc[i]['longitude']],
                radius=df.iloc[i]['mag'] * 70000,
                weight=1,
                color='red',
                opacity=0.3,
                fill_color='red',
                fill_opacity=0.1,
            ).add_to(m)



    filepath = os.path.join('Frontend\earthquake\static', 'earthquakes.html')
    m.save(filepath)

# API route to generate the map based on user's choice
@app.route('/', methods=['POST'])
def generate_map():
    data = request.get_json()
    period = data.get('period')

    if period == 'hourly':
        create_map(hourly)
    elif period == 'daily':
        create_map(daily)
    elif period == 'weekly':
        create_map(weekly)
    elif period == 'monthly':
        create_map(monthly)
    else:
        return jsonify({'error': 'Invalid period'}), 400
# static\earthquakes.html

    return jsonify({'url': url_for('static', filename='earthquakes.html')})
    

if __name__ == '__main__':
    app.run(debug=True)
