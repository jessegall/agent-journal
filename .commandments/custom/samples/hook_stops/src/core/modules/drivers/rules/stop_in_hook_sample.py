from core.base.driver.driver_rule import DriverRule
from core.base.leftover_process import LeftoverProcess


class StopInHookSample(DriverRule):
    def __init__(self, bus, launcher: "LauncherLink") -> None:
        self.bus, self.launcher = bus, launcher

    def answer(self, hook):
        # @sin architecture_drivers_slow_stop_in_a_hook
        self.bus.run(StopAgent(hook.agent_id))
        # @sin architecture_drivers_slow_stop_in_a_hook
        LeftoverProcess.stop(hook.pid, "claude")
        # @righteous architecture_drivers_slow_stop_in_a_hook
        self.bus.run(EndAgent(hook.agent_id))
        # @righteous architecture_drivers_slow_stop_in_a_hook
        return LeftoverProcess.command_line(hook.pid)


class NotARule:
    def answer(self, hook):
        # @righteous architecture_drivers_slow_stop_in_a_hook
        self.bus.run(StopAgent(hook.agent_id))
