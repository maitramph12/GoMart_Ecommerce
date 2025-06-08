"use client"
import Breadcrumb from "@/components/Common/Breadcrumb";
import { login } from "@/redux/features/auth-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { authService, LoginCredentials } from "@/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
});

const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoggedIn } = useAppSelector((state: any) => state.authReducer);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      console.log("data", data);

      dispatch(login(data));

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };



    // Redirect if already logged in
    useEffect(() => {
      if ( isLoggedIn && user) {
        if (user.role === 'admin') {
          router.push("/admin/products");
        } else {
          router.push("/");
        }
      }
    }, [ isLoggedIn , user, router]);
  
  return (
    <>
      <Breadcrumb title={"Đăng nhập"} pages={["Đăng nhập"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Đăng Nhập Vào Tài Khoản
              </h2>
              <p>Nhập thông tin của bạn bên dưới</p>
            </div>

            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Nhập email của bạn"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Mật khẩu
                  </label>

                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Nhập mật khẩu của bạn"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                {loginMutation.isError && (
                  <p className="text-red-500 text-center mt-4">
                    Đăng nhập thất bại. Vui lòng thử lại.
                  </p>
                )}

                <p className="text-center mt-6">
                  Bạn chưa có tài khoản?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Đăng ký ngay!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
