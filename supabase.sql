-- =====================================================================
--  Cabinet de collection — schéma Supabase, version sans connexion
--  À coller dans le SQL Editor du projet, puis exécuter.
--  Réexécutable sans risque.
-- =====================================================================

-- Si la version précédente avec authentification a été installée :
drop table if exists public.joueurs cascade;
drop function if exists public.ma_guilde() cascade;

-- ---------------------------------------------------------------------
--  Une ligne par personne et par guilde. Pas de compte, pas de mot de
--  passe : le pseudo suffit à identifier une collection.
--
--  `etat` est un registre horodaté : { "f:fr": [1, 1755500000000], ... }
--  1 = carte possédée, 0 = carte retirée, suivi de l'instant du dernier
--  changement. C'est ce qui permet de fusionner deux appareils modifiés
--  hors ligne sans perdre de coche.
-- ---------------------------------------------------------------------
create table if not exists public.collections (
  guilde text        not null check (char_length(guilde) between 8 and 60),
  pseudo text        not null check (char_length(pseudo) between 2 and 24),
  etat   jsonb       not null default '{}'::jsonb,
  maj    timestamptz not null default now(),
  primary key (guilde, pseudo)
);

-- ---------------------------------------------------------------------
--  Horodatage automatique
-- ---------------------------------------------------------------------
create or replace function public.touche_maj()
returns trigger language plpgsql as $$
begin new.maj = now(); return new; end $$;

drop trigger if exists collections_maj on public.collections;
create trigger collections_maj
  before update on public.collections
  for each row execute function public.touche_maj();

-- ---------------------------------------------------------------------
--  Sécurité au niveau des lignes
--
--  Personne ne se connecte, donc il n'y a pas d'identité à vérifier.
--  Ce qui tient lieu de clé, c'est l'en-tête `x-guilde` que la page
--  envoie à chaque requête : sans le bon code, la table est vide et
--  toute écriture est rejetée.
--
--  Conséquence à assumer : quiconque connaît le code peut lire ET
--  modifier toutes les collections de cette guilde. C'est exactement
--  ce qu'on veut ici — mais ne mettez jamais le code dans le dépôt.
-- ---------------------------------------------------------------------
alter table public.collections enable row level security;

drop policy if exists acces_par_guilde on public.collections;

create policy acces_par_guilde on public.collections
  for all to anon, authenticated
  using      (guilde = current_setting('request.headers', true)::json ->> 'x-guilde')
  with check (guilde = current_setting('request.headers', true)::json ->> 'x-guilde');

-- ---------------------------------------------------------------------
--  Vérification (facultatif)
--  Doit renvoyer une politique nommée acces_par_guilde, et true.
-- ---------------------------------------------------------------------
-- select policyname, cmd from pg_policies where tablename = 'collections';
-- select relrowsecurity from pg_class where relname = 'collections';

-- ---------------------------------------------------------------------
--  SECOURS — si l'en-tête personnalisé ne passe pas
--
--  Sur certaines configurations, l'en-tête `x-guilde` peut être bloqué
--  par la vérification CORS du navigateur. Le symptôme : l'onglet Groupe
--  affiche une erreur réseau alors que la page se charge normalement.
--
--  Dans ce cas, décommentez les trois lignes ci-dessous. La table devient
--  alors lisible et modifiable par quiconque possède la clé anon, donc
--  par quiconque lit le source de la page. Pour un suivi de collection
--  entre amis, c'est acceptable ; sachez seulement ce que vous faites.
-- ---------------------------------------------------------------------
-- drop policy if exists acces_par_guilde on public.collections;
-- create policy acces_ouvert on public.collections
--   for all to anon, authenticated using (true) with check (true);
