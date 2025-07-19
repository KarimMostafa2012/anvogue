"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { initializeLanguage } from "@/redux/slices/languageSlice";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [passNotEqual, setPassNotEqual] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  const handleRegister = (form: HTMLFormElement) => {
    const checkbox = document.querySelector("#terms") as HTMLInputElement;
    if (!checkbox?.checked) return;
    if (
      (form.elements.namedItem("password") as HTMLInputElement).value !=
      (form.elements.namedItem("confirmPassword") as HTMLInputElement).value
    ) {
      setPassNotEqual(true);
      return;
    }

    const formData = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
        .value,
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
        .value,
      phone_number: (
        form.elements.namedItem("phone_number") as HTMLInputElement
      ).value,
    };

    fetch(`https://api.malalshammobel.com/auth/api/users/`, {
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
          setLoginError(data[Object.keys(data)[0]]);

          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (
          (document.querySelector("#remember") as HTMLInputElement)?.checked
        ) {
          window.localStorage.setItem("accessToken", data.access);
          window.localStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("loggedIn", "true");
        } else {
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("accessToken", data.access);
          window.sessionStorage.setItem("refreshToken", data.refresh);
        }
        window.location.href = window.location.origin;
      })
      .catch((error) => {
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

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb
          heading="Create An Account"
          subHeading="Create An Account"
        />
      </div>
      <div className="register-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pe-[60px] md:pe-[40px] ltr:md:border-r rtl:md:border-l border-line">
              <div className="heading4">Register</div>
              <form
                className="md:mt-7 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister(e.currentTarget);
                }}
              >
                <div className="email ">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="first_name"
                    type="text"
                    placeholder="First Name *"
                    required
                  />
                </div>
                <div className="email mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="last_name"
                    type="text"
                    placeholder="Second Name *"
                    required
                  />
                </div>
                <div className="email mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Email Address *"
                    required
                  />
                </div>
                <div className="email mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="phone_number"
                    type="phone"
                    placeholder="Phone Number with country code *"
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
                <div className="confirm-pass mt-5 relative">
                  <input
                    className={
                      "border-line px-4 pt-3 pb-3 w-full rounded-lg " +
                      (passNotEqual ? "!border-[red]" : "")
                    }
                    id="confirmPassword"
                    type={showConfPass ? "text" : "password"}
                    placeholder="Confirm Password *"
                    required
                  />
                  <Icon.Eye
                    className="absolute top-[50%] ltr:right-[24px] rtl:left-[24px] transform translate-y-[calc(-50%)] w-[24px] h-[24px] cursor-pointer"
                    onClick={() => {
                      setShowConfPass(true);
                    }}
                    style={{
                      display: showConfPass ? "none" : "block",
                    }}
                  />
                  <Icon.EyeClosed
                    className="absolute top-[50%] ltr:right-[24px] rtl:left-[24px] transform translate-y-[calc(-50%)] w-[24px] h-[24px] cursor-pointer"
                    onClick={() => {
                      setShowConfPass(false);
                    }}
                    style={{
                      display: showConfPass ? "block" : "none",
                    }}
                  />
                </div>
                {loginError && (
                  <div className="text-[red] font-medium my-4 text-left">
                    {loginError}
                  </div>
                )}
                <div className="flex items-center mt-5">
                  <div className="block-input">
                    <input type="checkbox" name="terms" id="terms" required />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="ps-2 cursor-pointer text-secondary2"
                  >
                    I agree to the
                    <Link
                      href={"#!"}
                      className="text-black hover:underline ps-1"
                    >
                      Terms of User
                    </Link>
                  </label>
                </div>
                <div className="flex items-center mt-5">
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
                <div className="mt-[32px] flex gap-[16px] cursor-pointer border-[1px] border-[#ddd] rounded-[12px] py-[12px] px-[12px] items-center bg-[#1f1f1f] text-white font-bold justify-center duration-300 hover:bg-[#D2EF9A] hover:text-[#1F1F1F]">
                  <button>Register</button>
                </div>
              </form>
              <div
                className="mt-[32px] flex gap-[16px] cursor-pointer border-[1px] border-[#ddd] rounded-[12px] py-[12px] px-[12px] items-center bg-[#1f1f1f] text-white font-bold justify-center duration-300 hover:bg-[#D2EF9A] hover:text-[#1F1F1F]"
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
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{String.raw`'re`} thrilled to
                  have you with us again!
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <Link href={"/login"} className="button-main">
                    Login
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

export default Register;
