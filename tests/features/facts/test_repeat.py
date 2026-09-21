import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Nudges, Facts, Reminders  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
pins = Facts(record, actor=AGENT)
pins.create("the hook payload carries the parent's session id", brief="measured on 2026-09-01")
pins.create("tests run bounded")
report(record, "working", "PostToolUse", context=10)
check("said at the first tenth", (nudges(record), Nudges(record).load(1).brief), (["2 pins standing, read them"], "1. the hook payload carries the parent's session id; 2. tests run bounded"))
report(record, "working", "PostToolUse", context=14)
check("not again inside the same tenth", len(nudges(record)), 1)

# SUPERSEDING strikes the old and links it; PROMOTING makes a rule and strikes the pin
newer = pins.create("the hook payload carries the parent session id; only agent_id tells it apart", supersedes=1)
check("superseded: the old is struck, saying by which, and the new links it", (pins.load(1).outcome, newer.refs), ("superseded by pin 3", ["fact:1"]))
rule = pins.promote(2)
check("promoted: a rule with the pin's words, the pin struck", (rule.type, rule.title, pins.load(2).outcome), ("rule", "tests run bounded", "promoted to rule 1"))
Reminders(record, actor=USER).create("run the suites first", until="the suites are green on CI")
check("a reminder keeps its until", Reminders(record).load(1).data["until"], "the suites are green on CI")

done()
