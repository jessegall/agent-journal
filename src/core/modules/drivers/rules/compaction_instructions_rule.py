from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.provider.providers import Providers
from core.modules.drivers.support.driver_nudges import COMPACTION_INSTRUCTIONS_LINE

# Claude Code cuts a PreCompact hook's plain output at 10,000 characters
INSTRUCTIONS_LIMIT = 10_000


class CompactionInstructionsRule(DriverRule):
    """A compaction is given the agent program's own instructions for its summary, for every compaction: one a person
    or the journal starts with a plain /compact, and an automatic one. A person's own /compact text needs nothing here,
    since the program joins it with these instructions (report 1456). The rule never refuses a compaction."""

    name = "drivers.compaction-instructions"
    hook = HookEventName.COMPACT
    drivers = ["*"]

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        instructions = self.providers.provider(hook.event.program).compaction_instructions[:INSTRUCTIONS_LIMIT]
        if not instructions:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(COMPACTION_INSTRUCTIONS_LINE.nudge(text=instructions))
