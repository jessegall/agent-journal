from uuid import uuid4

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.hook_event_name import HookEventName
from core.base.repository.repository import Repository
from core.modules.drivers.commands.record_lost_prompt.record_lost_prompt import RecordLostPrompt
from core.modules.drivers.models.hook_call import HookCall


class RecordLostPromptHandler(Handler[RecordLostPrompt, HookCall]):
    """Saves a prompt hook call for a prompt that reached the agent without its hook."""

    command = RecordLostPrompt

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordLostPrompt, context: Context) -> HookCall:
        return self.repository.save(HookCall(session_agent_id=context.actor.id, creator_id=context.actor.id, hook=HookEventName.PROMPT, firing=f"transcript-{uuid4().hex}",
                                             summary=HookCall.summary_of(command.text)), context)
