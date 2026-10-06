import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

interface FooterProps {
  onOpenCardModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCardModal }) => {
  return (
    <footer className="footer">
      <div className="page-content footer-inner">
        <div>
          <div className="footer-brand">ManaDeshi Dukaan</div>
          <p className="footer-muted">Natural &amp; organic foods by Swathi</p>
        </div>

        <div className="footer-meta">
          <p>
            <MapPin size={14} />
            Sai Srinivasa Nilayam, T4, Srinivasa Colony, Manikonda, Hyderabad 500089
          </p>
          <p>
            <Phone size={14} />
            <a href="https://wa.me/919951118687">+91 9951118687</a>
          </p>
          <p>
            <Clock size={14} />
            Daily 9:00 AM – 9:00 PM
          </p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ManaDeshi Dukaan</span>
          <button type="button" onClick={onOpenCardModal}>Visiting card</button>
        </div>
      </div>
    </footer>
  );
};
