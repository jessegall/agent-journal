import re
from dataclasses import dataclass
from pathlib import Path
from typing import ClassVar

from engine.events import ResourceEvent
from engine.stored import write_text
from features.parts import Context, Handler

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
        stripped = BLOCK.sub("\n", had).strip("\n")
        if not injected:
            if had != stripped:
                write_text(target, stripped + "\n" if stripped else "")
            return
        lines = "\n".join(f"- {r.title}" for r in injected)
        block = f"<!-- journal rules -->\n# Rules\n\n{lines}\n<!-- /journal rules -->"
        write_text(target, f"{stripped}\n\n{block}\n" if stripped else f"{block}\n")
