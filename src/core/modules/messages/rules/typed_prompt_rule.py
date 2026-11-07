from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.transcript_author import USER_AUTHOR, TranscriptAuthor
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.schedules.models.scheduled_job import ScheduledJob

PROGRAM_COMMAND = "/"


class TypedPromptRule(DriverRule):
    """Record a person's terminal prompt as a chat message."""

    name = "messages.typed-prompt"
    hook = HookEventName.PROMPT
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = (hook.event.prompt or "").strip()
        if not text or text.startswith(PROGRAM_COMMAND) or TranscriptAuthor.author(USER_AUTHOR, text) != USER_AUTHOR or self.is_scheduled_job(hook, text):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordTypedPrompt(text))

    def is_scheduled_job(self, hook: AgentHook, text: str) -> bool:
        return self.queries.query(ScheduledJob).filter(session_agent_id=hook.agent_id, prompt=text).matching(IsNull("ended_at")).exists()
