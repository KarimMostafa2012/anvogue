'use client'
import React, { useState, useEffect } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslation } from 'next-i18next';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQSection {
    id: string;
    title: string;
    items: FAQItem[];
}

const Faqs = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<string>('howToBuy');
    const [activeQuestion, setActiveQuestion] = useState<string | undefined>(undefined);
    const [faqSections, setFaqSections] = useState<FAQSection[]>([]);

    useEffect(() => {
        const sections: FAQSection[] = [
            {
                id: 'howToBuy',
                title: t('faqs.sections.howToBuy.title'),
                items: [
                    {
                        id: 'covid19',
                        question: t('faqs.sections.howToBuy.questions.covid19.question'),
                        answer: t('faqs.sections.howToBuy.questions.covid19.answer')
                    },
                    {
                        id: 'plusSizes',
                        question: t('faqs.sections.howToBuy.questions.plusSizes.question'),
                        answer: t('faqs.sections.howToBuy.questions.plusSizes.answer')
                    }
                ]
            },
            {
                id: 'paymentMethods',
                title: t('faqs.sections.paymentMethods.title'),
                items: [
                    {
                        id: 'paymentOptions',
                        question: t('faqs.sections.paymentMethods.questions.paymentOptions.question'),
                        answer: t('faqs.sections.paymentMethods.questions.paymentOptions.answer')
                    },
                    {
                        id: 'security',
                        question: t('faqs.sections.paymentMethods.questions.security.question'),
                        answer: t('faqs.sections.paymentMethods.questions.security.answer')
                    }
                ]
            },
            {
                id: 'delivery',
                title: t('faqs.sections.delivery.title'),
                items: [
                    {
                        id: 'deliveryOptions',
                        question: t('faqs.sections.delivery.questions.deliveryOptions.question'),
                        answer: t('faqs.sections.delivery.questions.deliveryOptions.answer')
                    },
                    {
                        id: 'deliveryTime',
                        question: t('faqs.sections.delivery.questions.deliveryTime.question'),
                        answer: t('faqs.sections.delivery.questions.deliveryTime.answer')
                    }
                ]
            }
        ];
        setFaqSections(sections);
    }, [t, activeTab]);

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab);
        setActiveQuestion(undefined);
    };

    const handleActiveQuestion = (question: string) => {
        setActiveQuestion(prevQuestion => prevQuestion === question ? undefined : question);
    };

    const currentSection = faqSections.find(section => section.id == activeTab);
    console.log("currentSection", currentSection);

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading={t('faqs.title')} subHeading={t('faqs.title')} />
            </div>
            <div className='faqs-block md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between">
                        <div className="left w-1/4">
                            <div className="menu-tab flex flex-col gap-5">
                                {faqSections.map((section) => (
                                    <div
                                        key={section.id}
                                        className={`tab-item inline-block w-fit heading6 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === section.id ? 'active' : ''}`}
                                        onClick={() => handleActiveTab(section.id)}
                                    >
                                        {section.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-2/3">
                            {currentSection && (
                                <div className="tab-question flex flex-col gap-5 active">
                                    {currentSection.items.map((item) => {
                                        console.log("item", item);
                                        return (
                                            <div
                                                key={item.id}
                                                className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === item.id ? 'open' : ''}`}
                                                onClick={() => handleActiveQuestion(item.id)}
                                            >
                                                <div className="heading flex items-center justify-between gap-6">
                                                    <div className="heading6">{item.question}</div>
                                                    <CaretRight size={24} className={`transform transition-transform duration-300 ${activeQuestion === item.id ? 'rotate-90' : ''}`} />
                                                </div>
                                                <div className={`content body1 text-secondary mt-4 ${activeQuestion === item.id ? 'block' : ''}`}>
                                                    {item.answer}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Faqs;