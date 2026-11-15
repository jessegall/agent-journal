from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from engine.scope.actor_scope import ActorScope
from core.modules.processes.needs.reader_request_needs import READER_REQUEST_KEY
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks


class ReaderRequestRule(DriverRule):
    """The old walk's answer for ReaderRequestNeeds, ReaderRequestLines and ReaderRequestEffect, which own it, until
    the walk is deleted."""

    name = READER_REQUEST_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True
    disabled_scopes = [ActorScope]

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.blocks.answer(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*answer.nudges).running(*answer.commands, *(ReaderRequestBlocks.help_block(hook.agent_id, hold) for hold in answer.holds))
