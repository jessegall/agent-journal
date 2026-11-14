from argparse import Namespace
from types import SimpleNamespace

from engine.driver.rule_answers import RuleAnswers
from engine.driver.state_record import StateRecord
from engine.enums.hook_event_name import HookEventName
from engine.module.driver_entries import DRIVERS_MODULE
from engine.row.metadata import Metadata
from core.modules.drivers.commands.hook_call_show.hook_call_show_subcommand import HookCallShowSubcommand
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall

STATES = (StateRecord("skills.load-required", "stack", "open", 3), StateRecord("plans.focus-due", "in_place", "closed", 0))


def shown(call: HookCall):
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(find=lambda row_id: call))
    return HookCallShowSubcommand(queries).read(Namespace(id=call.id), None)


def test_a_hook_saves_each_state_with_its_tier_and_opener_time_and_hook_call_show_prints_them_after_the_rules():
    metadata = RuleAnswers((), (), states=STATES).metadata()
    call = HookCall(id=7, session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.PRE_TOOL_USE, firing="f", answer=HookAnswer.ALLOWED,
                    metadata=Metadata({DRIVERS_MODULE: metadata}))
    assert metadata["states"] == [{"name": "skills.load-required", "tier": "stack", "outcome": "open", "milliseconds": 3},
                                  {"name": "plans.focus-due", "tier": "in_place", "outcome": "closed", "milliseconds": 0}]
    assert shown(call).states == "skills.load-required (stack): open, 3 ms, plans.focus-due (in_place): closed, 0 ms"


def test_a_hook_recorded_before_states_shows_no_states():
    call = HookCall(id=8, session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.STOP, firing="f", answer=HookAnswer.ALLOWED)
    assert shown(call).states == ""
