import React, { useState } from 'react';
import './App.css'; // Import the CSS file

function App() {
  const [period, setPeriod] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [showDropdown, setShowDropdown] = useState(true); // State to control dropdown visibility

  const handleGenerateMap = () => {
    if (!period) return;  // Don't do anything if no period is selected
    fetch('http://127.0.0.1:5000', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ period }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          setMapUrl(`http://127.0.0.1:5000${data.url}`);
          setShowDropdown(false); // Hide the dropdown after generating the map
        } else {
          console.error('Error fetching map URL:', data);
        }
      })
      .catch(error => {
        console.error('Error generating map:', error);
      });
  };

  const handleGenerateNew = () => {
    // Reset the state to allow for a new map generation
    setPeriod('');
    setMapUrl('');
    setShowDropdown(true); // Show the dropdown again
  };

  return (
    <div>
      <h1>Earthquake Map Generator</h1>
      {showDropdown && (
        <div>
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="">Select a period</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button onClick={handleGenerateMap}>Generate Map</button>
        </div>
      )}

      {mapUrl && (
        <div>
          <button onClick={handleGenerateNew}>Generate New</button> {/* New button to refresh */}
          <h2>Earthquake Map:</h2>
          <iframe 
            src={mapUrl} 
            title="Earthquake Map" 
            width="100%" 
            height="600px" 
            key={mapUrl}  // Key prop to force re-render
          ></iframe>
          
        </div>
      )}
    </div>
  );
}

export default App;
