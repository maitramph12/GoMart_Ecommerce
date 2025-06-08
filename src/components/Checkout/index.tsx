"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Billing from "./Billing";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatPrice } from "@/utils/format";
import { clearCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CartItem {
  _id: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  postalCode: string;
  city: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required("Tên là bắt buộc"),
  lastName: yup.string().required("Họ là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: yup.string().required("Số điện thoại là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  notes: yup.string().optional(),
});

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items) as unknown as CartItem[];

  

  const totalPrice = useSelector(selectTotalPrice);

  const authState = useAppSelector((state: any) => state.authReducer);


  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema) as any,
  });

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    try {
      if(!authState.user) {
        router.push("/login");
        return;
      }
      const orderData = {
        user: authState.user._id,
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : ''
        })),
        totalAmount: totalPrice,
        shippingAddress: {
          fullName: `${data.firstName} ${data.lastName}`,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          phone: data.phone
        },
        paymentMethod: 'cod', // Default to cash on delivery
        note: data.notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      console.log('Order created:', result);


      //clear cart
      dispatch(clearCart());


      router.push("/");


      toast.success("Đơn hàng đã được tạo thành công");

      
      // Here you can add navigation to success page or show success message
      // router.push('/checkout/success');
    } catch (error) {
      console.error('Error creating order:', error);
      // Here you can add error handling UI
    }
  };


  const getErrorMessage = (error: any) => {
    return error?.message || "Vui lòng nhập thông tin này";
  };

  return (
    <>
      <Breadcrumb title={"Thanh toán"} pages={["Thanh toán"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- phần trái thanh toán --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- hộp đăng nhập --> */}
                {/* <Login /> */}

                {/* <!-- chi tiết thanh toán --> */}
                <Billing register={register} errors={errors} />

                {/* <!-- hộp ghi chú khác --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Ghi chú khác (tùy chọn)
                    </label>

                    <textarea
                      {...register("notes")}
                      rows={5}
                      placeholder="Ghi chú về đơn hàng của bạn, ví dụ: ghi chú đặc biệt cho việc giao hàng."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                    {errors.notes && (
                      <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.notes)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* <!-- phần phải thanh toán --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- hộp danh sách đơn hàng --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- tiêu đề --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Sản phẩm</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Tạm tính
                        </h4>
                      </div>
                    </div>

                    {/* <!-- danh sách sản phẩm --> */}
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.name}</p>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                    {/* <!-- tổng cộng --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Tổng cộng</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {formatPrice(totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- nút thanh toán --> */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
