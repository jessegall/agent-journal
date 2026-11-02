from core.base.chat.mark_outcome import MarkOutcome
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.agents.models.menu_answer import MenuAnswer
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.listeners.mark_listener import MarkListener

AGENTS_MODULE = "journal.core.agents"


class MenuAnswerMarkListener(MarkListener):
    """A menu the launcher answered shows in the chat with what it pressed, so nothing is pressed unseen."""

    name = "agents.menu-answer-mark"
    event = "menu_answer.create"
    module_name = AGENTS_MODULE

    def handle(self, event: LoggedEvent) -> None:
        menu_answer = self.queries.query(MenuAnswer).find(event.row_id)
        agent = self.queries.query(Agent).find(menu_answer.agent_id)
        text = f'A menu in the agent\'s terminal was answered: "{menu_answer.question}" The journal {menu_answer.answer}.'
        self.bus.run(ShowMark(agent.environment_id, AgentMarkType.MENU, AgentMarkVariant.ANSWERED, f"menu:{menu_answer.id}", text, agent_id=agent.id, outcome=MarkOutcome.PASSED, ended=True),
                     self.actors.actor(self.module_name), cause_id=event.id, environment_id=agent.environment_id)
