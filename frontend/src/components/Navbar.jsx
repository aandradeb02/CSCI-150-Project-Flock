import { useEffect, useState } from 'react';
import { Menu, X, Shield, User, Flame } from 'lucide-react';

const PERMIT_OPTIONS = [
  { id: 'All', label: 'All Lots' },
  { id: 'Student', label: 'Green (General)' },
  { id: 'Staff', label: 'Yellow (Staff)' }
];

function NavOptions({
  permitFilter,
  onPermitChange,
  currentUser,
  onOpenAccount,
  onOpenAdmin,
  showHeatZones,
  onToggleHeatZones,
  onAction = () => {}
}) {
  const run = (fn) => () => {
    fn();
    onAction();
  };

  return (
    <>
      <div className="nav-actions fs-nav-actions">
        {onToggleHeatZones && (
          <button
            type="button"
            className={`btn btn-outline fs-action ${showHeatZones ? 'active' : ''}`}
            aria-pressed={Boolean(showHeatZones)}
            onClick={run(onToggleHeatZones)}
          >
            <Flame size={18} />
            {showHeatZones ? 'Hide Heat Zones' : 'Show Heat Zones'}
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline fs-action"
          onClick={run(onOpenAccount)}
        >
          <User size={18} />
          {currentUser ? currentUser.username : 'Account'}
        </button>

        <button
          type="button"
          className="btn btn-outline fs-action"
          onClick={run(onOpenAdmin)}
        >
          <Shield size={18} />
          Admin
        </button>
      </div>

      <div
        className="permit-filter fs-permit-filter"
        role="group"
        aria-label="Permit Filter"
      >
        <span className="filter-label">Permit:</span>

        {PERMIT_OPTIONS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`chip fs-chip ${permitFilter === item.id ? 'active' : ''}`}
            aria-pressed={permitFilter === item.id}
            onClick={run(() => onPermitChange(item.id))}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

function FresnoBrand({ compact = false }) {
  return (
    <div className="fs-brand">
      <div className="fs-wordmark">
        FRESNO STATE
      </div>

      <div className="fs-brand-copy">
        <h1>
          {compact
            ? 'Fresno State Parking'
            : 'Fresno State Parking Lot Occupancy'}
        </h1>

        {!compact && (
          <p className="fs-subtitle">
            Real-Time Aerial Telemetry • Status Bars Show % Full
          </p>
        )}
      </div>
    </div>
  );
}

export default function Navbar({
  isMobile,
  showHeatZones,
  onToggleHeatZones,
  ...options
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [menuOpen]);

  if (!isMobile) {
    return (
      <header className="navbar fs-navbar">
        <div className="fs-header-top">
          <FresnoBrand />
        </div>

        <nav className="fs-header-bottom" aria-label="Main navigation">
          <NavOptions
            {...options}
            showHeatZones={showHeatZones}
            onToggleHeatZones={onToggleHeatZones}
          />
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar mobile fs-navbar fs-navbar-mobile">
      <div className="fs-mobile-header">
        <FresnoBrand compact />

        <button
          type="button"
          className="icon-btn fs-menu-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      <div
        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-label="Main menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-menu-header">
          <strong>Parking Navigation</strong>

          <button
            type="button"
            className="icon-btn fs-menu-toggle"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <NavOptions
          {...options}
          onAction={() => setMenuOpen(false)}
        />
      </nav>
    </header>
  );
}
