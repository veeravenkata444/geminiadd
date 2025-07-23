import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Create this file for basic styling

function App() {
  const [propertyData, setPropertyData] = useState({
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    location: 'New York',
    features: ['Swimming pool', 'Garden', 'Garage'],
    yearBuilt: 2010
  });

  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setPropertyData(prev => {
      const features = checked 
        ? [...prev.features, value]
        : prev.features.filter(f => f !== value);
      return { ...prev, features };
    });
  };

  const generateDescription = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/generate-description', {
        propertyData
      });
      
      setDescription(response.data.description);
      setSuccess('Description generated successfully!');
    } catch (err) {
      setError('Failed to generate description. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Property data submitted:', { ...propertyData, description });
    alert('Property submitted! Check console for data.');
  };

  return (
    <div className="app-container">
      <h1>Property Listing Generator</h1>
      <p>Generate compelling property descriptions with AI</p>
      
      <div className="property-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Type</label>
            <select 
              name="type" 
              value={propertyData.type}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={propertyData.bedrooms}
                onChange={handleInputChange}
                className="form-control"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={propertyData.bathrooms}
                onChange={handleInputChange}
                className="form-control"
                min="1"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label>Area (sq ft)</label>
              <input
                type="number"
                name="area"
                value={propertyData.area}
                onChange={handleInputChange}
                className="form-control"
                min="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={propertyData.location}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Year Built</label>
            <input
              type="number"
              name="yearBuilt"
              value={propertyData.yearBuilt || ''}
              onChange={handleInputChange}
              className="form-control"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="features-checkbox">
              {['Swimming pool', 'Garden', 'Garage', 'Fireplace', 'Balcony', 'Furnished', 'Parking'].map(feature => (
                <label key={feature} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={feature}
                    checked={propertyData.features.includes(feature)}
                    onChange={handleFeatureChange}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows="5"
              placeholder="Property description will be generated here..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGenerating}
              className="btn generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate AI Description'}
            </button>

            <button
              type="submit"
              className="btn submit-btn"
            >
              Save Property
            </button>
          </div>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default App;