"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { initializeLanguage } from "@/redux/slices/languageSlice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const dispatch = useDispatch<AppDispatch>();
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  const handleLogin = (form: HTMLFormElement) => {
    const formData = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      // confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    };

    fetch(`https://api.malalshammobel.com/auth/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json(); // always parse JSON response

        if (!response.ok) {
          setLoginError(data.detail);
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return data;
      })
      .then((data) => {
        // معالجة الاستجابة الناجحة
        if (
          (document.querySelector("#remember") as HTMLInputElement)?.checked
        ) {
          window.localStorage.setItem("accessToken", data.access);
          window.localStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("accessToken", data.access);
          window.sessionStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("loggedIn", "true");
        } else {
          window.sessionStorage.setItem("accessToken", data.access);
          window.sessionStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("loggedIn", "true");
        }
        window.location.href = window.location.origin;
      })
      .catch((error) => {
        // معالجة الأخطاء
        console.error("Error:", error);
      });
  };

  const googleSubmit = () => {
    fetch(`https://api.malalshammobel.com/auth/google-auth/?platform=web`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        router.push(`${data.google_login_url}`);
      });
  };
  //localhost:3000/google-auth?state=3f590309-ccf6-4aad-88a7-ac8d771acf80&code=4%2F0AVMBsJgN0t_HIKw9tlHS-WaPdtex-soBCgnVHoGNc8uKsQ1NDnwtaF4aI5-VCLkpRjSJ5g&scope=email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20openid&authuser=0&prompt=consent
  http: return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" lang={currentLanguage} />
        <Breadcrumb heading="Login" subHeading="Login" />
      </div>
      <div className="login-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pe-[60px] md:pe-[40px] ltr:md:border-r rtl:md:border-l border-line">
              <div className="heading4">Login</div>
              <form
                className="md:mt-7 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(e.currentTarget);
                }}
              >
                <div className="email ">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Email Address *"
                    required
                  />
                </div>
                <div className="pass mt-5 relative">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Password *"
                    required
                  />
                  <Icon.Eye
                    className="absolute top-[50%] ltr:right-[24px] rtl:left-[24px] transform translate-y-[calc(-50%)] w-[24px] h-[24px] cursor-pointer"
                    onClick={() => {
                      setShowPass(true);
                    }}
                    style={{
                      display: showPass ? "none" : "block",
                    }}
                  />
                  <Icon.EyeClosed
                    className="absolute top-[50%] ltr:right-[24px] rtl:left-[24px] transform translate-y-[calc(-50%)] w-[24px] h-[24px] cursor-pointer"
                    onClick={() => {
                      setShowPass(false);
                    }}
                    style={{
                      display: showPass ? "block" : "none",
                    }}
                  />
                </div>
                {loginError && (
                  <div className="text-[red] font-medium my-4 text-left">
                    {loginError}
                  </div>
                )}
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center">
                    <div className="block-input">
                      <input type="checkbox" name="remember" id="remember" />
                      <Icon.CheckSquare
                        size={20}
                        weight="fill"
                        className="icon-checkbox"
                      />
                    </div>
                    <label htmlFor="remember" className="ps-2 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href={"/forgot-password"}
                    className="font-semibold hover:underline"
                  >
                    Forgot Your Password?
                  </Link>
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <button className="button-main">Login</button>
                </div>
              </form>
              <div
                className="mt-[32px] flex gap-[16px] cursor-pointer border-[1px] border-[#ddd] rounded-[12px] py-[12px] px-[12px] items-center bg-[#1f1f1f] hover:bg-[#1f1f1fea] text-white font-bold justify-center duration-300"
                onClick={googleSubmit}
              >
                <span>
                  <img
                    src="/images/other/google-icon.svg"
                    className="w-[24px]"
                    alt="Google"
                  />
                </span>
                <span>Login Using Google</span>
              </div>
            </div>
            <div className="right md:w-1/2 w-full lg:ps-[60px] md:ps-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">New Customer</div>
                <div className="mt-2 text-secondary">
                  Be part of our growing family of new customers! Join us today
                  and unlock a world of exclusive benefits, offers, and
                  personalized experiences.
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <Link href={"/register"} className="button-main">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
