from dataclasses import replace

from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.driver_rules import DriverRules
from engine.driver.essential_allowances import EssentialAllowances
from engine.driver.hook_event import HookEvent
from engine.driver.layers import Layers
from engine.driver.open_row import OpenRow
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.rule_timings import RuleTimings
from engine.driver.state_boards import StateBoards
from engine.dotted_path.dotted_path import DottedPath
from engine.journal.journal_home import JournalHome
from engine.log.error_log import ErrorLog
from engine.log.exception_sink import ExceptionSink
from engine.log.system_log_writer import SystemLogWriter
from engine.registry.agent_state_entry import AgentStateEntry
from engine.time.clock import Clock
from tests.unit.engine.driver.test_walk import DRIVER, Allows, RegainedHistory, Refuses, Switches, at, rule
from tests.unit.engine.samples.sample_container import empty_registry
from tests.unit.engine.samples.scope_samples import empty_database_scopes

STATE = "test.state"


class ClosedState(AgentState):
    name = STATE

    def open_rows(self, hook):
        return ()


class OpenState(AgentState):
    name = STATE

    def open_rows(self, hook):
        return [OpenRow("samples", 1, at(1))]


class RaisingState(AgentState):
    name = STATE

    def open_rows(self, hook):
        raise RuntimeError("opener broke")


def walked(tmp_path, state: type[AgentState], rule_class=Refuses, off=(), hook_name="pre_tool_use"):
    gated = rule("samples.gated", rule_class, 1, DRIVER)
    gate = AgentStateEntry(STATE, DottedPath.class_path(state), "samples", 1, int(StateTier.STACK), ("*",), "", ("samples.gated",))
    registry = replace(empty_registry().with_rules(tuple([replace(gated, hook=hook_name)])), agent_states=tuple([gate]))
    errors, system_log = ErrorLog(SystemLogWriter(JournalHome(tmp_path), Clock()), ExceptionSink()), SystemLogWriter(JournalHome(tmp_path), Clock())
    walker = DriverRules(registry, Container(), Switches(off), Layers(registry, Container()), RegainedHistory(), errors, EssentialAllowances(), empty_database_scopes(),
                         RefusalSkips(), system_log, RuleTimings(), StateBoards(registry, Container(), errors, system_log))
    event = HookEvent(1, "claude", hook_name, "s1", "f1", 1, "agent", "main", None, None, {})
    return walker.ask(AgentHook(event, 3, 1, "main", DRIVER, at(30)))


def test_a_closed_state_records_its_rule_allowed_in_its_place_without_asking_it(tmp_path):
    record = walked(tmp_path, ClosedState).rules[0]
    assert (record.name, record.outcome, record.reason, record.milliseconds) == ("samples.gated", "allowed", "test.state is not open", 0)


def test_an_open_state_asks_its_rule(tmp_path):
    assert walked(tmp_path, OpenState).rules[0].outcome == "refused"


def test_a_state_switched_off_asks_its_rule_ungated(tmp_path):
    assert walked(tmp_path, ClosedState, off=(STATE,)).rules[0].outcome == "refused"


def test_a_rule_switched_off_stays_off_whatever_its_state(tmp_path):
    assert walked(tmp_path, OpenState, off=("samples.gated",)).rules == []


def test_an_opener_that_raises_leaves_the_rule_asked(tmp_path):
    assert walked(tmp_path, RaisingState).rules[0].outcome == "refused"


def test_a_main_agent_stop_lists_a_gated_rule_as_allowed_without_asking(tmp_path):
    checks = walked(tmp_path, ClosedState, rule_class=Allows, hook_name="stop").stop_checks
    assert [(check.rule, check.outcome, check.reason) for check in checks] == [("samples.gated", "allowed", "test.state is not open")]
