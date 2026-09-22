# Code Commandments — 31 sins to fix

> 🔱 **The rule above all — `fix-at-the-source`.** Every sin below is a SYMPTOM. Before you change a line, trace the value to where it is BORN and fix it there; the symptom (and often others) then disappears on its own. Never silence it with a `?? default`, a cast, or a null-check.

**This file is your worklist. Work it straight down, deleting as you go — do NOT stop to re-check.** For each line, top to bottom, do exactly this:

1. **LOAD the skill named in the section header.** It teaches the fix; do NOT fix from memory. Even if you believe you already loaded it, treat it as NOT loaded (a context compaction may have silently dropped its instructions while leaving you the impression they're still there) and load it again before touching the section. Once per section is enough.
   _Don't recognise the rule, or about to argue with it? Run `vendor/bin/commandments info <sin>` first — it prints what the rule flags, WHY it is a sin, how it is fixed, and a worked example. The detector name from the line works as the argument. Guessing at a rule you have not read is how a finding gets silenced instead of fixed._
2. Open the `file:line` and fix the sin at its source.
3. **Delete that line from this file.** Nothing else — no tick, no mark, no strike-through. The deleted line IS the record that it's fixed.

**Do NOT re-run `judge`, re-scan, or re-verify between fixes.** That is slow and pointless: the shrinking file is your only source of truth, and each deleted line is its own confirmation. Do not pause to check your work — just fix, delete, and move to the next line until none remain.

Work **wave by wave.** ONLY when this list is EMPTY, run `commandments judge` again. If your fixes rippled into other files, it writes a fresh worklist — a new wave; work it exactly the same way (fix, delete, no re-checks between). Repeat, judging only between waves, until a run is clean and deletes this file.

## frontend/vue-components

> ▶ **LOAD the skill `commandments-frontend-vue-components` before fixing.** It teaches every fix below. Don't work from memory, and don't assume it's still loaded from earlier — a compaction can drop it silently — load it again if in any doubt.

> ✎ Auto-fixable — run `vendor/bin/commandments repent --repent=latest --sin=deep-data-reach` to repent these for you.

> ✎ Auto-fixable — run `vendor/bin/commandments repent --repent=latest --sin=deep-nested` to repent these for you.

- `./web/src/chat/DumpWindow.vue:571`  <div>  [DeepDataReachDetector]
- `./web/src/chat/DumpWindow.vue:571`  <div>  [DeepNestedDetector]
- `./web/src/chat/DumpWindow.vue:596`  <template>  [DeepNestedDetector]
- `./web/src/chat/DumpWindow.vue:623`  <template>  [DeepNestedDetector]
- `./web/src/chat/Turn.vue:176`  <button>  [DeepDataReachDetector]
- `./web/src/resource/CheckResult.vue:58`  <template>  [DeepDataReachDetector]
- `./web/src/resource/ResourceBody.vue:85`  <article>  [DeepDataReachDetector]
- `./web/src/resource/Revisions.vue:42`  <template>  [DeepDataReachDetector]
- `./web/src/resource/Revisions.vue:42`  <template>  [DeepDataReachDetector]

## frontend/vue-control-flow

> ▶ **LOAD the skill `commandments-frontend-vue-control-flow` before fixing.** It teaches every fix below. Don't work from memory, and don't assume it's still loaded from earlier — a compaction can drop it silently — load it again if in any doubt.

> ✎ Auto-fixable — run `vendor/bin/commandments repent --repent=latest --sin=control-flow-on-element` to repent these for you.

> ✎ Auto-fixable — run `vendor/bin/commandments repent --repent=latest --sin=switch-case` to repent these for you.

> 🛠 Scaffold the helper its fix uses — run `vendor/bin/commandments scaffold --sin=switch-case`.

- `./web/src/chat/DumpWindow.vue:373`  <button>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:418`  <span>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:482`  <button>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:517`  <span>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:601`  <div>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:642`  <div>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:654`  <div>  [ControlFlowOnElementDetector]
- `./web/src/chat/DumpWindow.vue:681`  <span>  [ControlFlowOnElementDetector]
- `./web/src/chat/Turn.vue:156`  <template>  [SwitchCaseDetector]
- `./web/src/pages/FeaturePanel.vue:163`  <span>  [ControlFlowOnElementDetector]
- `./web/src/pages/FeaturePanel.vue:167`  <span>  [ControlFlowOnElementDetector]
- `./web/src/pages/PluginSettings.vue:54`  <template>  [SwitchCaseDetector]
- `./web/src/resource/NewResource.vue:79`  <span>  [ControlFlowOnElementDetector]
- `./web/src/resource/NewResource.vue:94`  <div>  [ControlFlowOnElementDetector]
- `./web/src/resource/NewResource.vue:98`  <div>  [ControlFlowOnElementDetector]
- `./web/src/resource/NewResource.vue:104`  <label>  [ControlFlowOnElementDetector]
- `./web/src/resource/ResourceActions.vue:91`  <option>  [ControlFlowOnElementDetector]
- `./web/src/resource/ResourceBody.vue:98`  <button>  [ControlFlowOnElementDetector]
- `./web/src/resource/ResourceBody.vue:267`  <ResourceCard>  [ControlFlowOnElementDetector]
- `./web/src/resource/ResourceCard.vue:34`  <span>  [ControlFlowOnElementDetector]
- `./web/src/resource/SequenceRuns.vue:36`  <div>  [ControlFlowOnElementDetector]
- `./web/src/resource/SequenceRuns.vue:51`  <li>  [ControlFlowOnElementDetector]
