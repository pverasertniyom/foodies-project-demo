import classes from './MainHeader.module.css';
import Image from 'next/image';
import Link from 'next/link';
import LogoImg from '@/assets/logo.png';
import MainHeaderBackground from './MainHeaderBackground';
import NavLink from './NavLink';

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={LogoImg} alt="A plate with food on it" priority={true} />
          NextLevel Foodsss
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Commnunity</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
