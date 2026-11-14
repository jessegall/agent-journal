from dataclasses import dataclass
from types import SimpleNamespace

from engine.command.command import Command
from engine.driver.deferred_rule import DeferredRule
from engine.enums.hook_event_name import HookEventName
from engine.time.timestamp import Timestamp
from core.modules.drivers.listeners.deferred_rules_listener import DEFERRED_RULE_COMMAND_RUNS, DeferredRulesListener

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")


@dataclass(frozen=True)
class Ping(Command[None]):
    number: int


class CommandRule(DeferredRule):
    name = "samples.commands"
    hook = HookEventName.STOP

    def after(self, call):
        return [Ping(1), Ping(2)]


class LineRule(DeferredRule):
    name = "samples.line"
    hook = HookEventName.STOP

    def after(self, call):
        return "a line for the agent"


class RaisingRule(DeferredRule):
    name = "samples.raising"
    hook = HookEventName.STOP

    def after(self, call):
        raise RuntimeError("broke")


class Listening:
    """A listener with fakes for everything around it: the rules that run, the commands run and the errors reported."""

    def __init__(self, rules, off=(), open_state=True) -> None:
        self.ran, self.errors = [], []
        entries = [SimpleNamespace(name=rule.name, path=SimpleNamespace(checked_class=lambda base, rule=rule: rule)) for rule in rules]
        state = SimpleNamespace(name="samples.deferred-state")
        registry = SimpleNamespace(tier_states=lambda driver, tier: [state], deferred_rules=lambda name, hook: entries)
        container = SimpleNamespace(get=lambda rule: rule())
        switches = SimpleNamespace(enabled=lambda name: name not in off)
        boards = SimpleNamespace(for_hook=lambda hook: SimpleNamespace(is_open=lambda entry: open_state))
        actor = SimpleNamespace(agent_id=7, environment_id=1, role="main", driver="coding.main", suite="coding", access="writing", anchor="", defaults=())
        agents = SimpleNamespace(find=lambda agent_id: SimpleNamespace(id=7, program="claude", session="s-1"))
        bus = SimpleNamespace(run=lambda command, actor, **fields: self.ran.append(command))
        errors = SimpleNamespace(reported=lambda argv, error, environment_id=None: self.errors.append((argv, str(error))))
        self.listener = DeferredRulesListener(registry, container, switches, boards, SimpleNamespace(loaded=lambda agent: actor), agents, bus, errors)

    def hear(self) -> None:
        call = SimpleNamespace(session_agent_id=7, driver="coding.main", hook="stop", firing="f1", environment_id=1, creation_timestamp=lambda: CREATED)
        self.listener.handle(SimpleNamespace(row=call), SimpleNamespace(id=9))


def test_the_commands_a_deferred_rule_answers_are_each_run():
    subscribed = Listening([CommandRule])
    subscribed.hear()
    assert subscribed.ran == [Ping(1), Ping(2)] and subscribed.errors == []


def test_a_rule_that_answers_a_line_is_reported_and_runs_nothing_and_the_next_rule_still_runs():
    subscribed = Listening([LineRule, CommandRule])
    subscribed.hear()
    assert subscribed.ran == [Ping(1), Ping(2)]
    assert subscribed.errors == [(["deferred rule", "samples.line"], DEFERRED_RULE_COMMAND_RUNS)]


def test_a_rule_that_raises_is_reported_and_passed_by_and_the_other_rules_still_run():
    subscribed = Listening([RaisingRule, CommandRule])
    subscribed.hear()
    assert subscribed.ran == [Ping(1), Ping(2)] and subscribed.errors == [(["deferred rule", "samples.raising"], "broke")]


def test_a_rule_switched_off_and_a_closed_state_run_nothing():
    toggled = Listening([CommandRule], off=("samples.commands",))
    toggled.hear()
    closed = Listening([CommandRule], open_state=False)
    closed.hear()
    assert (toggled.ran, closed.ran) == ([], [])


def test_the_listener_runs_after_the_other_listeners_and_hears_a_created_hook_call_once_per_event():
    assert DeferredRulesListener.run_order == 900 and DeferredRulesListener.name == "drivers.deferred-rules"
