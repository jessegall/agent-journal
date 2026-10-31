from typing import ClassVar

from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.drivers.models.hook_call import HookCall


class SkillListener(CommitListener):
    """What the skill listeners share: the hook call that raised the event, and running a command as the skills
    module for that event."""

    module_name: ClassVar[str] = "journal.core.skills"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, registry: Registry) -> None:
        self.bus, self.actors, self.queries, self.registry = bus, actors, queries, registry

    def call(self, event: LoggedEvent) -> HookCall:
        return self.queries.query(HookCall).find(event.row_id)

    def run(self, event: LoggedEvent, command: Command[object]) -> None:
        self.bus.run(command, self.actors.actor(self.module_name), cause_id=event.id, environment_id=event.environment_id)
