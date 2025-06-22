"use client";
import React, { useState } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        "https://malalshammobel.com/auth/api/users/reset_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, platform: "web" }),
        }
      );
      console.log(response)

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(result)
          ? result[0]
          : result?.message || "Something went wrong";
        throw new Error(errorMessage);
      }

      toast.success("Check your email to reset your password.");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb
          heading="Forget your password"
          subHeading="Forget your password"
        />
      </div>
      <div className="forgot-pass md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pe-[60px] md:pe-[40px] md:border-r border-line">
              <div className="heading4">Reset your password</div>
              <div className="body1 mt-2">
                We will send you an email to reset your password
              </div>
              <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                <div className="email">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Email address *"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <button
                    className="button-main bg-[#1F1F1F]"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
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

export default ForgotPassword;

// post request with uid, token and new password
// https://malalshammobel.com/auth/api/users/reset_password_confirm/
