"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { changeLanguage, initializeLanguage } from '@/redux/slices/languageSlice';
import { AppDispatch } from '@/redux/store';
import localStorageUtil from '@/utils/localStorageUtil';

const Login = () => {
  const currentLanguage = useSelector((state: RootState) => state.language);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);
  
  const handleLogin = (form: HTMLFormElement) => {
    const formData = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      // confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    };


    fetch(`https://api.malalshammobel.com/auth/api/token/?lang=${currentLanguage}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // معالجة الاستجابة الناجحة
        if ((document.querySelector("#remember") as HTMLInputElement)?.checked) {
          window.localStorage.setItem("accessToken", data.access);
          window.localStorage.setItem("refreshToken", data.refresh);
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

  return (
    <>
      <TopNavOne
        props="style-one bg-black"

      />
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
                <div className="pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="password"
                    type="password"
                    placeholder="Password *"
                    required
                  />
                </div>
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
