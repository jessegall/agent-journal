from __future__ import annotations

from command import Registry
from commands import auto, comments, docs, notifications, reports, suggestions, environments, ideas, inbox, pins, questions, reminders, status, system, todos, tools, transcript, work
from commands.options import SHARED

REGISTRY = Registry(shared=SHARED)
for module in (auto, comments, reports, notifications, suggestions, questions, inbox, ideas, reminders, pins, work, todos, docs, tools, environments, transcript, system, status):
    for spellings in module.NOUNS:
        REGISTRY.noun(*spellings)
    REGISTRY.add(*module.COMMANDS)
