/**
 * REMOVE LEGACY PAGE FIELDS
 * ------------------------
 * Permanently removes:
 * - content
 * - versions
 * - contentHtml (duplicate old name if exists)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('../models/Page');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const result = await Page.updateMany(
    {},
    {
      $unset: {
        content: "",
        versions: "",
        contentHtml: ""
      }
    }
  );

  console.log('🧹 Legacy fields removed');
  console.log(`Matched: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}\n`);

  await mongoose.disconnect();
  console.log('👋 Done');
}

cleanup().catch(console.error);
