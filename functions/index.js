/**
 * school-stair Realtime Database — rankings TOP 10 유지
 *
 * - onCreate: 새 기록 저장 직후 11위 이하 삭제
 * - schedule: 매일 한 번 재정리 (누락·수동 DB 편집 대비)
 */
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');

admin.initializeApp();

const TOP_N = 10;
const REGION = 'asia-southeast1';

/**
 * @returns {Promise<number>} 삭제한 항목 수
 */
async function pruneRankings() {
  const ref = admin.database().ref('rankings');
  const snap = await ref.once('value');
  const val = snap.val();

  if (!val || typeof val !== 'object') return 0;

  const entries = Object.entries(val).map(([id, data]) => ({
    id,
    score: Number(data && data.score) || 0,
    ts: Number(data && data.ts) || 0,
  }));

  if (entries.length <= TOP_N) return 0;

  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.ts - b.ts;
  });

  const toRemove = entries.slice(TOP_N);
  const updates = {};
  for (const row of toRemove) {
    updates[row.id] = null;
  }

  await ref.update(updates);
  functions.logger.info('pruneRankings', {
    total: entries.length,
    removed: toRemove.length,
    kept: TOP_N,
  });

  return toRemove.length;
}

exports.pruneRankingsOnCreate = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .database.ref('/rankings/{entryId}')
  .onCreate(async (_snap, context) => {
    try {
      const removed = await pruneRankings();
      return { entryId: context.params.entryId, removed };
    } catch (err) {
      functions.logger.error('pruneRankingsOnCreate failed', err);
      throw err;
    }
  });

exports.pruneRankingsDaily = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120, memory: '256MB' })
  .pubsub.schedule('every day 04:00')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    try {
      const removed = await pruneRankings();
      return { removed };
    } catch (err) {
      functions.logger.error('pruneRankingsDaily failed', err);
      throw err;
    }
  });
