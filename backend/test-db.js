const { runQuery, getDatabase } = require('./models/database');

async function test() {
  await getDatabase();
  
  console.log('=== Database Test ===');
  console.log('Devices count:', runQuery('SELECT COUNT(*) as count FROM devices')[0].count);
  console.log('VLANs count:', runQuery('SELECT COUNT(*) as count FROM vlans')[0].count);
  console.log('Servers count:', runQuery('SELECT COUNT(*) as count FROM servers')[0].count);
  console.log('WiFi clients connected:', runQuery(`SELECT COUNT(*) as count FROM wifi_clients WHERE status = 'connected'`)[0].count);
  
  console.log('\n=== Sample Data ===');
  console.log('Devices:', runQuery('SELECT name, type, status FROM devices LIMIT 5'));
  console.log('VLANs:', runQuery('SELECT id, name FROM vlans LIMIT 3'));
  console.log('Servers:', runQuery('SELECT name, type, status FROM servers'));
  console.log('WiFi clients:', runQuery(`SELECT student_name, device_type, status FROM wifi_clients WHERE status = 'connected' LIMIT 3`));
  
  process.exit(0);
}

test().catch(console.error);