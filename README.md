# ihre-familienstiftung.de

Informationswebsite für Family Offices, vermögende Familien und Unternehmer. Sie erklärt, wie sich die Ziele einer Familienstiftung (Vermögensschutz, Nachfolge, Zusammenhalt des Familienvermögens, Governance) mit einem Lighthouse Trust und einer Wyoming-LLC abbilden lassen.

Betrieben als Informationsangebot von PAN21 (Harald Linhart). Keine Rechts-, Steuer- oder Anlageberatung. Keine Zusagen zu Steuern oder Gläubigerschutz.

Die Seiten sind statisch erzeugt (App Router, SSG). Das Kontaktformular ist eine Server-Route und wird auf Vercel als Function ausgeliefert. Ein reiner Static Export (`output: 'export'`) wäre mit dieser Route nicht vereinbar, deshalb ist er nicht gesetzt. Ein fehlender `RESEND_API_KEY` lässt den Build durchlaufen.

## Lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm test` prüft Spam-Filter, Kontaktentscheidung und Inhalte. `npm run build` erzeugt die Seiten und schreibt `public/llms.txt` sowie `public/llms-full.txt`.

## Umgebungsvariablen

| Variable | Pflicht | Bedeutung |
| --- | --- | --- |
| `RESEND_API_KEY` | ja, zum Senden | API-Schlüssel von Resend. Fehlt er, antwortet die Route zur Laufzeit mit einem Hinweis und bricht den Build nicht ab. |
| `CONTACT_FORM_SECRET` | ja | Geheimnis für die HMAC-Signatur des Formularzeitstempels. Langer Zufallswert. |
| `CONTACT_FROM` | nein | Absender. Standard: `Ihre Familienstiftung <kontakt@pan21.com>`. Die Domain muss bei Resend freigeschaltet sein. |
| `CONTACT_TO` | nein | Empfänger. Standard: `familienstiftung@pan21.com`. |

## Kontakt und Spam

`POST /api/contact` sendet über Resend. `replyTo` ist die Adresse der absendenden Person. HTML in der Mail wird maskiert. Felder: Name, E-Mail, Telefon (optional), Interesse, Nachricht, Datenschutz-Einwilligung.

Stiller Erfolg, also dieselbe Antwort wie nach einer echten Nachricht und ohne E-Mail, bei:

- ausgefülltem Honeypot
- Absenden in unter 3 Sekunden oder ungültiger Signatur
- Stichworten zu Casino, SEO-Diensten, Backlinks, Kreditangeboten und Krypto-Investments, auch verschleiert
- mehr als zwei Links in der Nachricht oder einem Link im Namen
- Zufallszeichen und überwiegend kyrillischen oder CJK-Texten

Echte Fehler bleiben sichtbar: fehlende Pflichtfelder, abgelaufenes Formular (älter als 4 Stunden) und mehr als 3 sendefähige Anfragen pro IP und Stunde. Das Limit liegt im Speicher der laufenden Instanz.

## Seiten

`/`, `/familienstiftung`, `/lighthouse-trust`, `/wyoming-llc`, `/family-office`, `/vergleich`, `/ablauf`, `/faq`, `/kontakt`, `/impressum`, `/datenschutz`.

Impressum und Datenschutz sind Platzhalter mit markiertem TODO. Es sind keine Anschriften erfunden.

## Google Analytics

Auf jeder Seite lädt gtag.js die Mess-ID `G-GN3HXD8XL1`. Consent Mode v2 setzt analytics_storage, ad_storage, ad_user_data und ad_personalization zuerst auf denied. Der Banner speichert „Akzeptieren“ oder „Ablehnen“ im localStorage. Ablehnen löscht Cookies, deren Name `_ga` ist oder mit `_ga_` beginnt. Der Fuß bietet „Cookie-Einstellungen“, um die Wahl zu ändern.

## Deployment

Für Vercel aus diesem Repository. Framework Next.js, Build `npm run build`. Kanonische Adresse: `https://www.ihre-familienstiftung.de`.
