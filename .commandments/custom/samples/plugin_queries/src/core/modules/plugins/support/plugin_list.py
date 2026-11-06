def read_enabled_plugins(plugins):
    # @sin architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.enabled_plugins()


def read_running_plugins(plugins):
    # @righteous architecture_plugins_enabled_plugins_outside_runnable_plugins
    return plugins.running()
