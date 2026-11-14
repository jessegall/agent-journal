from engine.process.plugin_script_processes import PLUGIN_TOKEN_VARIABLE


def token_variables(environment):
    # @sin architecture_plugins_plugin_token_variable_named_twice
    literal_token = environment["JOURNAL_PLUGIN_TOKEN"]
    # @righteous architecture_plugins_plugin_token_variable_named_twice
    constant_token = environment[PLUGIN_TOKEN_VARIABLE]
    return literal_token, constant_token
