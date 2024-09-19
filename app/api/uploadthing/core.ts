import sharp from 'sharp';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { z } from 'zod';
import { db } from '~/db';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;
      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();
      const resizedBuffer = await sharp(buffer).metadata();

      const { width, height } = resizedBuffer;

      if (!configId) {
        const newConfig = await db.configuration.create({
          data: {
            imageUrl: file.url,
            width: width || 500,
            height: height || 500,
          },
        });

        return { configId: newConfig.id };
      } else {
        const updatedConfig = await db.configuration.update({
          where: { id: configId },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return { configId: updatedConfig.id };
      }

      return { configId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
