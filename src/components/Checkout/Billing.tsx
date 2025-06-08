import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

interface BillingProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

const Billing = ({ register, errors }: BillingProps) => {
  const getErrorMessage = (error: any) => {
    return error?.message || "Vui lòng nhập thông tin này";
  };

  return (
    <div >
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Chi tiết thanh toán
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              Tên <span className="text-red">*</span>
            </label>

            <input
              type="text"
              {...register("firstName")}
              placeholder="Nguyễn"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.firstName)}</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              Họ <span className="text-red">*</span>
            </label>

            <input
              type="text"
              {...register("lastName")}
              placeholder="Văn A"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.lastName)}</p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2.5">
            Email <span className="text-red">*</span>
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="example@email.com"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Điện thoại <span className="text-red">*</span>
          </label>

          <input
            type="text"
            {...register("phone")}
            placeholder="0123456789"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.phone)}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Địa chỉ <span className="text-red">*</span>
          </label>

          <input
            type="text"
            {...register("address")}
            placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.address)}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5">
            Thành phố <span className="text-red">*</span>
          </label>

          <input
            type="text"
            {...register("city")}
            placeholder="Nhập tên thành phố"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.city)}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="postalCode" className="block mb-2.5">
            Mã bưu điện <span className="text-red">*</span>
          </label>

          <input
            type="text"
            {...register("postalCode")}
            placeholder="Nhập mã bưu điện"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.postalCode)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
