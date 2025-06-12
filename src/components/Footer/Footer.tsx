'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <>
            <div id="footer" className='footer'>
                <div className="footer-main bg-surface">
                    <div className="container">
                        <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                            <div className="company-infor basis-1/4 max-lg:basis-full pe-7">
                                <Link href={'/'} className="logo">
                                    <div className="heading4">{t('footer.company.name')}</div>
                                </Link>
                                <div className='flex gap-3 mt-3'>
                                    <div className="flex flex-col ">
                                        <span className="text-button">{t('footer.labels.mail')}:</span>
                                        <span className="text-button mt-3">{t('footer.labels.phone')}:</span>
                                        <span className="text-button mt-3">{t('footer.labels.address')}:</span>
                                    </div>
                                    <div className="flex flex-col ">
                                        <span className=''>{t('footer.company.mail')}</span>
                                        <span className='mt-3'>{t('footer.company.phone')}</span>
                                        <span className='mt-3 pt-px'>{t('footer.company.address')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                                <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">{t('footer.links.information')}</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/contact'}>{t('footer.links.contact')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'#!'}>{t('footer.links.career')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/my-account'}>{t('footer.links.myAccount')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>{t('footer.links.orderReturns')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.links.faqs')}</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">{t('footer.quickShop.title')}</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/shop/breadcrumb1'}>{t('footer.quickShop.women')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/breadcrumb1'}>{t('footer.quickShop.men')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/breadcrumb1'}>{t('footer.quickShop.clothes')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/breadcrumb1'}>{t('footer.quickShop.accessories')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/blog'}>{t('footer.quickShop.blog')}</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">{t('footer.customerServices.title')}</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/faqs'}>{t('footer.customerServices.ordersFaqs')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.customerServices.shipping')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.customerServices.privacyPolicy')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>{t('footer.customerServices.returnRefund')}</Link>
                                    </div>
                                </div>
                                <div className="newsletter basis-1/3 ps-7 max-md:basis-full max-md:ps-0">
                                    <div className="text-button-uppercase">{t('footer.newsletter.title')}</div>
                                    <div className="caption1 mt-3">{t('footer.newsletter.description')}</div>
                                    <div className="input-block w-full h-[52px] mt-4">
                                        <form className='w-full h-full relative' action="post">
                                            <input type="email" placeholder={t('footer.newsletter.emailPlaceholder')} className='caption1 w-full h-full ps-4 pe-14 rounded-xl border border-line' required />
                                            <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 ltr:right-1 rtl:left-1'>
                                                <Icon.ArrowRight size={24} color='#fff' className='rtl:rotate-180' />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="list-social flex items-center gap-6 mt-4">
                                        <Link href={'https://www.facebook.com/'} target='_blank' aria-label={t('footer.social.facebook')}>
                                            <div className="icon-facebook text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.instagram.com/'} target='_blank' aria-label={t('footer.social.instagram')}>
                                            <div className="icon-instagram text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.twitter.com/'} target='_blank' aria-label={t('footer.social.twitter')}>
                                            <div className="icon-twitter text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.youtube.com/'} target='_blank' aria-label={t('footer.social.youtube')}>
                                            <div className="icon-youtube text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.pinterest.com/'} target='_blank' aria-label={t('footer.social.pinterest')}>
                                            <div className="icon-pinterest text-2xl text-black"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                            <div className="left flex items-center gap-8">
                                <div className="copyright caption1 text-secondary">{t('footer.bottom.copyright')}</div>
                            </div>
                            <div className="right flex items-center gap-2">
                                <div className="caption1 text-secondary">{t('footer.bottom.payment')}</div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-0.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.visa')}
                                        className='w-9'
                                    />
                                </div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-1.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.mastercard')}
                                        className='w-9'
                                    />
                                </div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-2.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.paypal')}
                                        className='w-9'
                                    />
                                </div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-3.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.amex')}
                                        className='w-9'
                                    />
                                </div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-4.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.applePay')}
                                        className='w-9'
                                    />
                                </div>
                                <div className="payment-img">
                                    <Image
                                        src={'/images/payment/Frame-5.png'}
                                        width={500}
                                        height={500}
                                        alt={t('footer.payment.googlePay')}
                                        className='w-9'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer