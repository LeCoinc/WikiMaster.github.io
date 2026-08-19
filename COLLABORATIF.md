# Partage entre amis

Chacun tient sa collection, tout le monde voit celle des autres, et n'importe qui peut
cocher à la place de n'importe qui. **Aucun compte, aucun mot de passe, aucun e-mail.**

Un seul secret circule : le **code de guilde**, que vous vous transmettez entre vous.
Il tient lieu d'adresse et de clé. Il n'est jamais dans le dépôt.

Sans configuration, rien ne se déclenche : la page reste strictement locale et l'onglet
**Groupe** se contente d'expliquer comment l'activer. Vous pouvez donc mettre le site
en ligne d'abord et brancher le partage plus tard.

Comptez dix minutes.

---

## 1. Créer le projet Supabase

Sur [supabase.com](https://supabase.com), créez un compte puis un projet. Choisissez une
région proche — Francfort ou Paris. L'initialisation prend une ou deux minutes.

## 2. Créer la table

Menu de gauche → **SQL Editor** → **New query**. Collez l'intégralité de `supabase.sql`,
puis **Run**. Le script crée la table `collections`, l'horodatage automatique et la
règle de sécurité. Il est réexécutable sans risque.

## 3. Renseigner `config.js`

**Project Settings** → **API**. Deux valeurs à recopier dans `config.js` :

```js
window.CONFIG = {
  url: "https://xxxxxxxxxxxx.supabase.co",
  cle: "eyJhbGciOi..."          // clé publique « anon »
};
```

Committez, poussez, attendez le rafraîchissement de GitHub Pages.

## 4. Ouvrir le groupe

Onglet **Groupe**. Un code est proposé au hasard — gardez-le ou changez-le, il doit
faire au moins huit signes. Choisissez un pseudo, validez.

Puis **Copier l'invitation** : vous obtenez un lien qui contient le code. Envoyez-le à
vos amis par message. Ils n'auront qu'à choisir un pseudo, le code étant déjà rempli.

C'est fini.

---

## Ce que ça donne

L'onglet Groupe liste toutes les collections. Touchez un nom pour ouvrir celle de
quelqu'un d'autre : un bandeau doré apparaît en haut de l'écran pour vous rappeler que
vous n'êtes plus chez vous, et un lien vous ramène à votre collection.

Le bouton **Créer** ajoute une personne sans qu'elle ait besoin d'être là — pratique
pour amorcer la collection d'un ami pendant qu'il ouvre ses paquets.

Un bloc **Comparaison** montre, pour chaque membre, ce qu'il a en plus et en moins.
Accessoire, replié par défaut, mais ça évite de chercher.

## Où en est la sécurité, exactement

Il faut être précis, parce que les deux moitiés ne se valent pas.

**La clé `anon` sera publique** — elle est dans `config.js`, donc dans votre dépôt, donc
lisible par tout le monde. C'est normal, elle est faite pour ça.

**Seule, elle ne donne accès à rien.** La règle de sécurité exige que chaque requête
porte le bon code de guilde dans un en-tête. Sans ce code, la table apparaît vide et
toute écriture est refusée. Un robot qui moissonne les clés Supabase sur GitHub
repartira les mains vides.

**Avec le code, tout est ouvert.** Quiconque le connaît peut lire et modifier les
collections de la guilde. C'est le comportement demandé — vos amis doivent pouvoir
cocher à votre place. Corollaire : ne publiez pas le code dans le README, ne le mettez
pas dans le dépôt, transmettez-le par message privé.

Le suffixe aléatoire du code proposé n'est pas décoratif : `arvernes` se devine,
`arvernes-7f3k9x` non.

Et si tout cela s'effondre, l'enjeu se limite à une liste de cases cochées, dont le
bouton **Exporter** vous donne une copie.

## Si l'onglet Groupe affiche une erreur réseau

Sur certaines configurations, le navigateur peut refuser l'en-tête personnalisé qui
transporte le code. Le bas de `supabase.sql` contient une politique de secours à
décommenter : la table devient alors accessible avec la seule clé `anon`. Moins propre,
mais fonctionnel — et l'enjeu, encore une fois, reste mince.

## La mise en pause

Un projet Supabase gratuit s'endort après sept jours sans requête ; le réveil prend une
trentaine de secondes. Le fichier `.github/workflows/reveil-supabase.yml` l'évite en
interrogeant la base deux fois par semaine.

Pour l'activer, créez deux secrets dans **Settings → Secrets and variables → Actions** :

| Nom | Valeur |
|---|---|
| `SUPABASE_URL` | `https://xxxxxxxxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | la clé publique anon |

Puis lancez-le une fois à la main depuis l'onglet **Actions**. Attendez-vous à une
réponse `200` avec un tableau vide : c'est normal, le ping n'envoie pas de code de
guilde et ne voit donc rien. Cela suffit à réveiller la base.

Une subtilité de GitHub : les workflows planifiés sont désactivés dans les dépôts sans
activité depuis soixante jours. Un commit de temps en temps les maintient.

---

## Comment la fusion fonctionne

Chaque changement est inscrit avec l'instant où il a eu lieu :

```json
{ "f:fr": [1, 1755500000000], "m:zeus": [0, 1755499000000] }
```

`1` pour une carte obtenue, `0` pour une carte retirée, suivi de l'horodatage. Quand
deux appareils se retrouvent, on garde pour chaque carte l'inscription la plus récente
— jamais le document entier.

Vous pouvez donc cocher dans le métro pendant qu'un ami coche chez lui : rien ne se perd
à la reconnexion, et un décochage volontaire n'est pas ressuscité par une vieille
sauvegarde.

La synchronisation part toutes les vingt secondes, au retour sur l'onglet, au retour du
réseau, et une seconde et demie après votre dernière coche.

## Ce que le partage ne fait pas

- **Il ne compte pas les doublons.** La page suit ce que vous possédez, pas en combien
  d'exemplaires.
- **Il ne protège de rien à l'intérieur du groupe.** C'est voulu.
- **Il ne remplace pas l'export.** Le bouton Exporter reste la seule sauvegarde
  indépendante de Supabase comme du navigateur.
