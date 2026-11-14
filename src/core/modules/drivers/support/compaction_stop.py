from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer


class CompactionStop:
    """How a stop goes while an agent's compaction is due: a final allowance, so no other stop rule is asked,
    that may type the compaction. With no module that compacts agents, no compaction is ever due. The module
    that keeps the context limit binds its own."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed("no compaction is due")
