import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { v4 as uuidv4 } from 'uuid';
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';

const db = sql('meals.db');

export async function getMeals() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("Loading meals failed");
  return db.prepare('SELECT * FROM meals').all();
}

export async function getMeal(slug) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare(`SELECT * FROM meals WHERE slug = ?`).get(slug);
}

export async function saveMeal(meal) {
  const filePath = await upLoadImage(meal);

  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  meal.image = filePath;

  db.prepare(
    `
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
    `
  ).run(meal);
}

export async function upLoadImage(meal) {
  const extension = meal.image.name.split('.').pop();
  const fileName = `${uuidv4()}.${extension}`;
  const bufferdImage = await meal.image.arrayBuffer();
  const bucketName = process.env.R2_BUCKET_NAME;
  const filePath = `images/${fileName}`;

  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filePath,
    Body: bufferdImage,
  });

  try {
    await client.send(command);

    return filePath;
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'EntityTooLarge'
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
        The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
        or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
}
