from types import SimpleNamespace

from engine.agent_machine.stepping.constraints import Constraints
from engine.agent_stack.reason import Reason
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_type import GrantType
from engine.enums.hook_event_name import HookEventName

REFUSAL = Reason("aliases.saved-command", DecisionClass.REFUSE, "aliases.saved-command", "a sample refusal")
TOOL_USE = SimpleNamespace(event=SimpleNamespace(event=HookEventName.PRE_TOOL_USE))


def hinted(is_safety: bool, refused_last: frozenset[str], question=TOOL_USE, grant_types=tuple([GrantType.REFUSAL_SKIP])) -> str:
    policy = SimpleNamespace(is_safety=is_safety, key="aliases.saved-command", grant_types=grant_types)
    return Constraints.skip_hinted(REFUSAL, policy, question, SimpleNamespace(last_refused_rules=refused_last)).text


def test_a_policy_that_refused_the_last_refused_hook_too_offers_its_skip_at_a_tool_use():
    assert "journal refusal skip aliases.saved-command" in hinted(False, frozenset({"aliases.saved-command"}))
    assert hinted(False, frozenset({"tasks.open"})) == "a sample refusal"
    assert hinted(True, frozenset({"aliases.saved-command"})) == "a sample refusal"
    assert hinted(False, frozenset({"aliases.saved-command"}), SimpleNamespace(event=SimpleNamespace(event=HookEventName.STOP))) == "a sample refusal"


def test_a_policy_no_refusal_skip_passes_offers_none():
    assert hinted(False, frozenset({"aliases.saved-command"}), grant_types=()) == "a sample refusal"
