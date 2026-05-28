# 🏫 대성여고 무한 학교계단

귀여운 여고쌤 캐릭터와 함께 끝없이 계단을 올라가는 웹 게임입니다!

🎮 **플레이 링크**: [https://infinite-school-stairs.vercel.app/](https://infinite-school-stairs.vercel.app/)

---

## 📸 게임 소개

계단을 밟으며 점수를 쌓고, 점수에 따라 배경이 초등학교 → 중학교 → 고등학교 → 대학교 → 회사 → 가정으로 변해갑니다. Firebase 실시간 DB로 전 세계 누구와도 기록을 공유할 수 있습니다!

---

## 🎮 게임 방법

캐릭터는 **현재 바라보는 방향**으로만 계단을 올라갑니다. 다음 계단이 왼쪽·오른쪽 어디에 있든, 필요한 조작은 **방향 전환**인지 **그대로 전진**인지입니다.

| 조작 | 키보드 | 모바일 |
|------|--------|--------|
| 방향 전환 (↩) | `←` 또는 `Z` | 왼쪽 버튼 |
| 올라가기 (🦶) | `→` 또는 `X` | 오른쪽 버튼 |

- **다음 계단** 위의 핑크 화살표가 눌러야 할 버튼을 알려 줍니다
- **타임어택 2분 30초(150초)** — 시간이 끝나면 그 판 종료 (게임 중독 방지)
- 맞는 버튼을 누르면 점수 +1
- 틀리면 목숨 -1 (총 3개)
- 연속으로 맞히면 콤보가 쌓이고 (3콤보~) 화면·사운드로 강조됩니다
- **5콤보·10콤보…** 마다 추가 점수 **+1 보너스** (그 판에서 한 번에 +2점)

---

## 🏆 스테이지

| 점수 | 스테이지 |
|------|----------|
| 0점~ | 🏫 초등학교 — 맑은 하늘, 운동장 |
| 30점~ | 📚 중학교 — 흐린 오후, 교정 |
| 70점~ | 📝 고등학교 — 석양 노을, 시계탑 |
| 120점~ | 🎓 대학교 — 자줏빛 캠퍼스, 벚꽃 |
| 180점~ | 💼 회사 — 심야 도시, 빌딩숲 |
| 250점~ | 🏠 가정 — 따뜻한 노을, 아늑한 집 |

---

## ✨ 주요 기능

- 🎵 **Web Audio API** 기반 배경음악 & 효과음 (외부 파일 없음)
- 🏆 **Firebase Realtime Database** 공유 랭킹 TOP 10
- 📱 **PWA 지원** — 모바일 홈화면에 앱으로 추가 가능
- 🔥 **콤보 시스템** — 연속 성공 시 강조 연출, 5콤보마다 보너스 점수
- 💾 **오프라인 fallback** — Firebase 연결 실패 시 로컬 저장
- 🔗 **SNS 공유** — Open Graph·Twitter 카드용 절대 URL 메타 태그

---

## 🛠 기술 스택

| 항목 | 내용 |
|------|------|
| 언어 | HTML / CSS / Vanilla JS |
| 렌더링 | Canvas 2D API |
| 사운드 | Web Audio API (절차적 생성) |
| 데이터베이스 | Firebase Realtime Database (REST API) |
| 배포 | Vercel (GitHub 연동 자동 배포) |
| PWA | manifest.json + Service Worker |

> 빌드 도구 없음 — 단일 `index.html` 파일로 동작합니다.

---

## 📁 프로젝트 구조

```
무한의 계단/
├── index.html           # 게임 전체 코드 (HTML + CSS + JS)
├── database.rules.json  # Realtime Database 보안 규칙
├── firebase.json        # Firebase CLI 설정
├── functions/           # TOP 10 정리 Cloud Functions
├── firebase/README.md   # Functions·Rules 배포 가이드
├── manifest.json        # PWA 설정
├── sw.js                # Service Worker (오프라인 캐시)
├── icon.svg             # 앱 아이콘 (벡터)
├── icon-192.png         # 앱 아이콘 192×192
└── icon-512.png         # 앱 아이콘 512×512
```

---

## 📱 홈화면 바로가기 추가 방법

**Android (Chrome)**
> 주소창 하단 배너 또는 메뉴 → "앱 설치"

**iPhone (Safari)**
> 하단 공유 버튼 → "홈 화면에 추가"

---

## 🚀 로컬 실행

```bash
npx serve -p 8788 .
# → http://localhost:8788
```

---

## 🔒 Firebase 랭킹

| 항목 | 경로 |
|------|------|
| DB Rules (권장) | `database.rules.json` |
| 수동 정리 | [Firebase Console](https://console.firebase.google.com/) → Realtime Database → `rankings` |
| 자동 TOP 10 (선택) | `functions/index.js` — Blaze + Functions 배포 시 |

**운영 방식 (Spark 무료):** 게임은 TOP 10만 표시하고, DB에 기록이 많이 쌓이면 Console에서 가끔 11위 이하를 삭제합니다. Rules만 배포해 두면 클라이언트는 **새 기록 추가만** 가능합니다.

```bash
firebase login
firebase deploy --only database
```

자동 삭제(Functions)는 [firebase/README.md](firebase/README.md) 참고 — **Blaze 요금제** 필요.
