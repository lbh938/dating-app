'use client'
import { useState } from 'react'
import { FaFilter, FaMapMarkerAlt, FaVenusMars, FaHeart, FaGamepad } from 'react-icons/fa'

type Filters = {
  gender: string[]
  seekingGender: string[]
  city: string
  interests: string[]
  ageRange: [number, number]
}

type FilterBarProps = {
  onFilterChange: (filters: Filters) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    gender: [],
    seekingGender: [],
    city: '',
    interests: [],
    ageRange: [18, 99]
  })

  const genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'non-binary', label: 'Non-binaire' }
  ]

  const interestOptions = [
    'Sport', 'Musique', 'Cinéma', 'Voyage', 'Art',
    'Gaming', 'Lecture', 'Cuisine', 'Danse', 'Tech'
  ]

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        {/* Barre de filtres compacte */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white"
            >
              <FaFilter />
              <span>Filtres</span>
            </button>

            {/* Quick filters */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/60">Filtres rapides:</span>
              <button className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors text-sm">
                En ligne
              </button>
              <button className="px-3 py-1 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors text-sm">
                Nouveaux
              </button>
              <button className="px-3 py-1 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors text-sm">
                Vérifiés
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>20 profils trouvés</span>
          </div>
        </div>

        {/* Panneau de filtres détaillé */}
        {isOpen && (
          <div className="py-6 border-t border-white/10 space-y-6">
            {/* Genre et Orientation */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Genre */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white">
                  <FaVenusMars />
                  <span>Je suis</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange({
                        gender: filters.gender.includes(option.value)
                          ? filters.gender.filter(g => g !== option.value)
                          : [...filters.gender, option.value]
                      })}
                      className={`px-4 py-2 rounded-xl transition-colors ${
                        filters.gender.includes(option.value)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white">
                  <FaHeart />
                  <span>Je recherche</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange({
                        seekingGender: filters.seekingGender.includes(option.value)
                          ? filters.seekingGender.filter(g => g !== option.value)
                          : [...filters.seekingGender, option.value]
                      })}
                      className={`px-4 py-2 rounded-xl transition-colors ${
                        filters.seekingGender.includes(option.value)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white">
                <FaMapMarkerAlt />
                <span>Ville</span>
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                placeholder="Entrez une ville..."
                className="w-full max-w-md px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Centres d'intérêt */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white">
                <FaGamepad />
                <span>Centres d'intérêt</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleFilterChange({
                      interests: filters.interests.includes(interest)
                        ? filters.interests.filter(i => i !== interest)
                        : [...filters.interests, interest]
                    })}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      filters.interests.includes(interest)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Tranche d'âge */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white">
                <span>Tranche d'âge: {filters.ageRange[0]} - {filters.ageRange[1]} ans</span>
              </label>
              <div className="flex items-center gap-4 max-w-md">
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange({
                    ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                  })}
                  className="w-full"
                />
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange({
                    ageRange: [filters.ageRange[0], parseInt(e.target.value)]
                  })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 