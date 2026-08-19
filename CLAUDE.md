# CLAUDE.md – Project Instructions for All AIs

You are working on a fantasy Match-3 Tactical RPG.

## Mandatory First Steps
Before doing any work, always read these files in order:
1. context/GAME_OVERVIEW.md
2. context/GAME_MECHANICS.md
3. TODO.md
4. Any other relevant files in /context/

## Core Rules You Must Never Violate
- Match-3 board is on the **bottom**. Its baseline purpose is generating mana/stamina, but matches of 4+ tiles now spawn special tiles (Arcane Bomb, Runic Crystal) that CAN deal direct damage to the enemy team when later matched or activated — see "Match-3 Match Type Rules & Special Tiles" below and context/GAME_MECHANICS.md for the full mechanic. Match-3 still never creates new soldier/hero units on the battlefield — only damage and mana, never new combatants.
- Battlefield is on the **upper half** with left-vs-right positioning.
- Each side has a Melee zone (front) and Ranged zone (back). Team size is capped at `TEAM_CAP = 5` characters per side, any mix of Ranged/Melee. Both zones are placed by drag-and-drop: Ranged always shows `RANGED_SLOTS` (= 5) fixed, always-visible slots and the player drags a hero onto whichever empty slot they choose (gaps allowed). Melee has no slots of its own, but every Melee card visually snaps onto the Ranged grid: level with one Ranged row (`band: {type:'aligned', index}`), or straddling the half-step gap between two adjacent rows (`band: {type:'boundary', indices:[i,j]}`) — always resolvable since the Ranged grid exists whether filled or not. Two Melee may not share the same `band` (one guard per row/half-step; a drop onto an already-occupied band is rejected). What it actually protects (`coverage`) is derived live from `band` + which Ranged slots are currently filled, not frozen at drop time — see context/GAME_MECHANICS.md for the exact mechanism.
- Melee units can always attack enemy Melee. Melee can attack a specific enemy Ranged unit only if no living enemy Melee's `coverage` currently guards that unit's lane — this is a **per-lane** check, not an all-or-nothing "whole zone must be cleared" rule.
- Ranged units can attack any enemy.
- Every hero has their **own individual mana/stamina bar**.
- Battlefield capacity per side is `TEAM_CAP = 5` characters total (Ranged + Melee combined, any mix). The "Max 6v6" framing still applies at the campaign/meta level; this screen's capacity supersedes it locally.
- Heroes are drawn from a fixed named roster (see characters.js / Roster.html — currently 45 characters), not randomly generated. The player may deploy any of them; the enemy's team does not restrict the player's picks.
- The **enemy team is randomized fresh every time deployment is (re)entered** (`randomizeEnemyTeam()`, called from `initDeployment()`) — it is not fixed/static. Always `TEAM_CAP` (5) total, but the Ranged/Melee split itself is also randomized: one of two `ENEMY_FORMATIONS` is picked with equal probability each time — 3 Melee/2 Ranged (one Melee aligned per lane, one straddling the boundary between them) or 2 Melee/3 Ranged (two boundary guards side by side, covering all 3 lanes between them). Two hard constraints on every draw regardless of formation: at most 2 of the 5 may be Heroes (isSpecial), and the 5 must show at least 4 distinct colors (out of the 5 possible). The hero cap is enforced by construction (decide the hero/non-hero split before picking characters, not by rejecting random draws); the color rule is enforced by retrying the draw.
- **The enemy's setup is hidden during deployment** — the deployment (character placement) screen shows no enemy section at all: only the player's own Ranged/Melee columns, centered in the available width. Neither the enemy's characters nor its formation (and therefore not the Ranged/Melee split) are visible before the player commits their own team. `ENEMY_TEAM` is still decided at deployment-entry time (not re-randomized at Start Battle) — only its on-screen reveal is deferred; the live battle screen (`renderBattlefield()`) shows the real roster (and both sides' "YOU"/"ENEMY" column labels) as normal.
- Basic attacks are cheap; unlocked abilities cost more mana/stamina. Most characters share the same Basic Attack cost/damage (`BASIC_COST`/`BASIC_DMG`), but a character may override this with its own `basicCost`/`basicDmg` fields in characters.js for a heavier weapon (higher cost, higher damage) — `basicCostFor()`/`basicDmgFor()` resolve the actual values, and `maxManaFor()` accounts for the override so the character can actually reach the mana their attack needs.
- There is an optional auto-play toggle for the battlefield only.
- **The deployment screen's battlefield layout and the live battle screen's battlefield layout must stay visually identical** for the player's own columns: Ranged is always the fixed `RANGED_SLOTS` grid (a hero's row never shifts based on how many other slots are filled), and Melee cards are always pixel-aligned to their `band` (the Ranged row/gap they were snapped to), not sorted into a plain list. This was a real bug once (battle used a compacted list, deployment used the fixed grid) — see DECISIONS.md.
- **Match-3 Match Type Rules & Special Tiles** (full detail in context/GAME_MECHANICS.md):
  - **Match of 3** — removes the tiles, grants 1 mana/tile to every living player hero of that color, no other effect.
  - **Match of 4** — same 1 mana/tile, PLUS spawns an **Arcane Bomb** on the board (`boardSpecial[y][x] = 'bomb'`). When later matched or activated (matched into a new group — i.e. the player swaps in at least two more same-color tiles that connect to it — OR the player swaps any adjacent tile into/out of it even without forming a new match — OR the player directly taps its tile, no swap needed), it clears itself + its 4 orthogonal neighbors, all 5 cells pay mana by their own color, and it deals 2 damage to one random living enemy Melee (front-line) unit.
  - **Match of 5+ (straight run, or a T/L/plus formed by two intersecting runs of ≥3)** — same 1 mana/tile, PLUS spawns a **Runic Crystal** (`boardSpecial[y][x] = 'crystal'`). A crystal activates two ways: the player **directly taps its tile** (a single click, no swap needed — same as before), OR it gets **matched into a new group** the same way a Bomb does (the player swaps in at least two more same-color tiles that connect to it into a fresh ≥3 group) — either path opens the same choice modal. Being merely touched by an unrelated (non-matching, non-connecting) swap still does nothing special. A tap (or an auto-trigger via match) counts as the turn's one board action, same as a swap. Either way, the crystal's own tile always clears + pays its base 1 mana first, then the player chooses: Option A clears every tile of that color on the board (mana for all of them), or Option B ("Runic Wave") deals damage across all `RANGED_SLOTS` rows simultaneously instead (see `resolveRunicWaveHits()` — full-cover melee blocks the ranged unit behind it entirely; a straddling/boundary melee takes the full 3 once and one of its two guarded ranged lanes takes 2, the other stays protected).
  - There is no separate "+1 bonus mana" for 5-tile matches anymore — differentiation between tiers is entirely about which special tile spawns, not extra mana.
  - Match-3 grouping uses connected-component flood fill (`findMatchGroups()`), not flat per-color totals, so an intersecting horizontal+vertical run registers as one shaped group.

## How to Work
- After finishing a task, update TODO.md with what was done and what the next AI should do.
- When you make a design decision, record it in context/DECISIONS.md.
- Keep all new design documents inside the /context/ folder.
- Prefer clear, modular Markdown files over long walls of text.
- If something is ambiguous, list it under “Open Design Questions” instead of inventing a permanent rule.

## Project Goals
- Mobile-first (must run well on most phones and tablets)
- Fantasy theme
- Hero collection + Campaign + PvP + Hero side-story missions

Stay consistent with the existing design. Do not redesign core systems unless explicitly asked.