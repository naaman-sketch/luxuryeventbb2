# LuxuryB2B — Configurateur d'événements B2B (LuxuryEvent)

Site de génération de leads : les enseignes composent leur événement promotionnel,
voient l'impact, et cliquent « Ça m'intéresse » → lead + webhook. Multilingue FR/NL/EN.

- **/** : catalogue d'animations + pop-ups détaillés + formulaire d'intérêt
- **/admin** : dashboard (textes, images, vidéos, marques, FAQ, webhook) + leads (pipeline, export CSV)
- **/mentions-legales** · **/confidentialite** : pages légales

Stack : Next.js 15 · Tailwind · framer-motion · Airtable (contenu + leads). Pas de paiement.

---

## 1. Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigne les valeurs
npm run dev                  # http://localhost:3000
```

Sans Airtable, le site public marche avec les **textes par défaut** ; l'admin ne
se connecte pas tant que `ADMIN_DASHBOARD_TOKEN` + Airtable ne sont pas configurés.

## 2. Créer la base Airtable

1. Crée une base (ex. « LuxuryB2B »).
2. Deux tables :
   - **Paramètres** : colonnes `Key` (texte) et `Value` (texte long).
   - **Webhooks** : colonnes `EventID`, `EventType`, `ReceivedAt` (date de création), `Processed` (case), `Payload` (texte long).
3. Génère un **Personal Access Token** (scopes `data.records:read` + `data.records:write`, sur cette base) : https://airtable.com/create/tokens
4. Récupère l'**ID de la base** (`app...`) dans l'URL de la base.

## 3. Déployer sur Vercel

1. Pousse ce dossier sur un repo GitHub (voir plus bas).
2. Sur https://vercel.com → **Add New… → Project** → importe le repo.
3. Framework détecté : **Next.js** (rien à changer).
4. **Environment Variables** : copie toutes les clés de `.env.example` avec tes valeurs
   (`ADMIN_DASHBOARD_TOKEN`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_SETTINGS_TABLE`,
   `AIRTABLE_WEBHOOKS_TABLE`, `NEXT_PUBLIC_SITE_URL`, et les optionnelles).
5. **Deploy**. Puis mets à jour `NEXT_PUBLIC_SITE_URL` avec l'URL finale et redeploie.
6. (Optionnel) Branche ton domaine dans Vercel → **Settings → Domains**.

### Pousser sur GitHub

```bash
git init
git add -A
git commit -m "LuxuryB2B - initial"
git branch -M main
git remote add origin https://github.com/<toi>/luxuryb2b.git
git push -u origin main
```

## 4. Après déploiement

- Va sur **/admin**, connecte-toi avec `ADMIN_DASHBOARD_TOKEN`.
- Onglet **Contenu** : mets tes images/vidéos par animation, la vidéo Story (FR/NL), le webhook.
- Onglet **Leads** : suit la prospection (statut, note, export CSV).
