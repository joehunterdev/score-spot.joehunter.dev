import { useState, useEffect } from 'react'
import { Home, ListChecks, BarChart3 } from 'lucide-react'
import { Header, Footer } from './components/layout'
import { ApartmentDetails } from './components/ApartmentDetails'
import { RankingView } from './components/RankingView'

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
  const [activeTab, setActiveTab] = useState('scoring') // 'scoring', 'criteria', 'ranking'
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

  const tabs = [
    { id: 'scoring', name: 'Apartments', icon: Home },
    { id: 'criteria', name: 'Criteria', icon: ListChecks },
    { id: 'ranking', name: 'Rankings', icon: BarChart3 },
  ]

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-dark)] overflow-hidden">
      <Header onSettingsClick={() => setSettingsOpen(!settingsOpen)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[var(--bg-form)] border-r border-gray-700 flex flex-col">
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-[var(--brand-primary)] text-gray-900'
                        : 'text-gray-400 hover:text-white hover:bg-[var(--bg-dark)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </nav>
          
          {/* Stats Footer */}
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Apartments:</span>
                <span className="font-semibold text-[var(--brand-primary)]">{apartments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Criteria:</span>
                <span className="font-semibold text-[var(--brand-primary)]">{criteria.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-[var(--bg-dark)] to-gray-900">
          <div className="max-w-6xl mx-auto p-6"

        {/* Criteria Tab */}
        {activeTab === 'criteria' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Scoring Criteria</h1>
                <p className="text-gray-400 mt-1">Define what matters most when choosing an apartment</p>
              </div>
            </div>

            <div className="bg-[var(--bg-form)] rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 space-y-3">
                {criteria.map(criterion => (
                  <div key={criterion.id} className="flex items-center justify-between bg-[var(--bg-dark)] p-4 rounded-lg hover:bg-opacity-80 transition-all">
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.critical}
                        onChange={() => toggleCritical(criterion.id)}
                        className="w-5 h-5 accent-[var(--brand-primary)]"
                      />
                      <span className={`text-base ${criterion.critical ? 'text-[var(--brand-primary)] font-semibold' : 'text-gray-300'}`}>
                        {criterion.name}
                        {criterion.critical && ' ⭐'}
                      </span>
                    </label>
                    <button 
                      className="text-red-400 hover:text-red-300 text-2xl px-3 hover:bg-red-900/20 rounded transition-all"
                      onClick={() => deleteCriterion(criterion.id)}
                      title="Delete criterion"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-[var(--bg-dark)] border-t border-gray-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCriterionName}
                    onChange={(e) => setNewCriterionName(e.target.value)}
                    placeholder="New criterion name"
                    onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
                    className="flex-1 px-4 py-3 bg-[var(--bg-form)] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                  <label className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-form)] border border-gray-600 rounded-lg cursor-pointer hover:bg-opacity-80">
                    <input
                      type="checkbox"
                      checked={newCriterionCritical}
                      onChange={(e) => setNewCriterionCritical(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary)]"
                    />
                    <span className="text-gray-300 whitespace-nowrap">Critical</span>
                  </label>
                  <button 
                    onClick={addCriterion}
                    className="px-6 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-gray-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">⭐ Critical criteria are weighted 2x in scoring</p>
              </div>
            </div>
          </div>
        )}        {/* Scoring/Apartments Tab */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Apartments</h1>
                <p className="text-gray-400 mt-1">Score and compare your options</p>
              </div>
              {apartments.length > 0 && (
                <button 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium"
                  onClick={resetData}
                >
                  Reset All Data
                </button>
              )}
            </div>

            {/* Add Apartment Form */}
            <div className="bg-[var(--bg-form)] rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Apartment</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newApartmentName}
                  onChange={(e) => setNewApartmentName(e.target.value)}
                  placeholder="Apartment name or address"
                  onKeyPress={(e) => e.key === 'Enter' && addApartment()}
                  className="flex-1 px-4 py-3 bg-[var(--bg-dark)] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <button 
                  onClick={addApartment}
                  className="px-8 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-gray-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Add Apartment
                </button>
              </div>
            </div>

            {/* Apartments Grid */}
            {apartments.length === 0 ? (
              <div className="text-center py-20 bg-[var(--bg-form)] rounded-xl border border-gray-700">
                <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No apartments added yet</p>
                <p className="text-gray-500 text-sm mt-2">Add your first apartment above to start scoring</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {apartments.map(apartment => (
                  <div key={apartment.id} className="bg-[var(--bg-form)] rounded-xl border border-gray-700 overflow-hidden hover:border-[var(--brand-primary)] transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex-1">{apartment.name}</h3>
                        <button 
                          className="text-red-400 hover:text-red-300 text-2xl leading-none ml-3 hover:bg-red-900/20 rounded px-2 transition-all"
                          onClick={() => deleteApartment(apartment.id)}
                          title="Delete apartment"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-center mb-6 py-6 bg-gradient-to-br from-[var(--bg-dark)] to-gray-900 rounded-xl border border-gray-700">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-[var(--brand-primary)] mb-1">
                            {calculateTotalScore(apartment)}%
                          </div>
                          <span className="text-sm text-gray-400 uppercase tracking-wide">Overall Score</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {criteria.map(criterion => (
                          <div key={criterion.id}>
                            <div className="flex items-center justify-between mb-2">
                              <label className={`text-sm font-medium ${criterion.critical ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>
                                {criterion.name} {criterion.critical && '⭐'}
                              </label>
                              <span className="text-sm font-bold text-[var(--brand-secondary)] bg-[var(--bg-dark)] px-3 py-1 rounded-full">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Rankings</h1>
              <p className="text-gray-400 mt-1">Compare all apartments at a glance</p>
            </div>
            
            <div className="bg-[var(--bg-form)] rounded-xl border border-gray-700 p-6">
              <RankingView apartments={apartments} criteria={criteria} />
            </div>
          </div>
        )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default App
