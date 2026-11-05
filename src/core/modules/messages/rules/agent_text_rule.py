from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.queries.message_query import MessageQuery

JOURNAL_LINE = "[journal] "
USER_ACTION_PREFIXES = ("[journal] new message", "[journal] question:", "[journal] the user")
MESSAGE_COUNT_TEXT = " new messages"
SHORT_CHARACTERS = 240


class AgentTextRule(DriverRule):
    """Each finished text block the agent writes in a turn becomes a chat message of the agent, unless it
    already replied by command in this turn, or the turn only answered a journal line with few words and
    no write; a line that says the user acted, by a message or a question, is answered as the user is."""

    name = "messages.agent-text"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, messages: MessageQuery) -> None:
        self.queries, self.messages = queries, messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raw = hook.event.raw
        text = raw.get("delta")
        if raw.get("final") is not True or not isinstance(text, str) or not text.strip():
            return RuleAnswer.allowed()
        prompts = self.queries.query(HookCall).filter(agent_id=hook.agent_id, hook=HookEventName.PROMPT.value).newest().limited(1)
        if prompts and (self.has_reply(hook.agent_id, prompts[0]) or self.is_acknowledgement(text.strip(), prompts[0])):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(SendMessage(text.strip()))

    def has_reply(self, agent_id: int, prompt: HookCall) -> bool:
        newest = self.messages.latest_agent_message(agent_id)
        return newest is not None and newest.parent_id is not None and newest.creation_timestamp().value >= prompt.creation_timestamp().value

    def is_acknowledgement(self, text: str, prompt: HookCall) -> bool:
        if len(text) > SHORT_CHARACTERS or "?" in text or not prompt.summary.startswith(JOURNAL_LINE) or self.is_user_act(prompt.summary):
            return False
        calls = self.queries.query(HookCall).filter(agent_id=prompt.agent_id, writes_files=True).newest().limited(1)
        return not calls or calls[0].id < prompt.id

    def is_user_act(self, prompt_text: str) -> bool:
        return prompt_text.startswith(USER_ACTION_PREFIXES) or MESSAGE_COUNT_TEXT in prompt_text
