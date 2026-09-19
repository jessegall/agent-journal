import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
for i in range(26):
    report(record, "working", "PreToolUse", skills=[])
check("twenty-five tool uses with no journal skill in the window: told once, privately", [n for n in nudges(record) if "journal skill" in n], ["no journal skill is loaded in this window"])
for i in range(26):
    report(record, "working", "PreToolUse", skills=[])
check("the unloaded window is not nurtured again", len([n for n in nudges(record) if "journal skill" in n]), 1)

report(record, "compacting", "PreCompact", skills=[])
for i in range(25):
    report(record, "working", "PreToolUse", skills=[])
check("a compaction opens one fresh window", len([n for n in nudges(record) if "journal skill" in n]), 2)

for i in range(25):
    report(record, "working", "PreToolUse", skills=["journal"])
for i in range(25):
    report(record, "working", "PreToolUse", skills=[])
check("loading later does not re-arm the same window", len([n for n in nudges(record) if "journal skill" in n]), 2)

report(record, "idle", "SessionStart", skills=[])
for i in range(25):
    report(record, "working", "PreToolUse", skills=[])
check("a new session window permits one reminder", len([n for n in nudges(record) if "journal skill" in n]), 3)

loaded = fresh()
for i in range(30):
    report(loaded, "working", "PreToolUse", skills=["journal", "journal-todos"])
check("with the skill loaded nothing is said", nudges(loaded), [])
for i in range(30):
    report(loaded, "working", "PreToolUse", skills=[])
check("an existing fired window upgrades without a fresh nudge", nudges(loaded), [])

done()
