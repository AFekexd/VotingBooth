Vooting booth 

Egy backend példa CRUD operációkhoz. Oktatás céljából.

Express.js + Node.js + MySQL + Prisma

## Telepítés

1. Függőségek telepítése:
```bash
npm install
```

2. .env fájl beállítása MySQL adatokkal

3. Prisma generálás és migráció:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Szerver indítása:
```bash
npm run dev
```

## API pontok:

**Szavazások kezelése:**
- `GET /api/v1/votes` - Összes szavazás lekérése
- `GET /api/v1/votes/:id` - Egy szavazás lekérése
- `POST /api/v1/votes` - Új szavazás létrehozása
- `PUT /api/v1/votes/:id` - Szavazás módosítása
- `DELETE /api/v1/votes/:id` - Szavazás törlése

**Szavazás funkciók:**
- `POST /api/v1/votes/:id/cast` - Szavazat leadása
- `GET /api/v1/votes/:id/results` - Eredmények lekérése

## Példa használat:

### Új szavazás létrehozása:
```json
POST /api/v1/votes
{
  "title": "Mi a kedvenc programozási nyelved?",
  "description": "Szavazz a kedvenc nyelvedre",
  "options": [
    { "optionText": "JavaScript" },
    { "optionText": "Python" },
    { "optionText": "Java" }
  ]
}
```

### Szavazat leadása:
```json
POST /api/v1/votes/1/cast
{
  "optionId": 2
}
```

Részletes dokumentáció: README.md