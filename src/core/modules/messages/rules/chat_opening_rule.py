from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.nudges.journal_chat_rule_nudge import JournalChatRuleNudge
from core.modules.messages.nudges.journal_laws_nudge import JournalLawsNudge
from core.modules.messages.nudges.journal_line_note_nudge import JournalLineNoteNudge


class ChatOpeningRule(DriverRule):
    """A main agent's session start tells it what a journal line is, to keep the journal out of the chat, and
    that the laws apply."""

    name = "messages.chat-opening"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(JournalLineNoteNudge.declared().nudge(), JournalChatRuleNudge.declared().nudge(), JournalLawsNudge.declared().nudge())
