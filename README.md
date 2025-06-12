# Random Joke Rating Application

Dette er en webapplikasjon som viser tilfeldige vitser og lar brukere rangere dem. Applikasjonen henter vitser fra en ekstern API, lar brukeren gi en vurdering fra 1-5 stjerner, og viser gjennomsnittlige vurderinger for hver vits.

## Funksjonalitet

- Vise tilfeldige vitser med oppsett og punchline
- La brukere rangere vitser med 1-5 stjerner
- Vise gjennomsnittsvurderinger for hver vits
- Automatisk oppdatering av rangeringsinformasjon
- Responsivt design som fungerer på mobile enheter
- Beskyttelse mot overbelastning med rate limiting

## API-dokumentasjon

Applikasjonen har følgende API-endepunkter:

### `GET /api/joke`

Henter en tilfeldig vits.

**Response: (success(200))**
```json
{
  "id": "364",
  "setup": "A programmer puts two glasses on his bedside table before going to sleep.",
  "punchline": "A full one, in case he gets thirsty, and an empty one, in case he doesn’t."
}
```

**Response: (error(500))**
```json
{
  "error": "Kunne ikke hente vitsen"
}
```

### `POST /api/rate`

Registrerer en vurdering for en vits.

**Request:**
```json
{
  "jokeId": "364",
  "rating": 2
}
```

**Response: (success(201))**
```json
{
  "message": "Vurdering lagret",
  "average": "2.5",
  "count": 3
}
```

**Response: (error(400))**
```json
{
  "error": "Ugyldig vurdering"
}
```

### `GET /api/rating/:jokeId`

Henter gjennomsnittsvurdering for en bestemt vits.

**Response: (success(200))**
```json
{
  "average": "4.5",
  "count": 2
}
```

## Prosjektskisse

![randomJoke Nettverksdiagram](./public/uploads/randomJoke_Cisco.png)

### Systemarkitektur
```
+----------------+      HTTP      +----------------+      +----------------+
|                |  Forespørsler  |                |      |                |
|   EJS Views    | ------------> |    Backend     | <--> |    Database    |
|   (Browser)    |   Responser    |   (Node.js)    |      |   (MongoDB)    |
|                | <------------ |                |      |                |
+----------------+               +----------------+      +----------------+
```

### Database-modeller

#### Model: Rating
- `jokeId`: String (unik identifikator for vitsen)
- `totalRating`: Number (summen av alle vurderinger)
- `ratingCount`: Number (antall vurderinger)
- `timestamps`: Date (createdAt og updatedAt)

### IP-plan
- **Backend:** 10.12.95.100/24
- **Database:** 10.12.95.101/24 (lukket nettverk)
- **DNS:** 10.12.95.10/24

## Sikkerhetsvurdering

### Implementerte sikkerhetstiltak

1. **Rate limiting**
   - Beskrivelse: Begrenser antall API-forespørsler fra samme IP-adresse.
   - Implementering: Express Rate Limit middleware med 5 forespørsel per 10 sekunder.
   - Formål: Forhindrer DoS-angrep og begrenser automatisert misbruk av API-et.

2. **Input validering**
   - Beskrivelse: Validerer alle brukerinput før de lagres i databasen.
   - Implementering: Server-side validering av jokeId og rating (1-5).
   - Formål: Forhindrer injeksjonsangrep og sikrer dataintegritet.

3. **Strukturert feilhåndtering**
   - Beskrivelse: Håndterer feil på en konsistent og sikker måte.
   - Implementering: Try-catch blokker med spesifikke feilmeldinger.
   - Formål: Forhindrer lekkasje av sensitiv informasjon gjennom feilmeldinger.

### Potensielle angrepstyper

1. **Denial of Service (DoS) angrep**
   - Beskrivelse: Overbelastning av serveren med mange forespørsler for å gjøre tjenesten utilgjengelig.
   - Mulig konsekvens: Serveren blir treg eller utilgjengelig for legitime brukere.
   - Beskyttelsestiltak: Rate limiting implementert for å begrense antall forespørsler fra samme IP.

2. **Injection-angrep**
   - Beskrivelse: Forsøk på å manipulere database-spørringer gjennom brukerinput.
   - Mulig konsekvens: Uautorisert tilgang til eller manipulering av databasen.
   - Beskyttelsestiltak: Input validering og bruk av Mongoose (ODM) som saniterer input.

3. **Cross-Site Scripting (XSS)**
   - Beskrivelse: Injisering av skadelig JavaScript på nettsiden.
   - Mulig konsekvens: Tyveri av brukerdata eller manipulering av nettsiden.
   - Beskyttelsestiltak: EJS templating rømmer automatisk HTML-tegn i output.

### Tiltak for å redusere risiko for sikkerhetsbrudd

1. **Segregert nettverksarkitektur**
   - Beskrivelse: Databasen er plassert i et lukket nettverk som kun er tilgjengelig fra backend-serveren.
   - Implementering: Firewall-regler og nettverk-segmentering.

2. **Ingen sensitive brukerdata**
   - Beskrivelse: Applikasjonen lagrer ikke personidentifiserbare opplysninger.
   - Implementering: Kun aggregerte data om vurderinger lagres.

3. **Regelmessige oppdateringer**
   - Beskrivelse: Holde alle avhengigheter og programvare oppdatert.
   - Implementering: Automatiserte GitHub workflows sjekker for sårbarheter.