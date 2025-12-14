const mongoose = require('mongoose');
require('dotenv').config();

const PAGE_ID = '693bb2f3cc0a012dd3f0af2d'; // The failing page

async function diagnose() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const pagesCollection = mongoose.connection.collection('pages');
    const contentsCollection = mongoose.connection.collection('contents');

    console.log('🔍 Analyzing Page:', PAGE_ID);
    console.log('='.repeat(60));

    const page = await pagesCollection.findOne({ 
      _id: new mongoose.Types.ObjectId(PAGE_ID) 
    });

    if (!page) {
      console.log('❌ Page not found!');
      return;
    }

    console.log('\n📄 Page Document:');
    console.log(JSON.stringify(page, null, 2));

    console.log('\n📊 Field Analysis:');
    console.log('='.repeat(60));
    console.log('Title:', page.title || '❌ MISSING');
    console.log('CurrentVersion:', page.currentVersion || '⚠️  MISSING');
    console.log('TotalVersions:', page.totalVersions || '⚠️  MISSING');
    console.log('LastEditedBy:', page.lastEditedBy || '⚠️  MISSING');

    console.log('\n🗑️  Old Fields (should not exist):');
    console.log('content:', page.content !== undefined ? '⚠️  EXISTS' : '✓ OK');
    console.log('contentHtml:', page.contentHtml !== undefined ? '⚠️  EXISTS' : '✓ OK');
    console.log('versions:', page.versions !== undefined ? '⚠️  EXISTS' : '✓ OK');

    const contents = await contentsCollection.find({ pageId: page._id }).toArray();
    
    console.log('\n📦 Content Documents:');
    console.log('Count:', contents.length);

    if (contents.length === 0) {
      console.log('❌ NO CONTENT - This causes 500 errors!');
    } else {
      console.log('✅ Content exists');
    }

    console.log('\n💡 Next: Run "node scripts/fixExistingPages.js"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Done');
  }
}

diagnose();