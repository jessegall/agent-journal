from core.modules.plugins.support.plugin_program import PluginProgram


def read_enabled_plugins(plugins):
    # @sin architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.enabled_plugins()


def read_running_plugins(plugins):
    # @righteous architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.running()


def run_a_program(program: PluginProgram, call):
    # @sin architecture_plugins_enabled_plugins_outside_runnable_plugins
    return program.run(call, None)


def run_a_plan(plan, call):
    # @righteous architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plan.run(call, None)
