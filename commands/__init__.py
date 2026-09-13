from __future__ import annotations

from command import Registry
from commands import ideas, questions, reminders
from commands.options import SHARED

REGISTRY = Registry(shared=SHARED)
for module in (questions, ideas, reminders):
    REGISTRY.noun(*module.NOUN)
    REGISTRY.add(*module.COMMANDS)
