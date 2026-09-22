from pathlib import Path

from controllers.types import Rules
from engine.record import Record
from resources.base import SYSTEM
from engine.stored import write_text


def run(root: Path) -> list[str]:
    rules = Rules(Record(root, "main"), actor=SYSTEM)
    changed = []
    for rule in rules.all(deleted=True):
        legacy = any(field in rule.data for field in ("injected", "injected_codex"))
        targets = set(rule.data.get("targets") or [])
        for field, provider in (("injected", "claude"), ("injected_codex", "codex")):
            if rule.data.pop(field, False):
                targets.add(provider)
        if legacy:
            rule.data["targets"] = sorted(targets)
            write_text(rules.path(rule.n), rule.dump())
            changed.append(rule.ref)
    return changed
