import React, { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const Home: React.FC = () => {
    const { location } = useRouterState();

    useEffect(() => {
        if (!location.hash) return;
        const targetId = location.hash.replace('#', '');
        if (!targetId) return;
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.hash]);

    return (
        <main>
            <Hero />
            <About />
            <Projects />
            <Contact />
        </main>
    );
};

export default Home;
