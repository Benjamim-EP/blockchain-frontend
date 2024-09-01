import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Blockchain Explorer</h1>
        <p>Explore e visualize a sua blockchain com facilidade.</p>
        <div className="warning-card">
          <p><strong>Aviso:</strong> O servidor backend pode apresentar instabilidade por estar localizado em um domínio gratuito.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
