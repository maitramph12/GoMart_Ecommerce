'use client';

import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICategory } from '@/models/Category';

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

export default function AddCategoryPage() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      isActive: true,
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: (data: FormValues) => categoryService.create(data),
    onSuccess: () => {
      toast.success('Danh mục đã được thêm thành công');
      router.push('/admin/categories');
    },
    onError: (error) => {
      toast.error('Không thể thêm danh mục');
      console.error('Error adding category:', error);
    },
  });

  const onSubmit = handleSubmit((data: FormValues) => {
    console.log("Form Data:", data);
    addCategoryMutation.mutate(data);
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm danh mục mới</h1>
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
                  disabled={addCategoryMutation.isPending}
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
                  disabled={addCategoryMutation.isPending}
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
                  disabled={addCategoryMutation.isPending}
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
                    disabled={addCategoryMutation.isPending}
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
            disabled={addCategoryMutation.isPending}
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            disabled={addCategoryMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addCategoryMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang thêm...
              </div>
            ) : (
              'Thêm danh mục'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 