from uuid import uuid4

from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.hook_event_name import HookEventName
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt import RecordMissingPrompt
from core.modules.drivers.models.hook_call import HookCall


class RecordMissingPromptHandler(Handler[RecordMissingPrompt, HookCall]):
    """Saves a prompt hook call for a prompt that reached the agent without its hook."""

    command = RecordMissingPrompt

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordMissingPrompt, context: Context) -> HookCall:
        return self.repository.save(HookCall(session_agent_id=context.actor.id, creator_id=context.actor.id, hook=HookEventName.PROMPT, firing=f"transcript-{uuid4().hex}",
                                             summary=HookCall.summarize(command.text)), context)
