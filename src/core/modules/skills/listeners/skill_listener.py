from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.change.event_subscriber import E


class SkillListener(CommitListener[E]):
    """What the skill listeners share: the hook call that raised the event, and running a command as the
    skills module for that event."""

    module_name: ClassVar[str] = "journal.core.skills"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, catalogue: SkillCatalogue, suites: SuiteChoice, agents: AgentRows) -> None:
        self.bus, self.actors, self.queries, self.catalogue = bus, actors, queries, catalogue
        self.suites = suites
        self.agents = agents

    def run(self, logged: LoggedEvent, command: Command[object]) -> None:
        self.bus.run(command, self.actors.actor(self.module_name), cause_id=logged.id)
