import { useState, useEffect } from 'react'
import { Header, Footer } from './components/layout'
import { ApartmentDetails } from './components/ApartmentDetails'
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
      }, {}),
      budget: '',
      externalLink: '',
      notes: '',
      exclusions: []
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

  const updateApartment = (updatedApartment) => {
    setApartments(apartments.map(apt => 
      apt.id === updatedApartment.id ? updatedApartment : apt
    ));
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

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="background-interstellar flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(!settingsOpen)} />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Criteria Management Section */}
        <section className="bg-[var(--bg-form)] rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-4">Scoring Criteria</h2>
          <div className="space-y-2 mb-4">
            {criteria.map(criterion => (
              <div key={criterion.id} className="flex items-center justify-between bg-[var(--bg-dark)] p-3 rounded-md">
                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={criterion.critical}
                    onChange={() => toggleCritical(criterion.id)}
                    className="w-4 h-4 accent-[var(--brand-primary)]"
                  />
                  <span className={`${criterion.critical ? 'text-[var(--brand-primary)] font-semibold' : 'text-gray-300'}`}>
                    {criterion.name}
                    {criterion.critical && ' ⭐'}
                  </span>
                </label>
                <button 
                  className="text-red-400 hover:text-red-300 text-xl px-2"
                  onClick={() => deleteCriterion(criterion.id)}
                  title="Delete criterion"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newCriterionName}
              onChange={(e) => setNewCriterionName(e.target.value)}
              placeholder="New criterion name"
              onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
              className="flex-1 min-w-[200px] px-4 py-2 bg-[var(--bg-dark)] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
            <label className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-dark)] border border-gray-700 rounded-md cursor-pointer">
              <input
                type="checkbox"
                checked={newCriterionCritical}
                onChange={(e) => setNewCriterionCritical(e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-primary)]"
              />
              <span className="text-gray-300">Critical</span>
            </label>
            <button 
              onClick={addCriterion}
              className="px-6 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-gray-900 font-semibold rounded-md transition-colors"
            >
              Add Criterion
            </button>
          </div>
        </section>

        {/* Add Apartment Section */}
        <section className="bg-[var(--bg-form)] rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-4">Add New Apartment</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newApartmentName}
              onChange={(e) => setNewApartmentName(e.target.value)}
              placeholder="Apartment name or address"
              onKeyPress={(e) => e.key === 'Enter' && addApartment()}
              className="flex-1 px-4 py-2 bg-[var(--bg-dark)] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
            <button 
              onClick={addApartment}
              className="px-6 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-gray-900 font-semibold rounded-md transition-colors"
            >
              Add Apartment
            </button>
          </div>
        </section>

        {/* Apartments List */}
        <section className="bg-[var(--bg-form)] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[var(--brand-primary)]">
              Apartments ({apartments.length})
            </h2>
            {apartments.length > 0 && (
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                onClick={resetData}
              >
                Reset All Data
              </button>
            )}
          </div>
          
          {apartments.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No apartments added yet. Add one above to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map(apartment => (
                <div key={apartment.id} className="bg-[var(--bg-dark)] rounded-lg p-5 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{apartment.name}</h3>
                    <button 
                      className="text-red-400 hover:text-red-300 text-2xl leading-none"
                      onClick={() => deleteApartment(apartment.id)}
                      title="Delete apartment"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center mb-4 py-4 bg-[var(--bg-form)] rounded-lg">
                    <div className="text-5xl font-bold text-[var(--brand-primary)]">
                      {calculateTotalScore(apartment)}%
                    </div>
                    <span className="text-sm text-gray-400 mt-1">Overall Score</span>
                  </div>
                  
                  <div className="space-y-3">
                    {criteria.map(criterion => (
                      <div key={criterion.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className={`text-sm ${criterion.critical ? 'text-[var(--brand-primary)] font-semibold' : 'text-gray-300'}`}>
                            {criterion.name}
                            {criterion.critical && ' ⭐'}
                          </label>
                          <span className="text-sm font-semibold text-[var(--brand-secondary)]">
                            {apartment.scores[criterion.id] || 5}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={apartment.scores[criterion.id] || 5}
                          onChange={(e) => updateScore(apartment.id, criterion.id, e.target.value)}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--brand-primary)]"
                        />
                      </div>
                    ))}
                  </div>

                  <ApartmentDetails 
                    apartment={apartment}
                    onUpdate={updateApartment}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>⭐ = Critical criteria (weighted 2x in overall score)</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
