from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.events.session_started import SessionStarted

MODULE_NAME = "journal.core.agents"


class InstructionImportsListener(CommitListener[SessionStarted]):
    """When a main agent's session starts, checks the project's CLAUDE.md and AGENTS.md files for an import that puts
    the same text into the context twice."""

    name = "agents.instruction-imports"

    def __init__(self, agents: AgentRows, bus: Bus, actors: ModuleActors) -> None:
        self.agents, self.bus, self.actors = agents, bus, actors

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if self.agents.find(call.session_agent_id).role == AgentRole.MAIN:
            self.bus.run(WarnInstructionImports(call.session_agent_id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
