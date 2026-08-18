# Cabinet de collection — Wikimaster

Suivi personnel de collection pour [WikiMasters](https://www.wiki-masters.com) : les
drapeaux nationaux, la théogonie grecque et les souverains de France. Page unique,
sans serveur, sans compte, sans dépendance à installer.

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
| `config.js` | Clés de partage Supabase — laissé vide, la page reste locale |
| `supabase.sql` | Schéma et règles de sécurité à exécuter dans Supabase |
| `COLLABORATIF.md` | Marche à suivre pour activer le partage entre amis |
| `.github/workflows/` | Réveil hebdomadaire du projet Supabase gratuit |
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

**Souverains.** 100 règnes en sept dynasties, des chefs gaulois d'avant la conquête
à Napoléon III : Mérovingiens, Carolingiens, Capétiens directs, Valois, Bourbons,
Empires et Restauration. Chaque entrée porte son titre exact, ses dates de règne,
son portrait et une notice accessible au survol ou par le bouton ⓘ.

**Groupe.** Partage sans compte ni mot de passe : un code de guilde transmis par lien
d'invitation suffit. Chacun tient sa collection, toutes sont visibles, et n'importe qui
peut cocher à la place de n'importe qui. Inerte tant que `config.js` n'est pas renseigné.

**Coller une liste.** Accepte n'importe quel texte contenant des noms et coche
automatiquement ce qu'il reconnaît. Tolère les accents manquants, les majuscules,
la ponctuation, les alias courants (`USA`, `Hercule`, `Clotho`, `Méduse`) et
distingue les pièges classiques (*Niger* / *Nigeria*, les quatre Guinées,
*Louis XVI* / *Louis XVIII*, *Philippe V* / *Philippe VI*).

**Vignettes.** Récupérées une seule fois auprès de l'API de Wikipédia en français :
un appel groupé par lot de 40, puis un rattrapage par recherche plein texte pour les
titres restés sans image. Le résultat est conservé localement, donc instantané ensuite.
Les entités sans illustration retombent sur leur initiale.

---

## Sauvegarde des données

La collection est toujours enregistrée dans le `localStorage` du navigateur : elle
survit à la fermeture de l'onglet, au redémarrage, et à l'absence de réseau. Vider
les données du site l'efface.

**Sans partage configuré**, c'est tout : le téléphone et l'ordinateur tiennent deux
collections distinctes, et le bouton **Exporter** est le pont entre les deux.

**Avec le partage** (voir `COLLABORATIF.md`), chaque appareil continue de travailler
en local puis se synchronise avec Supabase. Vos appareils convergent, et les
collections de la guilde apparaissent dans l'onglet **Groupe**. La fusion se fait carte
par carte selon l'horodatage, donc deux appareils modifiés hors ligne ne s'écrasent
jamais l'un l'autre.

Le bouton **Exporter** reste la seule sauvegarde vraiment indépendante.

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
- **Les souverains** : tableau `ROIS`, groupé par dynastie. Chaque règne porte
  `n` (nom), `e` (titre), `a` (dates), `t` (notice) et `w` si le titre de l'article
  Wikipédia diffère du nom.
- **Les titres Wikipédia** : objet `WIKI`, à ne remplir que lorsque le titre de
  l'article diffère du nom affiché.
- **Les alias de reconnaissance** : objets `ALIAS_P` (pays), `ALIAS_M` (mythologie)
  et `ALIAS_R` (souverains).

Après modification du contenu, incrémenter `VERSION` dans `sw.js` (`wikimaster-v1`
→ `wikimaster-v2`) pour forcer les navigateurs déjà installés à récupérer la
nouvelle version.

---

## Crédits

Drapeaux : [flagcdn.com](https://flagcdn.com). Illustrations et notices : Wikipédia
et Wikimedia Commons, sous licence CC BY-SA. Généalogie établie d'après la
*Théogonie* d'Hésiode, avec les variantes homériques signalées dans les fiches.
