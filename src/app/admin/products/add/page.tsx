'use client';

import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IProduct } from '@/models/Product';
import { ICategory } from '@/models/Category';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field'; // Import CurrencyInput

interface FormValues {
  name: string;
  category: string;
  price: number;
  discountedPrice: number;
  stock: number;
  description: string;
  images: { url: string }[];
  slug: string;
}

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  category: yup.string().required('Danh mục là bắt buộc'),
  price: yup.number()
    .required('Giá là bắt buộc')
    .min(0, 'Giá không được âm')
    .typeError('Giá phải là số'),
  discountedPrice: yup.number()
    .min(0, 'Giá khuyến mãi không được âm')
    .typeError('Giá khuyến mãi phải là số')
    .test('lessThanPrice', 'Giá khuyến mãi phải nhỏ hơn giá gốc', function(value) {
      // Allow discountedPrice to be 0 if price is also 0 or empty (no discount)
      if (value === 0 && (this.parent.price === 0 || this.parent.price === null || this.parent.price === undefined)) {
        return true;
      }
      return !value || value < this.parent.price;
    }),
  slug: yup.string().required('Slug là bắt buộc'),
  stock: yup.number()
    .required('Số lượng là bắt buộc')
    .min(0, 'Số lượng không được âm')
    .integer('Số lượng phải là số nguyên')
    .typeError('Số lượng phải là số'),
  description: yup.string().required('Mô tả là bắt buộc'),
  images: yup.array().of(
    yup.object().shape({
      url: yup.string().url('Đường dẫn hình ảnh không hợp lệ').required('Đường dẫn hình ảnh là bắt buộc')
    })
  ).min(1, 'Cần ít nhất 1 hình ảnh'),
});

export default function AddProductPage() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      discountedPrice: 0,
      stock: 0,
      description: '',
      slug: '',
      images: [{ url: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const { data: categories, isPending: isCategoriesLoading } = useQuery<ICategory[]>({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const addProductMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const productData: Partial<IProduct> = {
        ...data,
        images: data.images.map(img => img.url),
        category: data.category as any,
      };
      return productService.create(productData);
    },
    onSuccess: () => {
      toast.success('Sản phẩm đã được thêm thành công');
      router.push('/admin/products');
    },
    onError: (error) => {
      toast.error('Không thể thêm sản phẩm');
      console.error('Error adding product:', error);
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    addProductMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 "
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCategoriesLoading}
                >
                  <option value="">
                    {isCategoriesLoading ? 'Đang tải danh mục...' : 'Chọn danh mục'}
                  </option>
                  {categories?.map((category: ICategory) => (
                    <option key={category._id.toString()} value={category._id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Giá
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="price"
                  name="price"
                  placeholder="Nhập giá"
                  value={field.value} // Use the numeric value from RHF
                  onValueChange={(value, name, values) => {
                    // value is the raw numeric value
                    field.onChange(value ? parseFloat(value) : 0); // Update RHF with the number
                  }}
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }} // Vietnam Dong format
                  decimalScale={0} // No decimal places for VND
                  groupSeparator="." // Thousand separator
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi
            </label>
            <Controller
              name="discountedPrice"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="discountedPrice"
                  name="discountedPrice"
                  placeholder="Nhập giá khuyến mãi"
                  value={field.value} // Use the numeric value from RHF
                  onValueChange={(value, name, values) => {
                    field.onChange(value ? parseFloat(value) : 0); // Update RHF with the number
                  }}
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }} // Vietnam Dong format
                  decimalScale={0} // No decimal places for VND
                  groupSeparator="." // Thousand separator
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.discountedPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.discountedPrice.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng trong kho
            </label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
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
                />
              )}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Dynamic Image Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh sản phẩm
          </label>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <Controller
                name={`images.${index}.url`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nhập đường dẫn hình ảnh"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.images?.[index]?.url && (
                <p className="text-sm text-red-600">{errors.images[index]?.url?.message}</p>
              )}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-600 hover:text-red-800 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {errors.images?.message && typeof errors.images.message === 'string' && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}

          <button
            type="button"
            onClick={() => append({ url: '' })}
            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm ảnh
          </button>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả sản phẩm
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            disabled={addProductMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 "
          >
            {addProductMutation.isPending ? 'Đang thêm...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}