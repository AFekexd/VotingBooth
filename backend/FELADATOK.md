# VotingBooth API - Gyakorlati Feladatok

## Bevezetés

Ez a dokumentum gyakorlati feladatokat tartalmaz a VotingBooth API használatához. A feladatok során megismerkedhetsz a különböző API endpointokkal, és megtanulod, hogyan használhatod őket HTTP kérésekkel.

## Előkészületek

1. **Szerver indítása**: Győződj meg róla, hogy a szerver fut
   ```bash
   npm run dev
   ```

2. **API elérhetősége**: A szerver alapértelmezetten a `http://localhost:3000` címen fut

3. **Eszközök**: Használhatod a következő eszközöket a feladatok megoldásához:
   - PowerShell (curl parancs)
   - Postman
   - Thunder Client (VS Code extension)
   - Böngésző (GET kérésekhez)

---

## 1. Feladat: Statisztikák lekérdezése

### 1.1 Általános statisztikák

**Cél**: Kérdezd le az összes szavazás statisztikáját!

**Endpoint**: `GET /api/v1/votes/stats/overview`

**PowerShell parancs**:
```powershell
curl http://localhost:3000/api/v1/votes/stats/overview
```

**Várt válasz tartalma**:
- Összes szavazás száma
- Aktív szavazások száma
- Lezárt szavazások száma
- Összes résztvevő
- Legnépszerűbb szavazás

**Kérdések**:
1. Hány aktív szavazás van jelenleg?
2. Melyik a legnépszerűbb szavazás?
3. Hány ember vett részt összesen a szavazásokban?

---

### 1.2 Népszerű szavazások

**Cél**: Kérdezd le a 3 legnépszerűbb szavazást!

**Endpoint**: `GET /api/v1/votes/stats/popular?limit=3`

**PowerShell parancs**:
```powershell
curl "http://localhost:3000/api/v1/votes/stats/popular?limit=3"
```

**Feladat**:
- Módosítsd a limit paramétert 5-re
- Figyeld meg, hogyan változik a válasz

---

## 2. Feladat: Szavazások szűrése

### 2.1 Aktív szavazások listázása

**Cél**: Listázd ki az összes aktív szavazást lapozással!

**Endpoint**: `GET /api/v1/votes/active?page=1&limit=5`

**PowerShell parancs**:
```powershell
curl "http://localhost:3000/api/v1/votes/active?page=1&limit=5"
```

**Kérdések**:
1. Hány aktív szavazás van összesen?
2. Hány oldal van, ha oldalanként 5 elemet jelenítünk meg?
3. Mi történik, ha a `page=2` paramétert használod?

---

### 2.2 Lezárt szavazások

**Cél**: Kérdezd le a lezárt szavazásokat!

**Endpoint**: `GET /api/v1/votes/closed?page=1&limit=10`

**PowerShell parancs**:
```powershell
curl "http://localhost:3000/api/v1/votes/closed?page=1&limit=10"
```

**Feladat**:
- Figyeld meg a `closedAt` mezőt
- Hasonlítsd össze az aktív és lezárt szavazások válaszát

---

### 2.3 Keresés szavazások között

**Cél**: Keress rá a "JavaScript" kulcsszóra!

**Endpoint**: `GET /api/v1/votes/search?q=JavaScript`

**PowerShell parancs**:
```powershell
curl "http://localhost:3000/api/v1/votes/search?q=JavaScript"
```

**További feladatok**:
1. Keress rá más kulcsszavakra (pl. "database", "editor")
2. Próbálj ki olyan keresést, ami nem ad találatot
3. Add hozzá a lapozást: `&page=1&limit=5`

---

## 3. Feladat: Szavazás részleteinek lekérdezése

### 3.1 Egy szavazás adatai

**Cél**: Kérdezd le az 1-es azonosítójú szavazás adatait!

**Endpoint**: `GET /api/v1/votes/:id`

**PowerShell parancs**:
```powershell
curl http://localhost:3000/api/v1/votes/1
```

**Feladat**:
- Próbálj ki különböző ID-kat (1, 2, 3, stb.)
- Mi történik, ha nem létező ID-t adsz meg? (pl. 999)

---

### 3.2 Szavazás eredményei

**Cél**: Kérdezd le az 1-es szavazás eredményeit százalékokkal!

**Endpoint**: `GET /api/v1/votes/:id/results`

**PowerShell parancs**:
```powershell
curl http://localhost:3000/api/v1/votes/1/results
```

**Kérdések**:
1. Melyik opció vezet?
2. Hány százalékot kapott a második helyezett?
3. Hány szavazat érkezett összesen?

---

## 4. Feladat: Szavazás leadása

**Cél**: Adj le egy szavazatot az 1-es szavazásban a 2-es opcióra!

**Endpoint**: `POST /api/v1/votes/:id/cast`

**PowerShell parancs**:
```powershell
$body = @{optionId = 2} | ConvertTo-Json
curl -X POST -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/1/cast
```

