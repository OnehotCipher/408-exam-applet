import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main() {
  const openid = cloud.getWXContext().OPENID;
  const now = new Date();
  const existing = await db.collection('users').where({ openid }).limit(1).get();

  if (existing.data.length === 0) {
    await db.collection('users').add({ data: { openid, createdAt: now, updatedAt: now, lastLoginAt: now } });
  } else {
    await db.collection('users').doc(existing.data[0]._id).update({ data: { updatedAt: now, lastLoginAt: now } });
  }

  return success({ openid });
}
