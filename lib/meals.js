import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("Loading meals failed");
  return db.prepare('SELECT * FROM meals').all();
}

export async function getMeal(slug) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare(`SELECT * FROM meals WHERE slug = @slug`).get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferdImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferdImage), function (error) {
    if (error) {
      throw new Error('Saving Image Failed');
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare(`
    INSERT INTO meals (
      title, 
      summary, 
      instructions, 
      image, 
      slug, 
      creator, 
      creator_email
    ) VALUES (
      @title,
      @summary,
      @instructions,
      @image,
      @slug,
      @creator,
      @creator_email
    )
  `).run(meal);
}
