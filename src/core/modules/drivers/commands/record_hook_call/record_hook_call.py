from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.hook_reply import HookReply
from engine.driver.rule_answers import RuleAnswers
from core.modules.drivers.support.assembled_step import AssembledStep


@dataclass(frozen=True)
class RecordHookCall(Command[HookReply]):
    """Keeps what the rules answered about one hook of an agent, and answers the hook."""

    event: HookEvent
    agent_id: int
    answers: RuleAnswers
    # the new driver's step, saved in this write, while some of its slices answer the agent
    step: AssembledStep | None = None
