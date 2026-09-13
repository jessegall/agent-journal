from __future__ import annotations

from command import Registry
from commands import ideas, pins, questions, reminders, todos, work
from commands.options import SHARED

REGISTRY = Registry(shared=SHARED)
for module in (questions, ideas, reminders, pins, work, todos):
    for spellings in module.NOUNS:
        REGISTRY.noun(*spellings)
    REGISTRY.add(*module.COMMANDS)
