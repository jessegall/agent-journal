from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.provider.transcript_author import USER_AUTHOR, TranscriptAuthor
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.schedules.models.scheduled_job import ScheduledJob

PROGRAM_COMMAND = "/"


class TypedPromptEffect(EventEffect):
    """Records a prompt the user typed into the main agent's terminal as a chat message; a program command, a line
    the journal typed and a scheduled job's prompt are not the user's."""

    key = "messages.typed-prompt"
    events = [HookEventName.PROMPT]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        text = (event.prompt or "").strip() if event is not None else ""
        if not text or text.startswith(PROGRAM_COMMAND) or TranscriptAuthor.author(USER_AUTHOR, text) != USER_AUTHOR or self.is_scheduled_job(agent_id, text):
            return []
        return [RecordTypedPrompt(text)]

    def is_scheduled_job(self, agent_id: int, text: str) -> bool:
        return self.queries.query(ScheduledJob).filter(session_agent_id=agent_id, prompt=text).matching(IsNull("ended_at")).exists()
