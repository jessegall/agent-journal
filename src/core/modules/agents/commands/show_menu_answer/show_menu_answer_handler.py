from dataclasses import replace

from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.commands.show_menu_answer.show_menu_answer import ShowMenuAnswer
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark

MODULE_NAME = "journal.core.agents"


class ShowMenuAnswerHandler(Handler[ShowMenuAnswer, ChatMark]):
    """Says in the chat which menu the launcher answered and how, so nothing is pressed unseen."""

    command = ShowMenuAnswer

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.bus, self.actors = queries, bus, actors

    def handle(self, command: ShowMenuAnswer, context: Context) -> ChatMark:
        agent = self.queries.query(Agent).find(command.agent_id)
        text = f'A menu in the agent\'s terminal was answered: "{command.question}" The journal {command.said}.'
        return self.bus.dispatch(ShowMark(agent.environment_id, AgentMarkType.MENU, AgentMarkVariant.ANSWERED, f"menu:{agent.id}:{context.timestamp.text}", text, agent_id=agent.id, outcome=MarkOutcome.PASSED, ended=True), replace(context, actor=self.actors.actor(MODULE_NAME)))
