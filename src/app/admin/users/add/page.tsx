'use client';

import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IUser } from '@/models/User';

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required('Tên người dùng là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: yup.string().oneOf(['admin', 'user'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),
  isActive: yup.boolean().required('Trạng thái là bắt buộc'),
}) as yup.ObjectSchema<FormValues>;

export default function AddUserPage() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    }
  });

  const addUserMutation = useMutation({
    mutationFn: (data: FormValues) => userService.create(data),
    onSuccess: () => {
      toast.success('Người dùng đã được thêm thành công');
      router.push('/admin/users');
    },
    onError: (error) => {
      toast.error('Không thể thêm người dùng');
      console.error('Error adding user:', error);
    },
  });

  const onSubmit = handleSubmit((data: FormValues) => {
    console.log("Form Data:", data);
    addUserMutation.mutate(data);
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm người dùng mới</h1>
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
                  disabled={addUserMutation.isPending}
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                  disabled={addUserMutation.isPending}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={addUserMutation.isPending}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
                  disabled={addUserMutation.isPending}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              )}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
                    disabled={addUserMutation.isPending}
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
            disabled={addUserMutation.isPending}
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            disabled={addUserMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addUserMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang thêm...
              </div>
            ) : (
              'Thêm người dùng'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 