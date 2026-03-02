const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../../middleware/auth.middleware");
const documentController = require("./document.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  documentController.uploadDocument
);

module.exports = router;