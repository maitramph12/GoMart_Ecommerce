'use client';

import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICategory } from '@/models/Category';
import React from 'react';

interface FormValues {
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
}

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required('Tên danh mục là bắt buộc'),
  description: yup.string().required('Mô tả là bắt buộc'),
  slug: yup.string().required('Slug là bắt buộc'),
  isActive: yup.boolean().required('Trạng thái là bắt buộc'),
}) as yup.ObjectSchema<FormValues>;

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      isActive: true,
    }
  });

  // Fetch category data
  const { data: category, isPending: isCategoryLoading, error: categoryError } = useQuery<ICategory>({
    queryKey: ['category', params.id],
    queryFn: () => categoryService.getById(params.id),
  });

  // Reset form when category data is loaded
  React.useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        slug: category.slug,
        isActive: category.isActive,
      });
    }
  }, [category, reset]);

  const updateCategoryMutation = useMutation({
    mutationFn: (data: FormValues) => categoryService.update(params.id, data),
    onSuccess: () => {
      toast.success('Danh mục đã được cập nhật thành công');
      router.push('/admin/categories');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật danh mục');
      console.error('Error updating category:', error);
    },
  });

  const onSubmit = handleSubmit((data: FormValues) => {
    console.log("Form Data:", data);
    updateCategoryMutation.mutate(data);
  });

  if (isCategoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin danh mục...</p>
        </div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không thể tải thông tin danh mục</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không tìm thấy danh mục</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa danh mục</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateCategoryMutation.isPending}
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateCategoryMutation.isPending}
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn (Slug)
            </label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateCategoryMutation.isPending}
                />
              )}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={updateCategoryMutation.isPending}
                  />
                )}
              />
              <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
            </label>
            {errors.isActive && (
              <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={updateCategoryMutation.isPending}
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            disabled={updateCategoryMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {updateCategoryMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </div>
            ) : (
              'Cập nhật danh mục'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 