"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  full_name: z.string().min(2, 'Full name is required'),
  bio: z.string().optional(),
  dance_style: z.string().optional(),
  team_affiliation: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  userId: string;
  initialData?: ProfileFormValues;
}

export default function ProfileEditForm({ userId, initialData }: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const supabase = createClient();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });
  
  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof ProfileFormValues, value);
      });
      setTags(initialData.tags || []);
    }
  }, [initialData, setValue]);
  
  // Update the tags field in the form when tags state changes
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.full_name,
          bio: data.bio || null,
          dance_style: data.dance_style || null,
          team_affiliation: data.team_affiliation || null,
          tags: tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) {
        throw updateError;
      }
      
      router.push('/profile');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register('username')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          {...register('full_name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="dance_style" className="block text-sm font-medium text-gray-700 mb-1">
          Dance Style
        </label>
        <input
          id="dance_style"
          type="text"
          {...register('dance_style')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="team_affiliation" className="block text-sm font-medium text-gray-700 mb-1">
          Team Affiliation
        </label>
        <input
          id="team_affiliation"
          type="text"
          {...register('team_affiliation')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a tag and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
} 