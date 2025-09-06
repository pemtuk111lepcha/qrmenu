import React, { useState } from 'react';
import '../styles/AboutUs.css'; // Fix: Use correct case-sensitive filename

const HeroSection = () => (
    <section className="hero-section">
        <div className="hero-section__container">
            <h1 className="hero-section__title">The Future of Dining is Just a Scan Away</h1>
            <p className="hero-section__subtitle">
                We're seamlessly connecting restaurants and their patrons through elegant, intuitive technology, making the dining experience more efficient and enjoyable for everyone.
            </p>
        </div>
    </section>
);

const BenefitCard = ({ title, description, colorClass }) => (
    <div className="benefit-card">
        <h3 className={`benefit-card__title ${colorClass}`}>{title}</h3>
        <p className="benefit-card__description">{description}</p>
    </div>
);

const HowItWorksStep = ({ number, title, description }) => (
     <div className="how-it-works-step">
        <div className="how-it-works-step__number">{number}</div>
        <h3 className="how-it-works-step__title">{title}</h3>
        <p className="how-it-works-step__description">{description}</p>
    </div>
);


// --- Main Page Sections as Components ---

const BenefitsSection = () => {
    const [activeTab, setActiveTab] = useState('restaurants');

    const restaurantBenefits = [
        { title: 'Create & Customize with Ease', description: 'Build a beautiful, dynamic digital menu in minutes. Add mouth-watering photos, detailed descriptions, and update prices or availability instantly.' },
        { title: 'Reduce Costs & Waste', description: 'Say goodbye to the endless cycle of printing, reprinting, and laminating paper menus. Save money and be more eco-friendly.' },
        { title: 'Increase Efficiency', description: 'Receive clear, accurate online orders directly from the table to your kitchen, reducing errors and freeing up your staff to focus on service.' },
        { title: 'Delight Your Customers', description: 'Offer a modern, convenient, and contactless experience that today\'s diners expect, leading to higher satisfaction and return visits.' },
    ];

    const dinerBenefits = [
        { title: 'Instant Access', description: 'Simply scan the QR code on your table to instantly pull up the complete, up-to-date menu on your own device.' },
        { title: 'Browse Visually', description: 'See what looks good with high-quality, enticing images of every dish, helping you choose your next favorite meal.' },
        { title: 'Order on Your Time', description: 'Ready to order? Place it directly from your phone. Need another drink? Just a few taps away. No more waiting.' },
        { title: 'Safe & Simple', description: 'Enjoy a completely contactless ordering and payment process for a safer, more convenient, and worry-free dining experience.' },
    ];
    
    const getButtonClass = (tabName) => {
        return `benefits-section__tab-button ${activeTab === tabName ? 'benefits-section__tab-button--active' : ''}`;
    }

    return (
        <section className="benefits-section">
            <div className="benefits-section__container">
                <div className="benefits-section__header">
                    <h2 className="benefits-section__title">A Smarter Way to Serve & Dine</h2>
                    <p className="benefits-section__subtitle">Discover the benefits for your business and your customers.</p>
                </div>

                <div className="benefits-section__tabs">
                    <button onClick={() => setActiveTab('restaurants')} className={getButtonClass('restaurants')}>For Restaurants</button>
                    <button onClick={() => setActiveTab('diners')} className={getButtonClass('diners')}>For Diners</button>
                </div>

                <div className="benefits-section__content">
                    {activeTab === 'restaurants' ? (
                        <div className="benefits-section__grid">
                            {restaurantBenefits.map(b => <BenefitCard key={b.title} {...b} colorClass="benefit-card__title--orange" />)}
                        </div>
                    ) : (
                        <div className="benefits-section__grid">
                            {dinerBenefits.map(b => <BenefitCard key={b.title} {...b} colorClass="benefit-card__title--green" />)}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection = () => (
    <section className="how-it-works-section">
        <div className="how-it-works-section__container">
            <div className="how-it-works-section__header">
                <h2 className="how-it-works-section__title">How It Works</h2>
                <p className="how-it-works-section__subtitle">A seamless experience from scan to satisfaction.</p>
            </div>
            <div className="how-it-works-section__grid">
                <div className="how-it-works-section__line"></div>
                <HowItWorksStep number="1" title="Scan the QR Code" description="Customers use their smartphone camera to scan the unique QR code at their table." />
                <HowItWorksStep number="2" title="Browse & Order" description="The interactive menu appears instantly. They can browse, select items, and place their order." />
                <HowItWorksStep number="3" title="Enjoy the Meal" description="The order is sent directly to the kitchen, and food is served. It's that simple!" />
            </div>
        </div>
    </section>
);

const OurStorySection = () => (
    <section className="our-story-section">
        <div className="our-story-section__container">
            <div className="our-story-section__text-content">
                <h2 className="our-story-section__title">Our Story</h2>
                <p className="our-story-section__paragraph">We're a team of foodies, tech geeks, and hospitality veterans. The idea was born over a meal where we spent more time trying to order than enjoying our food. We decided to combine our passions to build a solution that we, and our favorite restaurants, would genuinely love to use.</p>
                <p className="our-story-section__paragraph">We believe that technology should enhance life's best moments, and a shared meal is one of the most important.</p>
            </div>
            <div className="our-story-section__image-placeholder">
                <span>Your team photo here</span>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="footer">
        <div className="footer__container">
            <h2 className="footer__title">Join Us in Revolutionizing the Dining Experience</h2>
            <p className="footer__subtitle">Ready to empower your business with a modern, efficient, and cost-effective menu solution? Let's get started.</p>
            <a href="#" className="footer__cta-button">Request a Demo</a>
        </div>
    </footer>
);


// --- Main App Component ---
export default function App() {
    return (
        <main>
            <HeroSection />
            <BenefitsSection />
            <HowItWorksSection />
            <OurStorySection />
            <Footer />
        </main>
    );
}
