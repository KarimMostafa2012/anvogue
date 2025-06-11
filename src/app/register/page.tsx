"use client";
import React, { useState } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Register = () => {
  const handleRegister = (form: HTMLFormElement) => {
    const formData = {
      first_name: (form.elements.namedItem("firstName") as HTMLInputElement)
        .value,
      last_name: (form.elements.namedItem("secondName") as HTMLInputElement)
        .value,
      phone_number: (form.elements.namedItem("phone") as HTMLInputElement)
        .value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      // confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    };

    // إرسال الطلب AJAX
    fetch("https://api.malalshammobel.com/auth/api/users/", {
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
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("accessToken", data.access);
          window.sessionStorage.setItem("refreshToken", data.refresh);
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
        className="style-one bg-black"
        
      />
      <div id="header" className="relative w-full">
        <MenuOne className="bg-transparent" />
        <Breadcrumb
          heading="Create An Account"
          subHeading="Create An Account"
        />
      </div>
      <div className="register-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
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
                    id="firstName"
                    type="text"
                    placeholder="First Name *"
                    required
                  />
                </div>
                <div className="email mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="secondName"
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
                    id="phone"
                    type="phone"
                    placeholder="Phone Number with country code *"
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
                <div className="confirm-pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password *"
                    required
                  />
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
                  <label
                    htmlFor="remember"
                    className="pl-2 cursor-pointer text-secondary2"
                  >
                    I agree to the
                    <Link
                      href={"#!"}
                      className="text-black hover:underline pl-1"
                    >
                      Terms of User
                    </Link>
                  </label>
                </div>
                <div className="flex items-center mt-5">
                  <div className="block-input">
                    <input type="checkbox" name="terms" id="terms" />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label htmlFor="terms" className="pl-2 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <button className="button-main">Register</button>
                </div>
              </form>
            </div>
            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
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
