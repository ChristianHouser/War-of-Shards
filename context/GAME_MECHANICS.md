# Game Mechanics

## Screen Layout
- **Bottom half**: Match-3 board
- **Upper half**: Battlefield (left vs right facing)

## Battlefield Structure
- Each side has two zones — **Melee** (front line) and **Ranged** (back line) — but there is **no fixed slot or lane count**. Instead, `TEAM_CAP = 5`: a hard cap on total characters per side, any mix of Ranged and Melee (e.g. 5 Ranged/0 Melee, 2 Ranged/3 Melee, etc. are all legal).
- Missions can have uneven team sizes (example: player 4 vs enemy 5, both still ≤ `TEAM_CAP`)
- Heroes are placed by hand pre-battle from your available roster (the full 45-character roster — the enemy's team does not restrict the player's choices). Four filter chips (Melee, Ranged, Heroes, Non-Heroes) + a Clear button on the deployment screen help browse the full list; chips are independently toggleable and combine — multiple chips within the same group (Melee/Ranged, or Heroes/Non-Heroes) are OR'd together, while chips across the two groups are AND'd (e.g. Heroes + Ranged narrows to Ranged Heroes only). The enemy team is randomized fresh every time you (re)enter deployment — see "Enemy Team Randomization" below.
- **The deployment screen and the live battle screen render the player's own Ranged/Melee columns identically.** Ranged is always the fixed `RANGED_SLOTS` grid (same row positions whether you're still placing heroes or mid-fight); Melee cards stay pixel-aligned to their `band` in both screens. A hero never visually jumps to a different row/position when you hit Start Battle. (The enemy's columns are a simple centered list in both screens, since the enemy roster isn't interactively arranged by the player.)
- The dashed "placement lining" around the player's Melee column (a drag-target hint) only shows during deployment — it disappears once the battle starts, since nothing is draggable there anymore. A separate, permanent dotted divider marks the boundary between the player's two columns and the enemy's two columns in both screens (deliberately a plain "your side / their side" separator, distinct in style from the deployment-only dashed hint — noted as a placeholder ("for now") worth revisiting with more visual polish later).
- **Ranged placement**: drag-and-drop onto a fixed grid. The Ranged column always shows exactly `RANGED_SLOTS` (= `TEAM_CAP` = 5) slots — filled or empty (dashed "drag here" placeholder) — at fixed positions. Dragging a Ranged character (from the roster, or an already-placed one) and dropping it on any empty slot places it there — the player picks exactly which slot, so gaps are allowed (e.g. slots 1 and 3 filled, others empty). Dropping on an already-occupied slot is rejected (no swap); dropping outside the battlefield removes the hero being dragged if it was already placed.
- **Melee placement**: drag-and-drop, snapped to the Ranged grid — no fixed slots of its own, but every Melee card visually locks onto one of two positions relative to the (always-rendered, filled-or-not) Ranged slots: **level with one Ranged row**, or **on the half-step gap between two adjacent Ranged rows** (straddling both). Dragging a Melee character (from the roster, or an already-placed card being repositioned) up and down live-previews this: the target row/gap lights up gold as you move, and any Ranged slot(s) it would actually protect (see below) additionally light up green. Releasing over the Melee column snaps the card into place there; releasing outside cancels the placement (or removes the hero, if it was already placed).
- Multiple Melee heroes may stack on the same row or the same half-step gap — there's no 1-guard-per-row restriction (they fan out slightly on screen so they don't fully overlap).
- Each Melee card is rendered pixel-aligned with the Ranged row (or gap) it's on — not just sorted into a list — so "same row" and "half step" are literal visual facts, not an approximation. The Ranged column always shows its `RANGED_SLOTS` fixed rows (filled or empty); Melee cards align against that same grid. Each Melee card shows a coverage tag (e.g. "🛡 R1" or "🛡 R1+R2") indicating what it currently guards.

