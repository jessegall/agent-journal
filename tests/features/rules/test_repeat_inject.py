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

claude_md = record.root.parent / "CLAUDE.md"
agents_md = record.root.parent / "AGENTS.md"
claude_md.write_text("# My project\n\nkeep this.\n")
agents_md.write_text("# Agents\n\nkeep this too.\n")
rules.inject(1)
check("inject marks the rule and writes the block under both files", (rules.load(1).injected, claude_md.read_text(), agents_md.read_text()),
      (True, "# My project\n\nkeep this.\n\n<!-- journal rules -->\n# Rules\n\n- name the model on every dispatch\n<!-- /journal rules -->\n",
       "# Agents\n\nkeep this too.\n\n<!-- journal rules -->\n# Rules\n\n- name the model on every dispatch\n<!-- /journal rules -->\n"))
rules.update(1, title="name the model on every subagent dispatch")
check("a change rewrites both instruction blocks", all("- name the model on every subagent dispatch\n" in path.read_text() and path.read_text().count("journal rules") == 2 for path in (claude_md, agents_md)), True)
rules.uninject(1)
check("uninject restores both instruction files", (rules.load(1).injected, claude_md.read_text(), agents_md.read_text()),
      (False, "# My project\n\nkeep this.\n", "# Agents\n\nkeep this too.\n"))
notice = rules.pin(1)
check("pin puts the rule over chat and links it", (notice.title, notice.refs, notice.data["link"], notice.data["label"]), ("name the model on every subagent dispatch", ["rule:1"], "#/t/rule/1", "Open rule"))
check("pin keeps one standing notice per rule", rules.pin(1).n, notice.n)
empty = fresh()
Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule").n)
check("no instruction files yet: both get the block", [(empty.root.parent / name).read_text() for name in ("AGENTS.md", "CLAUDE.md")],
      ["<!-- journal rules -->\n# Rules\n\n- only rule\n<!-- /journal rules -->\n"] * 2)

done()
