import re
from dataclasses import dataclass
from pathlib import Path
from typing import ClassVar

from engine.events.resources import ResourceCreated, ResourceEvent
from engine.stored import placed, write_text
from features.parts import Context, Handler
from resources.base import AGENT

BLOCK = re.compile(r"\n?<!-- journal rules -->.*?<!-- /journal rules -->\n?", re.DOTALL)
INSTRUCTION_FILES = ("AGENTS.md", "CLAUDE.md")


@dataclass(frozen=True)
class RuleChanged(ResourceEvent):
    on: ClassVar[str] = "rule"


class InjectRules(Handler):
    def handle(self, context: Context, event: RuleChanged) -> None:
        injected = [r for r in context.journal.rules._standing() if r.injected]
        for name in INSTRUCTION_FILES:
            self.write(context.record.root.parent / name, injected)

    def write(self, target: Path, injected: list) -> None:
        had = target.read_text() if target.is_file() else ""
        lines = "\n".join(f"- {r.title}" for r in injected)
        want = placed(had, BLOCK, f"<!-- journal rules -->\n# Rules\n\n{lines}\n<!-- /journal rules -->" if injected else "")
        if want != had:
            write_text(target, want)


class ReviewNewRule(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.actor != AGENT or event.type != "rule":
            return
        agent = context.journal.agents.primary()
        if agent:
            context.speaking_to(agent).agent.whisper("review", n=event.n, title=context.journal.rules.load(event.n).title)
