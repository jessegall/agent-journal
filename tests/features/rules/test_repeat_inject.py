import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Nudges, Rules  # noqa: E402
from resources.base import USER  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

# REPEATED at every tenth of the context, by default
record = fresh()
rules = Rules(record, actor=USER)
rules.create("name the model on every dispatch")
rules.create("a title never explains with a colon")
for pct in (4, 9, 10, 15, 19.5, 20, 33):
    report(record, "working", "PostToolUse", context=pct)
check("said at 10, 20 and 33: the standing rules by number", nudges(record), ["2 rules in force, read them"] * 3)
check("the words carry the rules", Nudges(record).load(1).brief, "1. name the model on every dispatch; 2. a title never explains with a colon")
rules.complete(2, "retired")
report(record, "working", "PostToolUse", context=41)
check("a struck rule is not said", nudges(record)[-1], "1 rule in force, read them")

# INJECTED into CLAUDE.md as one block, rewritten on every change to a rule, and removed when none is injected
claude_md = record.root.parent / "CLAUDE.md"
claude_md.write_text("# My project\n\nkeep this.\n")
rules.inject(1)
check("inject writes the block under what was there", claude_md.read_text(), "# My project\n\nkeep this.\n\n<!-- journal rules -->\n# Rules\n\n- name the model on every dispatch\n<!-- /journal rules -->\n")
rules.update(1, title="name the model on every subagent dispatch")
check("a change to the rule rewrites the block", "- name the model on every subagent dispatch\n" in claude_md.read_text() and claude_md.read_text().count("journal rules") == 2, True)
rules.uninject(1)
check("uninjected: the file is as it was", claude_md.read_text(), "# My project\n\nkeep this.\n")
empty = fresh()
Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule").n)
check("no CLAUDE.md yet: the block alone", (empty.root.parent / "CLAUDE.md").read_text(), "<!-- journal rules -->\n# Rules\n\n- only rule\n<!-- /journal rules -->\n")

done()
