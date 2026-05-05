const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://yasangashanuka33_db_user:Shanuka32@cluster0.mbu2dum.mongodb.net/blog-app';
MongoClient.connect(uri).then(async client => {
  const db = client.db('blog-app');
  const result = await db.collection('blogs').updateMany(
    { appId: { $exists: false } },
    { $set: { appId: 'standalone' } }
  );
  console.log('Updated blogs:', result.modifiedCount);
  const emailResult = await db.collection('emails').updateMany(
    { appId: { $exists: false } },
    { $set: { appId: 'standalone' } }
  );
  console.log('Updated emails:', emailResult.modifiedCount);
  client.close();
}).catch(console.error);
