import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const createUploader = (folder) => {
  const uploadPath = path.resolve("uploads", folder);

  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },

    filename(req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  };

  return multer({
    storage,
    fileFilter,
  });
};
