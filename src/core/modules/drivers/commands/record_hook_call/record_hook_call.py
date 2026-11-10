from dataclasses import dataclass

from engine.command.command import Command
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_reply import HookReply
from core.base.driver.rule_answers import RuleAnswers


@dataclass(frozen=True)
class RecordHookCall(Command[HookReply]):
    """Keeps what the rules answered about one hook of an agent, and answers the hook."""

    event: HookEvent
    agent_id: int
    answers: RuleAnswers
