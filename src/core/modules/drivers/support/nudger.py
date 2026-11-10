from engine.command.context import Context
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge import Nudge
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine


class Nudger:
    """Gives an agent a line outside a hook's own answer: the one place that writes the row its next hook
    gives or the server types. Declared nudges keep their templates; other text is read by its row number."""

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def send(self, agent_id: int, declaration: NudgeDeclaration, source: str, context: Context, **values: object) -> AgentLine:
        return self.send_nudge(agent_id, declaration.nudge(**values), source, context)

    def send_nudge(self, agent_id: int, nudge: Nudge, source: str, context: Context, wakes_agent: bool = False) -> AgentLine:
        declaration = nudge.declaration
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=nudge.text, source=source,
                                              wakes_agent=wakes_agent or nudge.wakes_agent, repeats_without_hook=declaration is not None and declaration.repeats_without_hook,
                                              nudge_json=nudge.stored.json), context)

    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False) -> AgentLine:
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=text, source=source, wakes_agent=wakes_agent, repeats_without_hook=repeats_without_hook), context)
