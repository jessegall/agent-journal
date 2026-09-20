import re
from pathlib import Path

from controllers.types import Rules
from features import trigger
from features.base import Recital, event

BLOCK = re.compile(r"\n?<!-- journal rules -->.*?<!-- /journal rules -->\n?", re.DOTALL)
INSTRUCTION_FILES = ("AGENTS.md", "CLAUDE.md")


class RulesFeature(Recital):
    name = "rules"
    controller = Rules
    said = "in force, read them"
    title_ = "Rules"
    abstract_ = "The rules said again at every tenth of the context, and the injected ones kept in AGENTS.md and CLAUDE.md"
    help_ = "A rule binds every environment; one control injects the same managed block into both instruction files."
    trigger = {"every": 10, "unit": trigger.PERCENT}

    @event("rule")
    def inject(self, event, record) -> None:
        injected = [r for r in self.standing(record, Rules) if r.injected]
        for name in INSTRUCTION_FILES:
            self._write(record.root.parent / name, injected)

    def _write(self, target: Path, injected: list) -> None:
        had = target.read_text() if target.is_file() else ""
        stripped = BLOCK.sub("\n", had).strip("\n")
        if not injected:
            if had != stripped:
                target.write_text(stripped + "\n" if stripped else "")
            return
        lines = "\n".join(f"- {r.title}" for r in injected)
        block = f"<!-- journal rules -->\n# Rules\n\n{lines}\n<!-- /journal rules -->"
        target.write_text(f"{stripped}\n\n{block}\n" if stripped else f"{block}\n")
