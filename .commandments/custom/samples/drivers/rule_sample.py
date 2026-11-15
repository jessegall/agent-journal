from engine.agent_state_machine.contracts.effect import Effect
from engine.agent_state_machine.contracts.policy import Policy
from engine.agent_state_machine.states.wake_cause import WakeCause
from engine.agent_state_machine.states.state_source import StateSource
from engine.command.bus import Bus
from core.modules.tasks.commands import StartTask
from core.modules.tasks.queries.task_query import TaskQuery


class SampleStartPolicy(Policy):
    key = "samples.start"

    def __init__(self, bus: Bus, tasks: TaskQuery) -> None:
        self.bus, self.tasks = bus, tasks

    def refusals(self, question, view):
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(StartTask(1))
        # @righteous architecture_drivers_rule_runs_a_command
        return self.tasks.started(view.agent.agent_id)


class SampleReaderNeedSource(StateSource):
    def needs(self, agents, question):
        # @sin architecture_drivers_rule_builds_its_reader
        tasks = TaskQuery(None, None)
        # @righteous architecture_drivers_rule_builds_its_reader
        return {agent.agent_id: tasks.started(agent.agent_id) for agent in agents}


class SampleCountdownEffect(Effect):
    def __init__(self, calls) -> None:
        self.calls = calls

    def commands(self, view, record):
        # @sin architecture_drivers_countdown_outside_block_until
        used = self.calls.tool_call_count(view.agent.agent_id, record)
        # @righteous architecture_drivers_countdown_outside_block_until
        return [StartTask(used)]


class SampleStartEffect(Effect):
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def commands(self, view, record):
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(StartTask(1))
        # @righteous architecture_drivers_rule_runs_a_command
        return [StartTask(1)]


class SampleWakeCause(WakeCause):
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def needs_wake(self, view):
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(StartTask(view.agent.agent_id))
        # @righteous architecture_drivers_rule_runs_a_command
        return True
