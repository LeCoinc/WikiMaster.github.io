# Cabinet de collection — Wikimaster

Suivi personnel de collection pour [WikiMasters](https://www.wiki-masters.com) : les
drapeaux nationaux et la théogonie grecque. Page unique, sans serveur, sans compte,
sans dépendance à installer.

---

## Mise en ligne

1. Déposer tous les fichiers de ce dossier **à la racine** du dépôt.
2. Dans le dépôt GitHub : **Settings → Pages**.
3. Sous *Build and deployment*, choisir **Deploy from a branch**.
4. Sélectionner la branche `main` et le dossier `/ (root)`, puis **Save**.
5. Patienter une à deux minutes. L'adresse s'affiche en haut de la même page,
   sous la forme `https://<pseudo>.github.io/<dépôt>/`.

Le dépôt doit être **public**, sauf compte GitHub Pro.

### Installer sur le téléphone

Ouvrir l'adresse, puis « Ajouter à l'écran d'accueil » (Safari : bouton Partager ;
Chrome : menu ⋮). L'application s'ouvre alors en plein écran, sans barre de navigateur,
et fonctionne sans réseau après la première visite.

---

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'application : structure, styles, données, logique |
| `manifest.webmanifest` | Nom, couleurs et icônes pour l'installation sur l'écran d'accueil |
| `sw.js` | Service worker : met en cache la page, les drapeaux et les vignettes pour le mode hors-ligne |
| `favicon.svg` | Icône d'onglet |
| `icon-192.png`, `icon-512.png` | Icônes d'application |
| `icon-maskable-512.png` | Variante Android avec marge de sécurité |
| `apple-touch-icon.png` | Icône iOS |
| `.nojekyll` | Empêche GitHub de faire passer les fichiers par Jekyll |

Aucune étape de compilation : ce qui est dans le dépôt est ce qui est servi.

---

## Fonctionnement

**Drapeaux.** 197 pays — les 193 membres de l'ONU, plus le Vatican, la Palestine,
Taïwan et le Kosovo — rangés par continent. Un drapeau non obtenu s'affiche en gris ;
un clic le fait passer en couleur. Les images viennent de [flagcdn.com](https://flagcdn.com).

**Théogonie.** 131 entités, du Chaos aux monstres nés de Typhon, en deux vues :

- *Liste* — arborescence dépliable, fiche détaillée au survol ou au toucher.
- *Graphe* — arbre généalogique de gauche à droite. Les losanges bronze sont les
  unions, les pointillés bleus les liens de couple. Survoler une entité isole toute
  sa lignée, ascendants et descendants confondus.

**Coller une liste.** Accepte n'importe quel texte contenant des noms et coche
automatiquement ce qu'il reconnaît. Tolère les accents manquants, les majuscules,
la ponctuation, les alias courants (`USA`, `Hercule`, `Clotho`, `Méduse`) et
distingue les pièges classiques (*Niger* / *Nigeria*, les quatre Guinées).

**Vignettes.** Récupérées une seule fois auprès de l'API de Wikipédia en français,
puis conservées localement. Les entités sans illustration retombent sur leur initiale.

---

## Sauvegarde des données

La collection est enregistrée dans le `localStorage` du navigateur. Conséquences :

- Elle survit à la fermeture de l'onglet et au redémarrage de l'appareil.
- Elle **ne se synchronise pas** entre appareils : le téléphone et l'ordinateur
  tiennent deux collections distinctes.
- Vider les données du site l'efface.

Le bouton **Exporter** produit un fichier JSON ; **Importer** le relit. C'est le
pont entre appareils, et la seule sauvegarde réelle.

Ouvrir `index.html` par double-clic depuis le disque (`file://`) fonctionne, mais
la sauvegarde et le mode hors-ligne sont alors désactivés — les deux réclament
une origine `https://`.

---

## Retoucher le contenu

Tout est dans `index.html`, en clair.

- **La théogonie** : objet `MYTH`, environ 200 lignes après la balise `<script>`.
  Chaque entité porte `n` (nom), `g` (grec), `k` (catégorie), `d` (notice) et
  éventuellement `c` (descendance). Les unions sont les objets `{u:"A × B", c:[…]}`.
- **Les pays** : tableau `PAYS`, avec `c` (code ISO à deux lettres), `n` (nom),
  `z` (continent).
- **Les titres Wikipédia** : objet `WIKI`, à ne remplir que lorsque le titre de
  l'article diffère du nom affiché.
- **Les alias de reconnaissance** : objets `ALIAS_P` (pays) et `ALIAS_M` (mythologie).

Après modification du contenu, incrémenter `VERSION` dans `sw.js` (`wikimaster-v1`
→ `wikimaster-v2`) pour forcer les navigateurs déjà installés à récupérer la
nouvelle version.

---

## Crédits

Drapeaux : [flagcdn.com](https://flagcdn.com). Illustrations et notices : Wikipédia
et Wikimedia Commons, sous licence CC BY-SA. Généalogie établie d'après la
*Théogonie* d'Hésiode, avec les variantes homériques signalées dans les fiches.
