import re
from pathlib import Path

from features import trigger
from features.base import Recital, on

BLOCK = re.compile(r"\n?<!-- journal rules -->.*?<!-- /journal rules -->\n?", re.DOTALL)


class RulesFeature(Recital):
    name = "rules"
    type = "rule"
    said = "in force, read them"
    title_ = "Rules"
    abstract_ = "The rules said again at every tenth of the context, and the injected ones kept in CLAUDE.md"
    help_ = "A rule binds every environment; inject puts it in CLAUDE.md and every change rewrites that block."
    trigger = {"every": 10, "unit": trigger.PERCENT}

    @on("rule")
    def inject(self, event, record) -> None:
        injected = [r for r in self.standing(record, "rule") if r.data.get("injected")]
        target = record.root.parent / "CLAUDE.md"
        had = target.read_text() if target.is_file() else ""
        stripped = BLOCK.sub("\n", had).strip("\n")
        if not injected:
            if had != stripped:
                target.write_text(stripped + "\n" if stripped else "")
            return
        lines = "\n".join(f"- {r.title}" for r in injected)
        block = f"<!-- journal rules -->\n# Rules\n\n{lines}\n<!-- /journal rules -->"
        target.write_text(f"{stripped}\n\n{block}\n" if stripped else f"{block}\n")
