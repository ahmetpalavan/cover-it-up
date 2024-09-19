import { generateReactHelpers } from '@uploadthing/react';
import { OurFileRouter } from '~/app/api/uploadthing/core';

export const { uploadFiles, useUploadThing } = generateReactHelpers<OurFileRouter>({});
