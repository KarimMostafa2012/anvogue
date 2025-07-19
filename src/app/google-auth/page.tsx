"use client";

import React, { useEffect } from "react";
import Loading from "@/components/Other/Loading";
import { useSearchParams } from "next/navigation";

const GoogleAuth = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");
    const platform = "web";

    if (!state || !code || !platform) return;

    const fetchAuthCallback = async () => {
      try {
        const query = new URLSearchParams({ state, code, platform }).toString();
        const response = await fetch(
          `https://api.malalshammobel.com/auth/google-auth/callback/?${query}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
            window.location.href = "/login";
          return;
        }
        const result = await response.json();
        window.localStorage.setItem("accessToken", result.access_token);
        window.localStorage.setItem("refreshToken", result.refresh_token);
        window.sessionStorage.setItem("accessToken", result.access_token);
        window.sessionStorage.setItem("refreshToken", result.refresh_token);
        window.sessionStorage.setItem("loggedIn", "true");
        window.location.href = "/";
        // 👉 You can handle redirect, token storage, or error messages here.
      } catch (error) {
        console.error("Google Auth failed:", error);
      }
    };

    fetchAuthCallback();
  }, [searchParams]);

  return (
    <div className="h-screen w-full justify-center items-center flex">
      <Loading />
    </div>
  );
};

export default GoogleAuth;
