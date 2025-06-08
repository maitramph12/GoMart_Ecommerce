'use client';

import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IUser } from '@/models/User';
import React from 'react';

interface FormValues {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required('Tên người dùng là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .optional(),
  role: yup.string().oneOf(['admin', 'user'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),
  isActive: yup.boolean().required('Trạng thái là bắt buộc'),
}) as yup.ObjectSchema<FormValues>;

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    }
  });

  // Fetch user data
  const { data: user, isPending: isUserLoading, error: userError } = useQuery<IUser>({
    queryKey: ['user', params.id],
    queryFn: () => userService.getById(params.id),
  });

  // Reset form when user data is loaded
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  const updateUserMutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Only include password if it's provided
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      return userService.update(params.id, updateData);
    },
    onSuccess: () => {
      toast.success('Người dùng đã được cập nhật thành công');
      router.push('/admin/users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật người dùng');
      console.error('Error updating user:', error);
    },
  });

  const onSubmit = handleSubmit((data: FormValues) => {
    console.log("Form Data:", data);
    updateUserMutation.mutate(data);
  });

  const getErrorMessage = (error: FieldErrors<FormValues>[keyof FormValues]) => {
    return (error as { message?: string })?.message || '';
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không thể tải thông tin người dùng</p>
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

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không tìm thấy người dùng</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
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
              Tên người dùng
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateUserMutation.isPending}
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.name)}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateUserMutation.isPending}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.email)}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới (để trống nếu không muốn thay đổi)
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateUserMutation.isPending}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.password)}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updateUserMutation.isPending}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              )}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.role)}</p>
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
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
              <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
            </label>
            {errors.isActive && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.isActive)}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={updateUserMutation.isPending}
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {updateUserMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </div>
            ) : (
              'Cập nhật người dùng'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 