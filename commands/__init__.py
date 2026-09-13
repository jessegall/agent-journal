from __future__ import annotations

from command import Registry
from commands import docs, environments, ideas, pins, questions, reminders, system, todos, tools, transcript, work
from commands.options import SHARED

REGISTRY = Registry(shared=SHARED)
for module in (questions, ideas, reminders, pins, work, todos, docs, tools, environments, transcript, system):
    for spellings in module.NOUNS:
        REGISTRY.noun(*spellings)
    REGISTRY.add(*module.COMMANDS)
