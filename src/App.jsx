import { useState, useEffect } from 'react'
import './App.css'

const DEFAULT_CRITERIA = [
  { id: 1, name: 'Rent Price', critical: true },
  { id: 2, name: 'Location/Commute', critical: true },
  { id: 3, name: 'Square Footage', critical: false },
  { id: 4, name: 'Natural Light', critical: false },
  { id: 5, name: 'Kitchen Quality', critical: false },
  { id: 6, name: 'Bathroom Quality', critical: false },
  { id: 7, name: 'Storage Space', critical: false },
  { id: 8, name: 'Parking Available', critical: false },
  { id: 9, name: 'Pet Friendly', critical: false },
  { id: 10, name: 'Laundry In-Unit', critical: false },
  { id: 11, name: 'Noise Level', critical: true },
  { id: 12, name: 'Safety/Security', critical: true },
  { id: 13, name: 'Nearby Amenities', critical: false },
  { id: 14, name: 'Public Transit Access', critical: false },
];

function App() {
  const [criteria, setCriteria] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [newApartmentName, setNewApartmentName] = useState('');
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionCritical, setNewCriterionCritical] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedCriteria = localStorage.getItem('apartmentCriteria');
    const storedApartments = localStorage.getItem('apartments');
    
    if (storedCriteria) {
      setCriteria(JSON.parse(storedCriteria));
    } else {
      setCriteria(DEFAULT_CRITERIA);
    }
    
    if (storedApartments) {
      setApartments(JSON.parse(storedApartments));
    }
  }, []);

  // Save criteria to localStorage whenever they change
  useEffect(() => {
    if (criteria.length > 0) {
      localStorage.setItem('apartmentCriteria', JSON.stringify(criteria));
    }
  }, [criteria]);

  // Save apartments to localStorage whenever they change
  useEffect(() => {
    if (apartments.length > 0) {
      localStorage.setItem('apartments', JSON.stringify(apartments));
    }
  }, [apartments]);

  const addApartment = () => {
    if (!newApartmentName.trim()) return;
    
    const newApartment = {
      id: Date.now(),
      name: newApartmentName.trim(),
      scores: criteria.reduce((acc, criterion) => {
        acc[criterion.id] = 5; // Default score of 5 out of 10
        return acc;
      }, {})
    };
    
    setApartments([...apartments, newApartment]);
    setNewApartmentName('');
  };

  const deleteApartment = (id) => {
    const updatedApartments = apartments.filter(apt => apt.id !== id);
    setApartments(updatedApartments);
    localStorage.setItem('apartments', JSON.stringify(updatedApartments));
  };

  const updateScore = (apartmentId, criterionId, score) => {
    setApartments(apartments.map(apt => {
      if (apt.id === apartmentId) {
        return {
          ...apt,
          scores: { ...apt.scores, [criterionId]: parseInt(score) }
        };
      }
      return apt;
    }));
  };

  const toggleCritical = (criterionId) => {
    setCriteria(criteria.map(c => 
      c.id === criterionId ? { ...c, critical: !c.critical } : c
    ));
  };

  const addCriterion = () => {
    if (!newCriterionName.trim()) return;
    
    const newCriterion = {
      id: Date.now(),
      name: newCriterionName.trim(),
      critical: newCriterionCritical
    };
    
    setCriteria([...criteria, newCriterion]);
    
    // Add default score for new criterion to all existing apartments
    setApartments(apartments.map(apt => ({
      ...apt,
      scores: { ...apt.scores, [newCriterion.id]: 5 }
    })));
    
    setNewCriterionName('');
    setNewCriterionCritical(false);
  };

  const deleteCriterion = (criterionId) => {
    const updatedCriteria = criteria.filter(c => c.id !== criterionId);
    setCriteria(updatedCriteria);
    localStorage.setItem('apartmentCriteria', JSON.stringify(updatedCriteria));
    
    // Remove scores for deleted criterion from all apartments
    const updatedApartments = apartments.map(apt => {
      const newScores = { ...apt.scores };
      delete newScores[criterionId];
      return { ...apt, scores: newScores };
    });
    setApartments(updatedApartments);
  };

  const calculateTotalScore = (apartment) => {
    let totalScore = 0;
    let maxScore = 0;
    
    criteria.forEach(criterion => {
      const score = apartment.scores[criterion.id] || 0;
      const weight = criterion.critical ? 2 : 1; // Critical items count double
      totalScore += score * weight;
      maxScore += 10 * weight;
    });
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('apartmentCriteria');
      localStorage.removeItem('apartments');
      setCriteria(DEFAULT_CRITERIA);
      setApartments([]);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🏠 SpotScore</h1>
        <p>Score and compare apartments based on your criteria</p>
      </header>

      <div className="container">
        {/* Criteria Management Section */}
        <section className="criteria-section">
          <h2>Scoring Criteria</h2>
          <div className="criteria-list">
            {criteria.map(criterion => (
              <div key={criterion.id} className="criterion-item">
                <label>
                  <input
                    type="checkbox"
                    checked={criterion.critical}
                    onChange={() => toggleCritical(criterion.id)}
                  />
                  <span className={criterion.critical ? 'critical' : ''}>
                    {criterion.name}
                    {criterion.critical && ' ⭐'}
                  </span>
                </label>
                <button 
                  className="delete-btn small"
                  onClick={() => deleteCriterion(criterion.id)}
                  title="Delete criterion"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-form">
            <input
              type="text"
              value={newCriterionName}
              onChange={(e) => setNewCriterionName(e.target.value)}
              placeholder="New criterion name"
              onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newCriterionCritical}
                onChange={(e) => setNewCriterionCritical(e.target.checked)}
              />
              Critical
            </label>
            <button onClick={addCriterion}>Add Criterion</button>
          </div>
        </section>

        {/* Add Apartment Section */}
        <section className="add-apartment-section">
          <h2>Add New Apartment</h2>
          <div className="add-form">
            <input
              type="text"
              value={newApartmentName}
              onChange={(e) => setNewApartmentName(e.target.value)}
              placeholder="Apartment name or address"
              onKeyPress={(e) => e.key === 'Enter' && addApartment()}
            />
            <button onClick={addApartment}>Add Apartment</button>
          </div>
        </section>

        {/* Apartments List */}
        <section className="apartments-section">
          <div className="section-header">
            <h2>Apartments ({apartments.length})</h2>
            {apartments.length > 0 && (
              <button className="reset-btn" onClick={resetData}>
                Reset All Data
              </button>
            )}
          </div>
          
          {apartments.length === 0 ? (
            <p className="empty-state">No apartments added yet. Add one above to get started!</p>
          ) : (
            <div className="apartments-grid">
              {apartments.map(apartment => (
                <div key={apartment.id} className="apartment-card">
                  <div className="apartment-header">
                    <h3>{apartment.name}</h3>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteApartment(apartment.id)}
                      title="Delete apartment"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="total-score">
                    <div className="score-circle">
                      {calculateTotalScore(apartment)}%
                    </div>
                    <span className="score-label">Overall Score</span>
                  </div>
                  
                  <div className="scores-list">
                    {criteria.map(criterion => (
                      <div key={criterion.id} className="score-item">
                        <label className={criterion.critical ? 'critical' : ''}>
                          {criterion.name}
                          {criterion.critical && ' ⭐'}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={apartment.scores[criterion.id] || 5}
                          onChange={(e) => updateScore(apartment.id, criterion.id, e.target.value)}
                        />
                        <span className="score-value">
                          {apartment.scores[criterion.id] || 5}/10
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer>
        <p>⭐ = Critical criteria (weighted 2x in overall score)</p>
      </footer>
    </div>
  )
}

export default App
