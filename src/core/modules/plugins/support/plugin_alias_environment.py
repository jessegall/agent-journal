from typing import TypedDict


class PluginAliasEnvironment(TypedDict):
    """The variables PluginAliasVariables.variables gives a plugin's alias."""

    JOURNAL_ENV: str
    JOURNAL_SETTINGS: str
