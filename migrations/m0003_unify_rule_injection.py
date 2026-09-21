from controllers.types import Rules
from engine.record import Record
from resources.base import SYSTEM
from engine.stored import write_text


def run(root):
    rules = Rules(Record(root, "main"), actor=SYSTEM)
    changed = []
    for rule in rules.all(deleted=True):
        old_targets = rule.data.pop("targets", None)
        old_codex = rule.data.pop("injected_codex", None)
        old_injected = rule.data.pop("injected", None)
        if old_targets is None and old_codex is None and old_injected is None:
            continue
        rule.data["injected"] = bool(old_targets or old_codex or old_injected)
        write_text(rules.path(rule.n), rule.dump())
        changed.append(rule.ref)
    return changed
