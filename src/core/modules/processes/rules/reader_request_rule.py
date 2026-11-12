from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks


class ReaderRequestRule(DriverRule):
    """Asks an agent for its reader and the main agent for help after failed saves, through the reader request blocks."""

    name = "processes.reader-request"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True
    disabled_scopes = [ActorScope]

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.blocks.request_answer(hook)