**Feladatok**:
1. Add le a szavazatot
2. Kérdezd le újra az eredményeket (`/results`)
3. Figyeld meg, hogy nőtt-e a szavazatok száma
4. Próbálj szavazni egy lezárt szavazásra - mi történik?

---

## 5. Feladat: Új opció hozzáadása

**Cél**: Adj hozzá egy új opciót a 2-es szavazáshoz!

**Endpoint**: `POST /api/v1/votes/:id/options`

**PowerShell parancs**:
```powershell
$body = @{optionText = "Qwik"} | ConvertTo-Json
curl -X POST -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/2/options
```

**Feladatok**:
1. Add hozzá az új opciót
2. Kérdezd le a szavazást, és ellenőrizd, hogy megjelent-e az új opció
3. Próbálj hozzáadni egy másik opciót is (pl. "Solid.js")

---

## 6. Feladat: Opció módosítása

**Cél**: Módosítsd egy opció szövegét!

**Endpoint**: `PUT /api/v1/votes/:id/options/:optionId`

**PowerShell parancs**:
```powershell
$body = @{optionText = "Qwik Framework"} | ConvertTo-Json
curl -X PUT -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/2/options/27
```

**Megjegyzés**: Cseréld le a `27`-et a valódi opció ID-jára, amit az előző feladatban kaptál!

**Feladat**:
- Ellenőrizd a módosítást a szavazás lekérdezésével

---

## 7. Feladat: Opció törlése

**Cél**: Törölj egy opciót, amelyre még nem érkezett szavazat!

**Endpoint**: `DELETE /api/v1/votes/:id/options/:optionId`

**PowerShell parancs**:
```powershell
curl -X DELETE http://localhost:3000/api/v1/votes/2/options/27
```

**Kérdések**:
1. Sikerült törölni az opciót?
2. Mi történik, ha olyan opciót próbálsz törölni, amelyre már van szavazat?
3. Mi történik, ha csak 2 opció maradt, és azt próbálod törölni?

---

## 8. Feladat: Szavazás lezárása

**Cél**: Zárd le az 1-es szavazást!

**Endpoint**: `PUT /api/v1/votes/:id/close`

**PowerShell parancs**:
```powershell
curl -X PUT http://localhost:3000/api/v1/votes/1/close
```

**Feladatok**:
1. Zárd le a szavazást
2. Ellenőrizd, hogy a `closedAt` mező kitöltődött-e
3. Próbálj szavazni a lezárt szavazásra - mi történik?
4. Kérdezd le a lezárt szavazásokat (`/closed`)

---

## 9. Feladat: Tömeges műveletek

### 9.1 Több szavazás lezárása egyszerre

**Cél**: Zárd le a 2-es és 3-as szavazásokat egy kéréssel!

**Endpoint**: `PUT /api/v1/votes/bulk/close`

**PowerShell parancs**:
```powershell
$body = @{voteIds = @(2, 3)} | ConvertTo-Json
curl -X PUT -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/bulk/close
```

**Feladat**:
- Ellenőrizd, hogy mindkét szavazás lezárult-e

---

### 9.2 Több szavazás újraaktiválása

**Cél**: Aktiváld újra a lezárt szavazásokat!

**Endpoint**: `PUT /api/v1/votes/bulk/activate`

**PowerShell parancs**:
```powershell
$body = @{voteIds = @(1, 2, 3)} | ConvertTo-Json
curl -X PUT -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/bulk/activate
```

**Feladat**:
- Ellenőrizd, hogy a szavazások újra aktívak-e
- Figyeld meg, hogy a `closedAt` mező `null` lett-e

---

## 10. Feladat: Új szavazás létrehozása

**Cél**: Hozz létre egy új szavazást legalább 2 opcióval!

**Endpoint**: `POST /api/v1/votes`

**PowerShell parancs**:
```powershell
$body = @{
    title = "Kedvenc programozási nyelv?"
    description = "Válaszd ki a kedvenc programozási nyelvedet!"
    options = @(
        @{optionText = "Python"},
        @{optionText = "JavaScript"},
        @{optionText = "Java"},
        @{optionText = "C#"}
    )
} | ConvertTo-Json -Depth 3

curl -X POST -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes
```

**Feladatok**:
1. Hozd létre a szavazást
2. Jegyezd fel az új szavazás ID-ját
3. Kérdezd le az új szavazást
4. Adj le rá egy szavazatot

---

## 11. Feladat: Szavazás módosítása

**Cél**: Módosítsd egy szavazás címét és leírását!

**Endpoint**: `PUT /api/v1/votes/:id`

**PowerShell parancs**:
```powershell
$body = @{
    title = "Kedvenc programozási nyelv 2024?"
    description = "Melyik nyelvet használod legszívesebben 2024-ben?"
} | ConvertTo-Json

curl -X PUT -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes/[ID]
```

**Megjegyzés**: Cseréld le a `[ID]`-t az előző feladatban létrehozott szavazás ID-jára!

