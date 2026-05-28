# Firebase — 랭킹

프로젝트: **school-stair**  
DB: `https://school-stair-default-rtdb.asia-southeast1.firebasedatabase.app`

## 추천 운영 (Spark 무료)

1. **Rules만 배포** — 아래 [배포](#배포)에서 `database`만 실행
2. 게임은 화면에 TOP 10만 표시 (이미 구현됨)
3. 기록이 많이 쌓이면 [Console](https://console.firebase.google.com/) → Realtime Database → `rankings`에서 **11위 이하·스팸 항목 수동 삭제**

Functions·Blaze 없이도 운영 가능합니다.

---

## (선택) TOP 10 자동 정리 — Cloud Functions

Blaze 요금제가 필요합니다. 쓰지 않으면 이 섹션은 건너뛰세요.

## 구성

| 파일 | 역할 |
|------|------|
| `database.rules.json` | 클라이언트는 **새 기록 추가만** 가능 (수정·삭제 불가) |
| `functions/index.js` | 기록 추가 시 + 매일 04:00(KST) **11위 이하 삭제** |

정렬 기준: **점수 내림차순** → 같으면 **ts 오름차순**(먼저 기록한 쪽 유지).

## 사전 준비

1. [Firebase Console](https://console.firebase.google.com/) → 프로젝트 **school-stair**
2. **Blaze(종량제)** 요금제 — Cloud Functions·스케줄 사용 시 필요
3. 로컬에 CLI 설치 및 로그인:

```bash
npm install -g firebase-tools
firebase login
```

4. 프로젝트 ID가 다르면 루트 `.firebaserc`의 `default` 값을 수정하세요.

## 배포

저장소 루트에서:

```bash
cd functions && npm install && cd ..
firebase deploy --only database,functions
```

- **Rules만**: `firebase deploy --only database`
- **Functions만**: `firebase deploy --only functions`

배포 후 게임에서 점수를 저장해 보고, Console → Realtime Database → `rankings`에 항목이 **10개 이하**인지 확인하세요.

## 동작 확인

```bash
# Functions 로그
firebase functions:log --only pruneRankingsOnCreate,pruneRankingsDaily
```

테스트 데이터가 많으면 첫 `onCreate` 실행 시 한 번에 여러 개가 삭제될 수 있습니다.

## Rules 요약

- `rankings` **읽기**: 모두 허용 (랭킹 표시)
- `rankings/{id}` **쓰기**: 해당 id가 **없을 때만** (POST로 새 push id 생성)
- **삭제·수정**: 클라이언트 불가 → Functions(Admin SDK)만 정리

## 주의

- Rules를 배포하기 **전**에 DB에 잘못된 형식 데이터가 많으면, 이후 클라이언트 저장이 거절될 수 있습니다. 필요 시 Console에서 `rankings`를 정리한 뒤 Rules를 배포하세요.
- 공개 쓰기는 스팸 가능성이 남습니다. 추가로 App Check·캡차·인증을 붙이려면 별도 설계가 필요합니다.
