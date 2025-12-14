/**
 * FIX EXISTING PAGES MIGRATION SCRIPT
 * ---------------------------------
 * - Migrates old Page schema to new schema
 * - Moves versions[] → Content collection
 * - Sets contentHtml correctly
 * - Removes legacy fields (content, versions)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('../models/Page');
const Content = require('../models/Content');

const MONGO_URI = process.env.MONGO_URI;

async function migrate() {
  console.log('🔧 Starting migration...\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const pages = await Page.find({});
  console.log(`📄 Found ${pages.length} pages\n`);

  let fixed = 0;
  let migrated = 0;

  for (const page of pages) {
    console.log(`Processing: ${page.title}`);

    const hasOldContent = !!page.content;
    const hasOldVersions = Array.isArray(page.versions) && page.versions.length > 0;

    // If already clean → skip
    if (!hasOldContent && !hasOldVersions) {
      console.log('  ⏭️  Already migrated\n');
      continue;
    }

    // 1️⃣ Migrate versions → Content collection
    if (hasOldVersions) {
      for (let i = 0; i < page.versions.length; i++) {
        const v = page.versions[i];

        const exists = await Content.findOne({
          page: page._id,
          version: i + 1,
        });

        if (!exists) {
          await Content.create({
            page: page._id,
            version: i + 1,
            contentHtml: v.content,
            editedBy: v.editedBy,
            createdAt: v.editedAt,
          });
        }
      }

      migrated++;
    }

    // 2️⃣ Set contentHtml from latest version or old content
    if (!page.contentHtml) {
      if (hasOldVersions) {
        const latest = page.versions[page.versions.length - 1];
        page.contentHtml = latest.content;
      } else if (hasOldContent) {
        page.contentHtml = page.content;
      }
    }

    // 3️⃣ Fix counters
    const totalVersions = await Content.countDocuments({ page: page._id });
    page.totalVersions = totalVersions;
    page.currentVersion = totalVersions;

    // 4️⃣ REMOVE legacy fields
    page.content = undefined;
    page.versions = undefined;

    await page.save();

    fixed++;
    console.log('  ✅ Fixed\n');
  }

  console.log('==========================================');
  console.log('✅ Migration Complete!');
  console.log(`   Fixed Pages: ${fixed}`);
  console.log(`   Migrated Versions: ${migrated}`);
  console.log('==========================================\n');

  await mongoose.disconnect();
  console.log('👋 Disconnected');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