---

## 12. Feladat: Összes szavazás listázása

**Cél**: Kérdezd le az összes szavazást!

**Endpoint**: `GET /api/v1/votes`

**PowerShell parancs**:
```powershell
curl http://localhost:3000/api/v1/votes
```

**Kérdések**:
1. Hány szavazás van összesen?
2. Melyik a legújabb szavazás?
3. Melyik szavazásra érkezett a legtöbb szavazat?

---

## 13. Feladat: Szavazás törlése

**Cél**: Töröld az általad létrehozott szavazást!

**Endpoint**: `DELETE /api/v1/votes/:id`

**PowerShell parancs**:
```powershell
curl -X DELETE http://localhost:3000/api/v1/votes/[ID]
```

**Figyelem**: A törlés végleges! Az opciók is törlődnek (cascade delete).

---

## Bónusz Feladatok

### B1. Komplex lekérdezés

Készíts egy PowerShell scriptet, amely:
1. Lekérdezi az aktív szavazásokat
2. Minden aktív szavazásra leadja a szavazatot egy véletlenszerű opcióra
3. Lekérdezi az eredményeket

### B2. Statisztikai riport

Készíts egy scriptet, amely:
1. Lekérdezi az összes szavazást
2. Kiszámítja az átlagos részvételi arányt
3. Megkeresi a legkevesebb szavazatot kapott szavazást

### B3. Adatvalidáció tesztelése

Próbáld ki a következő hibás kéréseket, és figyeld meg a hibaüzeneteket:
- Üres cím megadása szavazás létrehozásakor
- 1-nél kevesebb opció megadása
- Túl hosszú szöveg (255+ karakter)
- Érvénytelen ID használata

---

## Hasznos tippek

### JSON formázás PowerShellben

```powershell
# Szép formázás
curl http://localhost:3000/api/v1/votes/1 | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Válasz mentése fájlba

```powershell
curl http://localhost:3000/api/v1/votes/stats/overview > stats.json
```

### Több kérés egymás után

```powershell
# Szavazás létrehozása és azonnal lekérdezése
$response = curl -X POST -H "Content-Type: application/json" -d $body http://localhost:3000/api/v1/votes | ConvertFrom-Json
$newId = $response.data.id
curl "http://localhost:3000/api/v1/votes/$newId"
```

---

## API Endpoint Összefoglaló

| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| GET | `/api/v1/votes` | Összes szavazás |
| GET | `/api/v1/votes/:id` | Egy szavazás adatai |
| POST | `/api/v1/votes` | Új szavazás létrehozása |
| PUT | `/api/v1/votes/:id` | Szavazás módosítása |
| DELETE | `/api/v1/votes/:id` | Szavazás törlése |
| GET | `/api/v1/votes/stats/overview` | Általános statisztikák |
| GET | `/api/v1/votes/stats/popular` | Népszerű szavazások |
| GET | `/api/v1/votes/active` | Aktív szavazások |
| GET | `/api/v1/votes/closed` | Lezárt szavazások |
| GET | `/api/v1/votes/search` | Keresés |
| GET | `/api/v1/votes/:id/results` | Szavazás eredményei |
| POST | `/api/v1/votes/:id/cast` | Szavazat leadása |
| PUT | `/api/v1/votes/:id/close` | Szavazás lezárása |
| PUT | `/api/v1/votes/bulk/close` | Tömeges lezárás |
| PUT | `/api/v1/votes/bulk/activate` | Tömeges aktiválás |
| POST | `/api/v1/votes/:id/options` | Opció hozzáadása |
| PUT | `/api/v1/votes/:id/options/:optionId` | Opció módosítása |
| DELETE | `/api/v1/votes/:id/options/:optionId` | Opció törlése |

---

## Gyakori hibák és megoldásaik

### 1. "Route not found"
- Ellenőrizd az URL-t és a HTTP metódust
- Bizonyosodj meg róla, hogy a szerver fut

### 2. "Invalid vote ID"
- Használj létező szavazás ID-t
- Az ID-nak pozitív egész számnak kell lennie

### 3. "Vote is closed"
- Lezárt szavazásra nem lehet szavazni
- Aktiváld újra a szavazást, ha szükséges

### 4. "Cannot delete option with existing votes"
- Csak olyan opciót törölhetsz, amelyre még nem szavaztak
- A `voteCount` értékének 0-nak kell lennie

### 5. "Vote must have at least 2 options"
- Minden szavazásnak minimum 2 opcióval kell rendelkeznie
- Nem törölheted az utolsó 2 opciót

---

## Értékelési szempontok

A feladatok megoldása során figyelj a következőkre:
- ✅ Helyes HTTP metódus használata
- ✅ Megfelelő endpoint cím
- ✅ Helyes JSON formátum
- ✅ Válaszok értelmezése
- ✅ Hibakezelés megértése
- ✅ Dokumentáció követése

Sok sikert a feladatok megoldásához! 🚀