### Melee Stagger / Half-Step Coverage
A Melee hero's **position** and what it **protects** are two separate things:
- **Position (`band`)** is pure geometry — which Ranged row it's level with, or which adjacent pair of rows it straddles — and is always resolvable, since the Ranged grid (`RANGED_SLOTS`, fixed length) exists whether or not those slots are actually filled. Placing a Melee hero next to a still-empty Ranged row is allowed; it just isn't protecting anyone yet.
- **Protection (`coverage`)** is derived live from position + which Ranged slots are currently filled: a Melee **fully aligned** to one Ranged row fully covers just that lane. A Melee on a **boundary/half-step** position shares cover of both neighboring rows, but **only if both are actually filled** ("as long as both ranged are together"). If only one neighboring row has a Ranged hero, it simply guards that one; if neither does yet, it guards nothing — until a Ranged unit is later placed into one of those rows, at which point the already-placed Melee hero automatically starts protecting it (no need to re-drag).
- Coverage is **binary** — "partial" and "full" protection both fully block opposing melee from reaching that ranged unit; there is no damage-reduction gradient.
- Implementation: `computeSlotBand(rects, y)` is a pure geometry function — given the live on-screen positions of all `RANGED_SLOTS` Ranged slots (filled or empty) and a Y coordinate, it returns which row or which boundary gap that Y falls on. `resolveMeleeCoverage(band, filledMask)` turns a `band` into actual coverage (`{type:'aligned', lane}`, `{type:'boundary', lanes:[a,b]}`, or `null`) using which slots are currently filled — called fresh whenever coverage needs to be known (rendering, battle start), not frozen at drop time. There is no static slot → lane table.
- With only 5 total characters per side, most deployments will have very few Melee guarding many Ranged lanes (or vice versa) — stacking multiple Melee on the same row/half-step is expected and allowed, e.g. as a way to double-guard a key Ranged unit.

### Targeting Rules
- Melee units can always attack any living enemy Melee unit.
- Melee units can attack a specific enemy Ranged unit only if no living enemy Melee's `coverage` currently guards that unit's lane (see coverage section above). This is checked **per ranged unit**, not per zone — a lane can be open for attack even while other enemy Melee units are still alive elsewhere.
- Ranged units can attack any enemy unit (they shoot over the melee line).

## Enemy Team Randomization
- The enemy roster is regenerated every time deployment is (re)entered (`randomizeEnemyTeam()`, called from `initDeployment()`) — not fixed per mission. Always `TEAM_CAP` (5) total: 2 Ranged + 3 Melee, the same shape the enemy team has always had.
- **Hero cap**: at most 2 of the 5 may be Heroes (`isSpecial`) — at least 3 must be plain non-hero troops. Enforced by construction: the draw first decides how many Heroes (0, 1, or 2) and how they split across the Ranged/Melee roles, then picks specific characters from the matching type+specialty pool — it does not rely on rejecting random 5-character draws until one happens to satisfy the cap (with roughly 7 of every 10 characters being Heroes, that would rarely succeed quickly).
- **Color diversity**: the 5 chosen characters must show at least 4 distinct colors (of the 5 possible match-3 colors — so at most one same-color pair is allowed). Enforced by retrying the draw (bounded attempts) until satisfied; much higher base probability than the hero constraint, so this converges quickly in practice.
- Melee coverage assignment uses the same fixed lane pattern the original static team used (first Melee aligned to lane 0, second straddles the boundary between lanes 0/1, third aligned to lane 1) — a property of Ranged always having exactly 2 lanes, independent of which characters are drawn into those roles.
- The player's own character pool is unaffected — any of the 45 characters may still be picked regardless of what the randomizer drew for the enemy, including the same character on both sides.

## Match-3 Board
- Each hero has their **own individual mana/stamina bar**.
- Matches never create new soldier/hero units on the battlefield. As of the Match Type Rules overhaul below, matches of 4+ tiles CAN deal direct damage to the enemy team — this supersedes the older "Match-3 never deals direct damage" rule.
- `board[y][x]` holds each cell's color; a parallel grid `boardSpecial[y][x]` (null | `'bomb'` | `'crystal'`) tracks whether that cell also holds a special tile. A cell's color and its special status move together through gravity/fill (`applyGravityAndFill()`).

### Match Type Rules
Match resolution groups matched cells into same-color, orthogonally-connected components (`findMatchGroups()`) rather than a flat per-color tally — this is what makes an intersecting horizontal-3 + vertical-3 register as one 5-cell T/L/plus-shaped group instead of two separate 3-groups. Every tier grants **1 mana per tile, uniformly** — there is no extra flat bonus for larger matches; the only differentiation between tiers is which special tile spawns.

