import Link from 'next/link';

import APP_ROUTES from '../pages/routes';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: APP_ROUTES.AUTH.SING_UP },
    !currentUser && { label: 'Sign In', href: APP_ROUTES.AUTH.SING_IN },
    currentUser && { label: 'Sign Out', href: APP_ROUTES.AUTH.SING_OUT },
  ]  // Example: [false, false, { label: 'Sign Out', href: APP_ROUTES.AUTH.SING_OUT }]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>    

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;