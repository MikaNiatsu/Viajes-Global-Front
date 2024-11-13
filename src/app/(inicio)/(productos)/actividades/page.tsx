"use client"

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { MapPin, DollarSign, Star, Tag } from 'lucide-react'
import Image from 'next/image'
import { Actividad } from '@/types/objects'

const mockActivities: Actividad[] = [
  { activity_id: 1, name: 'Tour por la ciudad', description: 'Explora los lugares más emblemáticos de la ciudad', price: 50, location: 'New York', category: 'Tour', images: [{ url: '/placeholder.svg', descripcion: 'Tour por la ciudad' }], rating: 4.5, stock: 20 },
  { activity_id: 2, name: 'Clase de surf', description: 'Aprende a surfear con instructores profesionales', price: 80, location: 'Hawaii', category: 'Deporte', images: [{ url: '/placeholder.svg', descripcion: 'Clase de surf' }], rating: 4.7, stock: 10 },
  { activity_id: 3, name: 'Cata de vinos', description: 'Degusta los mejores vinos de la región', price: 70, location: 'Napa Valley', category: 'Gastronomía', images: [{ url: '/placeholder.svg', descripcion: 'Cata de vinos' }], rating: 4.8, stock: 15 },
  { activity_id: 4, name: 'Senderismo', description: 'Recorre hermosos senderos naturales', price: 30, location: 'Yosemite', category: 'Aventura', images: [{ url: '/placeholder.svg', descripcion: 'Senderismo' }], rating: 4.6, stock: 25 },
  { activity_id: 5, name: 'Visita a museo', description: 'Explora fascinantes exhibiciones de arte e historia', price: 20, location: 'Washington D.C.', category: 'Cultura', images: [{ url: '/placeholder.svg', descripcion: 'Visita a museo' }], rating: 4.4, stock: 50 },
  { activity_id: 6, name: 'Paseo en globo', description: 'Disfruta de vistas panorámicas desde las alturas', price: 200, location: 'Albuquerque', category: 'Aventura', images: [{ url: '/placeholder.svg', descripcion: 'Paseo en globo' }], rating: 4.9, stock: 5 },
]

function ActivitySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activities, setActivities] = useState<Actividad[]>(mockActivities)
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'price')
  const [filterCategory, setFilterCategory] = useState<string>(searchParams.get('category') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '200'))

  useEffect(() => {
    let filteredActivities = [...mockActivities]

    if (filterCategory && filterCategory !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.category === filterCategory)
    }

    filteredActivities = filteredActivities.filter(activity => activity.price <= maxPrice)

    filteredActivities.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

    setActivities(filteredActivities)

    const params = new URLSearchParams()
    if (sortBy) params.set('sortBy', sortBy)
    if (filterCategory !== 'all') params.set('category', filterCategory)
    if (maxPrice !== 200) params.set('maxPrice', maxPrice.toString())

    router.push(`/actividades?${params.toString()}`)
  }, [sortBy, filterCategory, maxPrice, router])

  const categories = Array.from(new Set(mockActivities.map(activity => activity.category)))

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
        {activities.map(activity => (
          <Card key={activity.activity_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{activity.name}</span>
                <Tag className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={activity.images[0].url}
                  alt={activity.images[0].descripcion}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <p className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {activity.location}
              </p>
              <p className="flex items-center mb-2">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                {activity.rating.toFixed(1)}
              </p>
              <p className="text-sm mb-2">{activity.description}</p>
              <p className="text-sm mb-2">Categoría: {activity.category}</p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {activity.price}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={activity.stock === 0}>
                {activity.stock > 0 ? 'Reservar ahora' : 'Agotado'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
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