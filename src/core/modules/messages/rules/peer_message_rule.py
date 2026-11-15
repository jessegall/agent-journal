from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_wildcard import HookWildcard
from core.modules.messages.effects.peer_message_effect import PEER_MESSAGE_KEY, PeerMessageEffect


class PeerMessageRule(DriverRule):
    """The old walk's answer for PeerMessageEffect, which owns it, until the walk is deleted."""

    name = PEER_MESSAGE_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, effect: PeerMessageEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
