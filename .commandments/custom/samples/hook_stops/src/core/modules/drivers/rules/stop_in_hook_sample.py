from engine.agent_state_machine.contracts.effect import Effect
from engine.process.leftover_process import LeftoverProcess


class AgentStopEffect(Effect):
    def __init__(self, bus, launcher: "LauncherLink") -> None:
        self.bus, self.launcher = bus, launcher

    def commands(self, hook, record):
        # @sin architecture_drivers_slow_stop_in_a_hook
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(StopAgent(hook.agent_id))
        # @sin architecture_drivers_slow_stop_in_a_hook
        LeftoverProcess.stop(hook.pid, "claude")
        # @righteous architecture_drivers_slow_stop_in_a_hook
        # @sin architecture_drivers_rule_runs_a_command
        self.bus.run(EndAgent(hook.agent_id))
        # @righteous architecture_drivers_slow_stop_in_a_hook
        return LeftoverProcess.command_line(hook.pid)
