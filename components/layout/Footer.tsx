"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t } = useTranslation("common");

  // Helper function to ensure string output
  const getTranslation = (key: string): string => {
    const translation = t(key);
    return typeof translation === 'string' ? translation : String(translation);
  };

  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo">
                  <Link href="/">
                    <Image
                      src="/images/logo.png"
                      alt="Anvogue"
                      width={150}
                      height={40}
                    />
                  </Link>
                </div>
                <div className="footer-about">
                  <p>{getTranslation("footer.aboutText")}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h3 className="footer-title">{getTranslation("footer.contact")}</h3>
                <ul className="footer-contact">
                  <li>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{getTranslation("footer.address")}:</span> {getTranslation("footer.addressText")}
                  </li>
                  <li>
                    <i className="fas fa-phone"></i>
                    <span>{getTranslation("footer.phone")}:</span> {getTranslation("footer.phoneText")}
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i>
                    <span>{getTranslation("footer.email")}:</span> {getTranslation("footer.emailText")}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h3 className="footer-title">{getTranslation("footer.newsletter")}</h3>
                <p>{getTranslation("footer.newsletterText")}</p>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder={getTranslation("footer.enterEmail")}
                    required
                  />
                  <button type="submit">{getTranslation("footer.subscribe")}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="copyright">
                <p>
                  © {new Date().getFullYear()} {getTranslation("footer.copyright")} -{" "}
                  {getTranslation("footer.company")}. {getTranslation("footer.rights")}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-right">
                <p>
                  {getTranslation("footer.poweredBy")} <Link href="/">{getTranslation("footer.company")}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 