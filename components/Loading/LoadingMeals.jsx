import classes from './LoadingMeals.module.css'

export default function LoadingMeals() {
  return (
    <p className={classes.loading}>Fetching Meals</p>
  )
}