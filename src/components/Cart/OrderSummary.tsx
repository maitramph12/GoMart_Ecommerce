import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { formatPrice } from "@/utils/format";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const authState = useAppSelector((state: any) => state.authReducer);
  const router = useRouter();
  const handleCheckout = () => {
    console.log("checkout");



    if(authState.user) {
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };
  return (
    <div className="lg:max-w-full w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Thông tin thanh toán</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Sản phẩm</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Giá tiền</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.name}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  {formatPrice(item.discountedPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Tổng tiền</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
          onClick={handleCheckout}
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
