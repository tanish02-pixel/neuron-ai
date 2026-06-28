// This file is where you can create your FileRouter and register it to a route of your choice in the /app/api/uploadthing/[[...uploadthing]]/route.ts file.

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "16MB",
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded file URL:", file.ufsUrl);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;