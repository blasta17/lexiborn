# LexiBorn — jeu multilingue de mots inventés

LexiBorn est une app Next.js avec :

- 4 langues : English, Français, Español, 中文
- un mot différent par langue
- thème light/dark
- votes et résultats communautaires
- score selon la popularité du choix
- badges sauvegardés en base : `community`, `rising`, `poetic`
- PostgreSQL prêt pour accepter des users plus tard

## 1. Lancer seulement PostgreSQL dans Docker sur ta VM

```bash
unzip lexiborn_multilingual_postgres_patch.zip
cd lexiborn_site

docker compose up -d postgres
```

Vérifier que la base roule :

```bash
docker compose ps
docker compose logs -f postgres
```

Tester la base :

```bash
docker compose exec postgres psql -U lexiborn -d lexiborn -c "\dt"
docker compose exec postgres psql -U lexiborn -d lexiborn -c "SELECT locale, word, slug FROM words ORDER BY locale, slug;"
```

## 2. Lancer le site localement avec la base Docker

Dans un autre terminal :

```bash
cp .env.example .env
npm install
npm run dev
```

Ouvrir :

```txt
http://localhost:3000/en/play
http://localhost:3000/fr/jeu
http://localhost:3000/es/juego
http://localhost:3000/zh/play
```

Tester la connexion DB depuis Next.js :

```txt
http://localhost:3000/api/health/db
```

## 3. Lancer le site complet en containers

```bash
docker compose up -d --build
```

Ouvrir :

```txt
http://IP_DE_TA_VM:3000/en
```

Voir les logs :

```bash
docker compose logs -f web
docker compose logs -f postgres
```

Arrêter :

```bash
docker compose down
```

Arrêter et supprimer les données PostgreSQL :

```bash
docker compose down -v
```

## 4. Tables importantes

La base contient déjà ces tables :

```txt
languages
users                 # prêt pour plus tard
badges
words                 # un mot par langue
word definitions      # table: definitions
votes                 # votes anonymes maintenant, users plus tard
definition_badges     # badges par définition
```

Le badge `Top guess` a été fusionné avec `Community pick`. Le choix numéro 1 de la communauté devient donc le badge `community`.

## 5. Voir le résultat officiel sauvegardé

```bash
docker compose exec postgres psql -U lexiborn -d lexiborn -c "
SELECT
  w.locale,
  w.word,
  d.text AS official_definition
FROM words w
JOIN definitions d ON d.id = w.official_definition_id
ORDER BY w.locale, w.word;
"
```

Voir les votes par définition :

```bash
docker compose exec postgres psql -U lexiborn -d lexiborn -c "
SELECT
  w.locale,
  w.word,
  d.text,
  d.base_votes + COUNT(v.id) AS total_votes
FROM definitions d
JOIN words w ON w.id = d.word_id
LEFT JOIN votes v ON v.definition_id = d.id
GROUP BY w.locale, w.word, d.id, d.text, d.base_votes
ORDER BY w.locale, w.word, total_votes DESC;
"
```

## 6. Production

Avant production, change le mot de passe PostgreSQL dans :

```txt
docker-compose.yml
.env
```

Puis garde la base non exposée publiquement. Dans ce pack, PostgreSQL est exposé seulement sur `127.0.0.1:5432` pour éviter un accès direct depuis Internet.
