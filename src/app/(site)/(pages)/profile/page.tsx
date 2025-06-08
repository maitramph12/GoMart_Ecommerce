"use client";

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserProfile>();

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load profile');
    }
  }, [error]);

  const updateProfileMutation = useMutation<UserProfile, Error, UserProfile>({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const onSubmit = async (data: UserProfile) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Profile" pages={["Profile"]} />
      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
            <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block mb-2.5 text-dark">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full rounded-md border border-gray-3 bg-gray-1 p-3 outline-none focus:border-blue focus:ring-1 focus:ring-blue"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.type === 'required' ? 'Name is required' : ''}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2.5 text-dark">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full rounded-md border border-gray-3 bg-gray-1 p-3 outline-none focus:border-blue focus:ring-1 focus:ring-blue"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.type === 'required' ? 'Email is required' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cập nhật...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
} 