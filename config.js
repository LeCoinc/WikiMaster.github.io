/* ---------------------------------------------------------------------
   Partage entre amis — configuration.

   Laissez les deux champs vides pour utiliser la page en solitaire :
   la collection reste alors enregistrée sur cet appareil, et l'onglet
   Groupe se contente d'expliquer comment activer le partage.

   Pour l'activer, collez ici les deux valeurs de votre projet Supabase
   (Project Settings → API) :
     url  →  Project URL,      de la forme https://xxxx.supabase.co
     cle  →  clé publique anon

   La clé anon est faite pour être publique : c'est la sécurité au niveau
   des lignes, définie dans supabase.sql, qui empêche quiconque d'écrire
   dans la collection d'un autre. Ne collez jamais ici la clé service_role.
--------------------------------------------------------------------- */
window.CONFIG = {
  url: "https://ayzmcicfsrwhgrbgwhpn.supabase.co",
  cle: "sb_publishable_DCv9aQ6n_1t1MNm12lIK7g_SHqdfVJK"
};


