import { useState, useEffect } from 'react'
import { Home, ListChecks, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { Header, Footer } from './components/layout'
import { ApartmentDetails } from './components/ApartmentDetails'
import { RankingView } from './components/RankingView'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'

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
]

function App() {
  const [criteria, setCriteria] = useState([])
  const [apartments, setApartments] = useState([])
  const [newApartmentName, setNewApartmentName] = useState('')
  const [newCriterionName, setNewCriterionName] = useState('')
  const [newCriterionCritical, setNewCriterionCritical] = useState(false)
  const [expandedApartments, setExpandedApartments] = useState(new Set())
  const [budgetMin, setBudgetMin] = useState(500)
  const [budgetMax, setBudgetMax] = useState(3000)

  useEffect(() => {
    const storedCriteria = localStorage.getItem('apartmentCriteria')
    const storedApartments = localStorage.getItem('apartments')
    const storedBudgetConfig = localStorage.getItem('budgetConfig')
    
    if (storedCriteria) {
      setCriteria(JSON.parse(storedCriteria))
    } else {
      setCriteria(DEFAULT_CRITERIA)
    }
    
    if (storedApartments) {
      setApartments(JSON.parse(storedApartments))
    }
    
    if (storedBudgetConfig) {
      const config = JSON.parse(storedBudgetConfig)
      setBudgetMin(config.min)
      setBudgetMax(config.max)
    }
  }, [])

  useEffect(() => {
    if (criteria.length > 0) {
      localStorage.setItem('apartmentCriteria', JSON.stringify(criteria))
    }
  }, [criteria])

  useEffect(() => {
    if (apartments.length > 0) {
      localStorage.setItem('apartments', JSON.stringify(apartments))
    }
  }, [apartments])

  useEffect(() => {
    localStorage.setItem('budgetConfig', JSON.stringify({ min: budgetMin, max: budgetMax }))
  }, [budgetMin, budgetMax])

  const addApartment = () => {
    if (!newApartmentName.trim()) return
    
    const newApartment = {
      id: Date.now(),
      name: newApartmentName.trim(),
      scores: criteria.reduce((acc, criterion) => {
        acc[criterion.id] = 5
        return acc
      }, {}),
      budget: '',
      externalLink: '',
      notes: '',
      exclusions: []
    }
    
    setApartments([...apartments, newApartment])
    setNewApartmentName('')
    setExpandedApartments(prev => new Set([...prev, newApartment.id]))
  }

  const deleteApartment = (id) => {
    const updatedApartments = apartments.filter(apt => apt.id !== id)
    setApartments(updatedApartments)
    localStorage.setItem('apartments', JSON.stringify(updatedApartments))
  }

  const updateScore = (apartmentId, criterionId, value) => {
    setApartments(apartments.map(apt => {
      if (apt.id === apartmentId) {
        return {
          ...apt,
          scores: { ...apt.scores, [criterionId]: value[0] }
        }
      }
      return apt
    }))
  }

  const updateApartment = (updatedApartment) => {
    setApartments(apartments.map(apt => 
      apt.id === updatedApartment.id ? updatedApartment : apt
    ))
  }

  const toggleCritical = (criterionId) => {
    setCriteria(criteria.map(c => 
      c.id === criterionId ? { ...c, critical: !c.critical } : c
    ))
  }

  const addCriterion = () => {
    if (!newCriterionName.trim()) return
    
    const newCriterion = {
      id: Date.now(),
      name: newCriterionName.trim(),
      critical: newCriterionCritical
    }
    
    setCriteria([...criteria, newCriterion])
    
    setApartments(apartments.map(apt => ({
      ...apt,
      scores: { ...apt.scores, [newCriterion.id]: 5 }
    })))
    
    setNewCriterionName('')
    setNewCriterionCritical(false)
  }

  const deleteCriterion = (criterionId) => {
    const updatedCriteria = criteria.filter(c => c.id !== criterionId)
    setCriteria(updatedCriteria)
    
    const updatedApartments = apartments.map(apt => {
      const newScores = { ...apt.scores }
      delete newScores[criterionId]
      return { ...apt, scores: newScores }
    })
    setApartments(updatedApartments)
  }

  const calculateTotalScore = (apartment) => {
    if (!apartment || !apartment.scores) return 0
    
    let totalScore = 0
    let totalWeight = 0
    
    criteria.forEach(criterion => {
      const score = apartment.scores[criterion.id] || 5
      const weight = criterion.critical ? 2 : 1
      totalScore += score * weight
      totalWeight += 10 * weight
    })
    
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('apartmentCriteria')
      localStorage.removeItem('apartments')
      setCriteria(DEFAULT_CRITERIA)
      setApartments([])
    }
  }

  const toggleApartment = (id) => {
    setExpandedApartments(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-teal-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/images/bkg-large-light.png')] bg-no-repeat bg-center opacity-20 animate-[spin_190s_linear_infinite]" style={{ backgroundSize: '150%' }}></div>
      <div className="relative z-10 flex flex-col min-h-screen">
      <Header onResetClick={resetData} />

      <main className="flex-1 container mx-auto px-3 md:px-6 py-8 w-full max-w-[98vw] md:max-w-[95vw]">
        <Tabs defaultValue="apartments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/60 rounded-lg p-1">
            <TabsTrigger value="apartments" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Apartments</span>
            </TabsTrigger>
            <TabsTrigger value="criteria" className="gap-2">
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">Criteria</span>
            </TabsTrigger>
            <TabsTrigger value="rankings" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Rankings</span>
            </TabsTrigger>
          </TabsList>

          {/* Criteria Tab */}
          <TabsContent value="criteria">
            <Card className="w-full bg-black/60">
              <CardHeader>
                <CardTitle>Scoring Criteria</CardTitle>
                <CardDescription>
                  Define and manage the criteria used to evaluate apartments. Critical criteria are weighted 2x.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 pb-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-primary">Budget Configuration</h3>
                  <p className="text-sm text-muted-foreground">Set your budget range to help score rent prices automatically</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetMin">Minimum Budget ($)</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(parseInt(e.target.value) || 0)}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetMax">Maximum Budget ($)</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(parseInt(e.target.value) || 0)}
                        placeholder="3000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {criteria.map(criterion => (
                    <div key={criterion.id} className="flex items-center justify-between p-4 bg-muted">
                      <label className="flex items-center gap-3 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={criterion.critical}
                          onChange={() => toggleCritical(criterion.id)}
                          className="w-5 h-5 accent-primary"
                        />
                        <span className={`text-sm font-medium ${criterion.critical ? 'text-primary' : ''}`}>
                          {criterion.name}
                          {criterion.critical && ' ⭐'}
                        </span>
                      </label>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCriterion(criterion.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Input
                    value={newCriterionName}
                    onChange={(e) => setNewCriterionName(e.target.value)}
                    placeholder="New criterion name"
                    onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
                  />
                  <label className="flex items-center gap-2 px-4 bg-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCriterionCritical}
                      onChange={(e) => setNewCriterionCritical(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Critical</span>
                  </label>
                  <Button onClick={addCriterion}>Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apartments Tab */}
          <TabsContent value="apartments" className="space-y-5">
            <Card className="w-full bg-black/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Apartments ({apartments.length})</CardTitle>
                    <CardDescription>Add and score apartments based on your criteria</CardDescription>
                  </div>
                  {apartments.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={resetData}>
                      Reset All Data
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    value={newApartmentName}
                    onChange={(e) => setNewApartmentName(e.target.value)}
                    placeholder="Apartment name or address"
                    onKeyPress={(e) => e.key === 'Enter' && addApartment()}
                  />
                  <Button onClick={addApartment}>Add Apartment</Button>
                </div>
              </CardContent>
            </Card>

            {apartments.length === 0 ? (
              <Card className="w-full bg-black/60">
                <CardContent className="text-center py-16">
                <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No apartments added yet</p>
                <p className="text-muted-foreground text-sm mt-2">Add your first apartment above to start scoring</p>
              </CardContent>
            </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {apartments.map(apartment => {
                      const isExpanded = expandedApartments.has(apartment.id)
                      return (
                      <Card key={apartment.id} className="bg-black/60">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <button 
                              onClick={() => toggleApartment(apartment.id)}
                              className="flex-1 text-left"
                            >
                              <CardTitle className="text-lg flex items-center gap-2">
                                {apartment.name}
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </CardTitle>
                            </button>
                            <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteApartment(apartment.id)}
                              className="text-destructive hover:text-destructive -mt-1"
                            >
                              ×
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-center py-6 bg-muted">
                            <div className="text-center">
                              <div className="text-5xl font-bold text-primary">
                                {calculateTotalScore(apartment)}%
                              </div>
                              <span className="text-sm text-muted-foreground mt-1">Overall Score</span>
                            </div>
                          </div>
                          
                          {isExpanded && (
                          <>
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {criteria.map(criterion => (
                              <div key={criterion.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className={`text-sm ${criterion.critical ? 'text-primary' : ''}`}>
                                    {criterion.name} {criterion.critical && '⭐'}
                                  </Label>
                                  <span className="text-sm font-bold text-secondary">
                                    {apartment.scores[criterion.id] || 5}/10
                                  </span>
                                </div>
                                <Slider
                                  value={[apartment.scores[criterion.id] || 5]}
                                  onValueChange={(value) => updateScore(apartment.id, criterion.id, value)}
                                  max={10}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>

                          <ApartmentDetails 
                            apartment={apartment}
                            onUpdate={updateApartment}
                          />
                          </>
                          )}
                        </CardContent>
                      </Card>
                    )})}
              </div>
            )}
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings">
            <Card className="w-full bg-black/60">
              <CardContent className="pt-6">
                <RankingView apartments={apartments} criteria={criteria} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      </div>
    </div>
  )
}

export default App
