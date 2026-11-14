from core.modules.drivers.models.agent_line import AgentLine
from engine.command.context import Context
from engine.driver.nudge import Nudge
from engine.driver.nudger import Nudger
from engine.repository.repository import Repository


class AgentLineNudger(Nudger):
    """Sends a nudge by saving an agent line: the one place that writes the row an agent's next hook gives or
    the server types."""

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def send_nudge(self, agent_id: int, nudge: Nudge, source: str, context: Context, wakes_agent: bool = False) -> AgentLine:
        declaration = nudge.declaration
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=nudge.text, source=source,
                                              wakes_agent=wakes_agent or nudge.wakes_agent, repeats_without_hook=declaration is not None and declaration.repeats_without_hook,
                                              nudge_json=nudge.stored.json), context)

    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False) -> AgentLine:
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=text, source=source, wakes_agent=wakes_agent, repeats_without_hook=repeats_without_hook), context)
