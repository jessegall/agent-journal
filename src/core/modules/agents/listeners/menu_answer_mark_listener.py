from core.base.module.helper_type_check import AGENTS_MODULE
from engine.chat.mark_outcome import MarkOutcome
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.agents.models.menu_answer import MenuAnswer
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.listeners.mark_listener import MarkListener
from core.base.change.created import Created



class MenuAnswerMarkListener(MarkListener[Created[MenuAnswer]]):
    """A menu the launcher answered shows in the chat with what it pressed, so nothing is pressed unseen."""

    name = "agents.menu-answer-mark"
    module_name = AGENTS_MODULE

    def handle(self, event: Created[MenuAnswer], logged: LoggedEvent) -> None:
        menu_answer = event.row
        agent = self.event_rows.required(Agent, menu_answer.session_agent_id)
        text = f'A menu in the agent\'s terminal was answered: "{menu_answer.question}" The journal {menu_answer.answer}.'
        key = f"menu:{menu_answer.id}"
        self.bus.run(ShowMark(AgentMarkType.MENU, AgentMarkVariant.ANSWERED, key, text, agent_id=agent.id, outcome=MarkOutcome.PASSED, ended=True),
                     self.actors.actor(self.module_name), cause_id=logged.id, environment_id=agent.environment_id)
