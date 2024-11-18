'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from 'lucide-react'
import { Actividad } from '@/types/objects'
import ActivityCard from '@/components/activityCard'

function ActivitySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [allActivities, setAllActivities] = useState<Actividad[]>([])
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'price')
  const [filterCategory, setFilterCategory] = useState<string>(searchParams.get('category') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '200'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}activities/showAll`)
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        const data: Actividad[] = await response.json()
        setAllActivities(data)
      } catch (err) {
        setError('Error al cargar las actividades. Por favor, intenta de nuevo más tarde.')
        console.error('Error fetching activities:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const filteredAndSortedActivities = useMemo(() => {
    let result = [...allActivities]

    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(activity => activity.category === filterCategory)
    }

    result = result.filter(activity => activity.price <= maxPrice)

    result.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

    return result
  }, [allActivities, filterCategory, maxPrice, sortBy])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (sortBy) params.set('sortBy', sortBy)
    if (filterCategory !== 'all') params.set('category', filterCategory)
    if (maxPrice !== 200) params.set('maxPrice', maxPrice.toString())

    router.push(`/actividades?${params.toString()}`, { scroll: false })
  }, [sortBy, filterCategory, maxPrice, router, searchParams])

  const categories = useMemo(() => Array.from(new Set(allActivities.map(activity => activity.category))), [allActivities])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Actividades Disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Seleccionar orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filterCategory">Filtrar por categoría</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger id="filterCategory">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxPrice">Precio máximo: ${maxPrice}</Label>
          <Slider
            id="maxPrice"
            min={0}
            max={200}
            step={10}
            value={[maxPrice]}
            onValueChange={(value) => setMaxPrice(value[0])}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedActivities.map(activity => (
          <ActivityCard key={activity.activity_id} activity={activity} />
        ))}
      </div>

      {filteredAndSortedActivities.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No se encontraron actividades que coincidan con los criterios de búsqueda.</p>
      )}
    </div>
  )
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ActivitySearch />
    </Suspense>
  )
}