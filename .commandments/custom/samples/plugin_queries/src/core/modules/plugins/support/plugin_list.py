# @sin architecture_core_second_class_in_a_file
class PluginProgram:
    def run(self, call, answer):
        return answer


def read_enabled_plugins(plugins):
    # @sin architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.enabled_plugins()


def read_running_plugins(plugins):
    # @righteous architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.running()


# @sin architecture_core_second_class_in_a_file
class ProgramCaller:
    def __init__(self, program: PluginProgram) -> None:
        self.program = program

    def run_program(self, call):
        # @sin architecture_plugins_enabled_plugins_outside_runnable_plugins
        return self.program.run(call, None)


def run_plan(plan, call):
    # @righteous architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plan.run(call, None)
