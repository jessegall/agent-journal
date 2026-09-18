import re
from pathlib import Path

from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.resources.base import SYSTEM

BLOCK = re.compile(r"\n?<!-- journal rules -->.*?<!-- /journal rules -->\n?", re.DOTALL)


class Rules(Feature):
    name = "rules"
    title_ = "Rules"
    abstract_ = "The rules said again at every tenth of the context, and the injected ones kept in CLAUDE.md"
    help_ = "A rule binds every environment; inject puts it in CLAUDE.md and every change rewrites that block."
    trigger = {"every": 10, "unit": trigger.PERCENT}

    def standing(self, record) -> list:
        return [r for r in CONTROLLERS["rule"](record, actor=SYSTEM).all() if not r.completed]

    @on("agent.updated")
    def repeat(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        rules = self.standing(record)
        if rules:
            self.nudge(record, agent, f"{len(rules)} rule{'s' if len(rules) > 1 else ''} in force, read them", "; ".join(f"{r.n}. {r.title}" for r in rules))

    @on("rule")
    def inject(self, event, record) -> None:
        injected = [r for r in self.standing(record) if r.data.get("injected")]
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
