const mongoose = require('mongoose');
require('dotenv').config();

async function fixExistingPages() {
  try {
    console.log('🔧 Starting migration...\n');
    
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const pagesCollection = mongoose.connection.collection('pages');
    const contentsCollection = mongoose.connection.collection('contents');

    const allPages = await pagesCollection.find({}).toArray();
    console.log(`📄 Found ${allPages.length} pages\n`);

    let fixedCount = 0;
    let migratedCount = 0;

    for (const page of allPages) {
      console.log(`Processing: ${page.title}`);

      const updates = {};
      let needsUpdate = false;

      // Add missing fields
      if (page.currentVersion === undefined) {
        const contentCount = await contentsCollection.countDocuments({ 
          pageId: page._id 
        });
        updates.currentVersion = contentCount > 0 ? contentCount : 1;
        needsUpdate = true;
        console.log(`  ✓ Added currentVersion: ${updates.currentVersion}`);
      }

      if (page.totalVersions === undefined) {
        const contentCount = await contentsCollection.countDocuments({ 
          pageId: page._id 
        });
        updates.totalVersions = contentCount > 0 ? contentCount : 1;
        needsUpdate = true;
        console.log(`  ✓ Added totalVersions: ${updates.totalVersions}`);
      }

      if (!page.lastEditedBy) {
        updates.lastEditedBy = page.createdBy;
        needsUpdate = true;
        console.log(`  ✓ Added lastEditedBy`);
      }

      // Migrate content to Content collection
      const hasOldContent = page.content || page.contentHtml;
      const hasContentDoc = await contentsCollection.countDocuments({ 
        pageId: page._id 
      }) > 0;

      if (hasOldContent && !hasContentDoc) {
        console.log(`  📦 Migrating content...`);
        
        // Create main content
        await contentsCollection.insertOne({
          pageId: page._id,
          content: page.content || page.contentHtml || '',
          version: 1,
          isLatest: true,
          editedBy: page.createdBy,
          editedAt: page.updatedAt || page.createdAt || new Date()
        });

        // Migrate old versions
        if (page.versions && Array.isArray(page.versions)) {
          console.log(`  📚 Migrating ${page.versions.length} versions...`);
          
          for (let i = 0; i < page.versions.length; i++) {
            const v = page.versions[i];
            await contentsCollection.insertOne({
              pageId: page._id,
              content: v.content || '',
              version: i + 2,
              isLatest: false,
              editedBy: v.editedBy || page.createdBy,
              editedAt: v.editedAt || new Date()
            });
          }

          updates.currentVersion = page.versions.length + 1;
          updates.totalVersions = page.versions.length + 1;
        }

        // Remove old fields
        const unset = {};
        if (page.content !== undefined) unset.content = '';
        if (page.contentHtml !== undefined) unset.contentHtml = '';
        if (page.versions !== undefined) unset.versions = '';

        if (Object.keys(unset).length > 0) {
          await pagesCollection.updateOne(
            { _id: page._id },
            { $unset: unset }
          );
          console.log(`  🧹 Cleaned up old fields`);
        }

        migratedCount++;
      }

      // Apply updates
      if (needsUpdate) {
        await pagesCollection.updateOne(
          { _id: page._id },
          { $set: updates }
        );
        fixedCount++;
      }

      console.log('');
    }

    console.log('='.repeat(50));
    console.log('✅ Migration Complete!');
    console.log(`   Fixed: ${fixedCount} pages`);
    console.log(`   Migrated: ${migratedCount} pages`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

fixExistingPages();