from argparse import Namespace
from types import SimpleNamespace

from engine.agent_machine.record.stop_check import StopCheck
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.decision_class import DecisionClass
from engine.enums.hook_event_name import HookEventName
from engine.module.driver_entries import DRIVERS_MODULE
from engine.row.metadata import Metadata
from core.modules.drivers.commands.hook_call_show.hook_call_show_subcommand import HookCallShowSubcommand
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall

REFUSAL = RuleAnswer(refusal="a sample refusal")


def shown(call: HookCall):
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(find=lambda row_id: call))
    return HookCallShowSubcommand(queries).read(Namespace(id=call.id), None)


def test_a_stop_saves_each_check_and_hook_call_show_prints_each_source_with_its_outcome():
    checks = (StopCheck("tasks.carry-on-at-stop", DecisionClass.BLOCK, "a sample refusal", True),)
    metadata = RuleAnswers([RuleRecord("tasks.carry-on-at-stop", REFUSAL.outcome, REFUSAL)], stop_checks=checks).metadata()
    call = HookCall(id=7, session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.STOP, event_id="f", answer=HookAnswer.REFUSED,
                    metadata=Metadata({DRIVERS_MODULE: metadata}))
    assert metadata["stop_checks"] == [{"rule": "tasks.carry-on-at-stop", "outcome": "refused", "reason": "a sample refusal", "applied": True}]
    assert shown(call).rules == "tasks.carry-on-at-stop: refused"


def test_a_hook_with_no_source_shows_no_rules():
    call = HookCall(id=8, session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.STOP, event_id="f", answer=HookAnswer.ALLOWED)
    assert shown(call).rules == ""
