from collections.abc import Sequence
from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.command import Command
from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.deferred_rule import DeferredRule
from engine.driver.hook_event import HookEvent
from engine.driver.state_boards import StateBoards
from engine.enums.hook_event_name import HookEventName
from engine.enums.state_tier import StateTier
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.guard.guard_switches import GuardSwitches
from engine.listener.commit.commit_listener import CommitListener
from engine.log.error_log import ErrorLog
from engine.registry.registry import Registry
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.drivers.support.contribution_slices import LINES_SLICE
from core.modules.drivers.support.actor_loader import ActorLoader

DEFERRED_RULE_COMMAND_RUNS = "deferred rules only run commands"


class DeferredRulesListener(CommitListener[Created[HookCall]]):
    """Runs the deferred rules of an agent's open deferred states once the hook's answer is stored, from
    the stored hook call: each command a rule answers is dispatched on its own. The agent never waits for
    it, the next hook reads what the commands wrote, and the listener cursor is the queue, so after a
    restart each stored call runs once. A rule that answers anything but commands is reported and passed
    by, nothing of it reaches the agent; a rule that raises is reported and the other rules still run."""

    name = "drivers.deferred-rules"
    run_order = 900

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, boards: StateBoards, loader: ActorLoader, agents: AgentRows, bus: Bus, errors: ErrorLog,
                 slices: AgentSlices) -> None:
        self.registry, self.container, self.switches, self.boards, self.loader, self.agents, self.bus, self.errors = registry, container, switches, boards, loader, agents, bus, errors
        self.slices = slices

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = event.row
        states = self.registry.tier_states(call.driver, int(StateTier.DEFERRED))
        if not states:
            return
        # an agent the lines slice answers runs no deferred rule: its effects run in the step's save (doc 1310 section 6.7)
        if self.slices.has_active_slice() and LINES_SLICE in self.slices.tick_slices(self.agents.find(call.session_agent_id)):
            return
        board = self.boards.for_hook(self.hook_of(call))
        for state in states:
            if self.switches.enabled(state.name) and board.is_open(state):
                self.run_rules(state.name, call, logged)

    def hook_of(self, call: HookCall) -> AgentHook:
        agent = self.agents.find(call.session_agent_id)
        tick = HookEvent.tick(agent.program, agent.session, call.firing, 0, str(agent.id), "")
        return AgentHook.of_actor(replace(tick, event=HookEventName(call.hook)), self.loader.loaded(agent), call.creation_timestamp())

    def run_rules(self, state_name: str, call: HookCall, logged: LoggedEvent) -> None:
        for entry in self.registry.deferred_rules(state_name, call.hook):
            if not self.switches.enabled(entry.name):
                continue
            try:
                commands = self.container.get(entry.path.checked_class(DeferredRule)).after(call)
                if not self.are_commands(commands):
                    self.errors.reported(["deferred rule", entry.name], ValueError(DEFERRED_RULE_COMMAND_RUNS), call.environment_id)
                    continue
                for command in commands:
                    self.bus.run(command, Actor.core(), cause_id=logged.id, environment_id=call.environment_id)
            except Exception as error:
                self.errors.reported(["deferred rule", entry.name], error, call.environment_id)

    @staticmethod
    def are_commands(answer: object) -> bool:
        return isinstance(answer, Sequence) and not isinstance(answer, str) and all(isinstance(command, Command) for command in answer)