- **Match of 3 tiles** — removes the tiles. Grants 1 mana per tile to every living player hero of that color. No other effect.
- **Match of 4 tiles → Arcane Bomb** — grants 1 mana per tile immediately, and one cell of the group becomes an **Arcane Bomb** (`boardSpecial = 'bomb'`) instead of clearing (chosen by `pickSpawnCell()`: the cell the player's swap landed on, if part of the group, else the group's shape "intersection" cell, else the middle of a straight run). When the Arcane Bomb is later **matched** (caught in a new same-color connected match) **or activated** (the player swaps any adjacent tile into or out of its cell, even if that swap doesn't itself form a new color-match):
  - It removes itself + its 4 orthogonal neighbors (up/down/left/right).
  - All 5 tiles (bomb cell + 4 neighbors) pay out mana as normal, each by **its own** color.
  - It deals 2 damage to one random living enemy Melee (front-line) unit. If no enemy Melee is alive, this just fizzles (logged, no damage).
  - If a neighbor cell itself holds a pre-existing special tile, that tile is queued to explode too (chain reaction) before the wave is considered fully resolved.
- **Match of 5+ tiles (a straight run of 5, or a T/L/plus shape formed by two intersecting runs of ≥3) → Runic Crystal** — grants 1 mana per tile immediately, and one cell becomes a **Runic Crystal** (`boardSpecial = 'crystal'`, spawn cell chosen the same way as the bomb). When the Runic Crystal is later matched or activated:
  - Its own tile always clears and pays its base 1 mana first, regardless of trigger path.
  - The player then chooses one of two effects via a modal (`showCrystalChoiceModal()`):
    - **Option A — Clear Color**: clears every remaining tile of that color anywhere on the board, granting mana for all of them (big mana gain). Any pre-existing special caught in this clear is queued to explode too (chain reaction).
    - **Option B — Runic Wave**: no mana; instead releases a simultaneous wave of damage down all `RANGED_SLOTS` (= 5) rows/lanes at once. See "Runic Wave Targeting" below for the per-lane math.

### Special Tile Activation & Chain Reactions
Arcane Bomb and Runic Crystal activate differently — this is deliberate, not an inconsistency:
- **Arcane Bomb**: "matched or activated" means caught in a fresh same-color connected match (`findMatchGroups()`), **or** the player swaps any adjacent tile touching its cell (`onTileClick()`) — this second case goes through even when the swap creates no new color-match, since that's what makes a deliberate "detonate this bomb" move possible. Either way it consumes the turn's one board action.
- **Runic Crystal**: only activates via a **direct tap** on its own tile (a single click, `onTileClick()` intercepts it before any swap logic runs) — its choice modal must never appear except from that deliberate tap. A crystal caught in a fresh match, or touched by a swap between two other tiles, just clears like an ordinary matched tile (its group-share mana still pays out) with no special effect and no modal — the crystal is "wasted" if the player lets it get swept up before tapping it. A crystal's own cell can never be one half of a normal two-tile swap; clicking it always taps it instead of selecting it for a swap. A tap consumes the turn's one board action, same as a swap, and is blocked (with a log message) if that action was already used this turn.

Both trigger paths converge on the same explosion machinery (`processExplosionQueue()` — a continuation-passing walk, needed because the Runic Crystal's player-choice modal has to pause mid-resolution, and because a bomb/crystal's own effect can catch another pre-existing special and grow the queue mid-walk).

### Runic Wave Targeting (`resolveRunicWaveHits()`)
A Runic Wave travels down all `RANGED_SLOTS` rows/lanes simultaneously and, in each lane, hits only the first living enemy unit it meets:
- **No guarding Melee in that lane** → the enemy Ranged unit there (if any) takes the full 3 damage.
- **A Melee fully aligned to that lane** (`coverage: {type:'aligned', lane}`) → the Melee takes the full 3 damage; the Ranged unit behind it is **completely protected** (0 damage, not even a token hit).
- **A Melee straddling that lane and the next** (`coverage: {type:'boundary', lanes:[a,b]}`) → the Melee still takes the full 3 damage, but only **once** (not once per lane it straddles). Of its two guarded Ranged lanes, one stays fully protected and the other is "half exposed" and takes `ceil(3/2) = 2` damage. The data model has no inherent left/right lean for a straddling Melee, so which of its two lanes is the exposed one is chosen at random **per activation** (see DECISIONS.md).

## Hero Actions
- **Basic Attack**: Low mana/stamina cost. Always available.
- **Abilities**: Unlocked through progression. Higher mana/stamina cost. More powerful effects or utility.
- Heroes can be leveled and developed to gain new abilities.

## Auto-Play Toggle
- Players can turn on auto-play for the upper battlefield.
- When enabled, heroes automatically choose actions based on simple AI rules.
- The Match-3 board always remains fully manual.

## Open Design Questions
- Exact Match-3 board size and number of gem colors?
- How are heroes assigned to melee vs ranged zones (fixed role, player choice, or both)?
- Can players rearrange order inside a zone during battle?
- What happens the moment the last melee unit on a side dies?
- Mana generation rules (which gem colors feed which heroes)?