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
check("and again after the next twenty-five", len([n for n in nudges(record) if "journal skill" in n]), 2)

loaded = fresh()
for i in range(30):
    report(loaded, "working", "PreToolUse", skills=["journal", "journal-todos"])
check("with the skill loaded nothing is said", nudges(loaded), [])

done()
