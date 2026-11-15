from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.effects.orphan_worktree_effect import OrphanWorktreeEffect


class OrphanWorktreeRule(DriverRule):
    """The old walk's answer for OrphanWorktreeEffect, which owns it, until the walk is deleted."""

    name = OrphanWorktreeEffect.key
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, effect: OrphanWorktreeEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
