# Code Commandments — 1 sins to fix

> 🔱 **The rule above all — `fix-at-the-source`.** Every sin below is a SYMPTOM. Before you change a line, trace the value to where it is BORN and fix it there; the symptom (and often others) then disappears on its own. Never silence it with a `?? default`, a cast, or a null-check.

**This file is your worklist. Work it straight down, deleting as you go — do NOT stop to re-check.** For each line, top to bottom, do exactly this:

1. **LOAD the skill named in the section header.** It teaches the fix; do NOT fix from memory. Even if you believe you already loaded it, treat it as NOT loaded (a context compaction may have silently dropped its instructions while leaving you the impression they're still there) and load it again before touching the section. Once per section is enough.
   _Don't recognise the rule, or about to argue with it? Run `vendor/bin/commandments info <sin>` first — it prints what the rule flags, WHY it is a sin, how it is fixed, and a worked example. The detector name from the line works as the argument. Guessing at a rule you have not read is how a finding gets silenced instead of fixed._
2. Open the `file:line` and fix the sin at its source.
3. **Delete that line from this file.** Nothing else — no tick, no mark, no strike-through. The deleted line IS the record that it's fixed.

**Do NOT re-run `judge`, re-scan, or re-verify between fixes.** That is slow and pointless: the shrinking file is your only source of truth, and each deleted line is its own confirmation. Do not pause to check your work — just fix, delete, and move to the next line until none remain.

Work **wave by wave.** ONLY when this list is EMPTY, run `commandments judge` again. If your fixes rippled into other files, it writes a fresh worklist — a new wave; work it exactly the same way (fix, delete, no re-checks between). Repeat, judging only between waves, until a run is clean and deletes this file.

## python/absence

> ▶ **LOAD the skill `commandments-python-absence` before fixing.** It teaches every fix below. Don't work from memory, and don't assume it's still loaded from earlier — a compaction can drop it silently — load it again if in any doubt.

- `./src/features/tickets/controller.py:12`  binary  [InventedDefaultDetector]
