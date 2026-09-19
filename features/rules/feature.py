import re
from pathlib import Path

from features import trigger
from features.base import Recital, on
from providers import PROVIDERS

BLOCK = re.compile(r"\n?<!-- journal rules -->.*?<!-- /journal rules -->\n?", re.DOTALL)


class RulesFeature(Recital):
    name = "rules"
    type = "rule"
    said = "in force, read them"
    title_ = "Rules"
    abstract_ = "The rules said again at every tenth of the context, and the injected ones kept in CLAUDE.md or AGENTS.md"
    help_ = "A rule binds every environment; inject targets Claude, Codex or both, and every change rewrites those blocks."
    trigger = {"every": 10, "unit": trigger.PERCENT}

    @on("rule")
    def inject(self, event, record) -> None:
        rules = self.standing(record, "rule")
        for cls in PROVIDERS.values():
            if cls.briefing_file:
                self._write(record.root.parent / cls.briefing_file, [r for r in rules if cls.name in r.targets])

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
