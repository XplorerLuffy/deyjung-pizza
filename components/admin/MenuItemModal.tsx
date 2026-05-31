'use client'

import React, { useState, useEffect, useRef } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import type { MenuItem, Category } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface MenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  item?: MenuItem | null
  categories: Category[]
  onSaved: (item: MenuItem) => void
}

export default function MenuItemModal({
  isOpen,
  onClose,
  item,
  categories,
  onSaved,
}: MenuItemModalProps) {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [emoji, setEmoji] = useState('🍕')
  const [isPopular, setIsPopular] = useState(false)
  const [isSpicy, setIsSpicy] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (item) {
      setName(item.name)
      setDescription(item.description ?? '')
      setPrice(item.price.toString())
      setCategoryId(item.category_id ?? '')
      setEmoji(item.emoji)
      setIsPopular(item.is_popular)
      setIsSpicy(item.is_spicy)
      setIsAvailable(item.is_available)
      setImagePreview(item.image_url)
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setCategoryId('')
      setEmoji('🍕')
      setIsPopular(false)
      setIsSpicy(false)
      setIsAvailable(true)
      setImagePreview(null)
    }
    setImageFile(null)
    setErrors({})
  }, [item, isOpen])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = 'Valid price required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)

    try {
      let imageUrl: string | null = item?.image_url ?? null

      // Upload image if selected
      if (imageFile) {
        const supabase = createClient()
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
        const { error: uploadError } = await supabase.storage
          .from('menu-images')
          .upload(filename, imageFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('menu-images')
            .getPublicUrl(filename)
          imageUrl = publicUrl
        }
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: Number(price),
        category_id: categoryId || null,
        emoji,
        image_url: imageUrl,
        is_popular: isPopular,
        is_spicy: isSpicy,
        is_available: isAvailable,
      }

      const url = item ? `/api/menu/items/${item.id}` : '/api/menu/items'
      const method = item ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save')

      const saved = await res.json() as MenuItem
      onSaved(saved)
      toast.success(`${item ? 'Updated' : 'Added'} ${name} successfully!`)
      onClose()
    } catch {
      toast.error('Failed to save item. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Menu Item' : 'Add Menu Item'}
      size="md"
    >
      <div className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="text-sm text-brand-muted font-medium block mb-2">Image</label>
          <div
            className="relative w-full h-40 bg-surface-light border border-gold/20 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-brand-muted">
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="text-xs">Click to upload image</div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Name"
            placeholder="Margherita Pizza"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Emoji"
            placeholder="🍕"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Fresh tomato sauce, mozzarella, basil..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (Nu.)"
            placeholder="250"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-brand-muted font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-gold/20 rounded-lg text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '⭐ Popular', value: isPopular, setter: setIsPopular },
            { label: '🌶️ Spicy', value: isSpicy, setter: setIsSpicy },
            { label: '✓ Available', value: isAvailable, setter: setIsAvailable },
          ].map(({ label, value, setter }) => (
            <button
              key={label}
              type="button"
              onClick={() => setter(!value)}
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                value
                  ? 'border-gold bg-gold/20 text-gold'
                  : 'border-gold/20 text-brand-muted hover:border-gold/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1 justify-center" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1 justify-center" loading={saving} onClick={handleSave}>
            {item ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
