from core.base.command.context import Context
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine


class Nudger:
    """Gives an agent a line outside a hook's own answer: the one place that writes the row its next hook
    gives or the server types. A declared nudge is said by its declaration; only text that came from a person
    or a plugin is said as plain text."""

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def send(self, agent_id: int, declaration: NudgeDeclaration, source: str, context: Context, **values: object) -> AgentLine:
        return self.send_text(agent_id, declaration.nudge(**values).text, source, context, declaration.wakes_agent, declaration.repeats_without_hook)

    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False) -> AgentLine:
        return self.repository.save(AgentLine(agent_id=agent_id, creator_id=context.actor.id, text=text, source=source, wakes_agent=wakes_agent, repeats_without_hook=repeats_without_hook), context)
