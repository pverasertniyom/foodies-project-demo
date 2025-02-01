import Link from 'next/link';
import classes from './page.module.css';
import { Suspense } from 'react';
import LoadingMeals from '@/components/Loading/LoadingMeals';
import Meals from '@/components/Meals/Meals';

export const metadata = {
  title: 'All Meal',
  description: 'Browse the delicious meals, shared by a food-loving community.',
};

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals created{' '}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it youself. It is easy and fun
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<LoadingMeals />}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
