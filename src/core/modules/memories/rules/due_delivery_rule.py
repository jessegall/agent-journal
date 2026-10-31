from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.modules.memories.commands.give_memories import GiveMemories
from core.modules.memories.rules.support.memory_lines import MemoryLines
from core.modules.memories.commands.remove_memory import RemoveMemory
from core.base.agent_role import AgentRole

DUE_REASON = "given at its due time"


class DueDeliveryRule(DriverRule):
    """On any hook, the server's tick included, the agent is given each memory of its scope whose due time has
    come, once, and the memory is then removed."""

    name = "memories.due-delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, memories: HookMemories) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        memories = list(self.memories.query(hook).due(hook.timestamp).delivery_order().all_rows())
        if not memories:
            return RuleAnswer.allowed()
        removals = (RemoveMemory(row.memory_id, DUE_REASON) for row in memories)
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(GiveMemories(hook.agent_id, tuple(row.memory_id for row in memories), DeliveryCause.DUE), *removals)
