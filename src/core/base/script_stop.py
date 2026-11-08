from enum import StrEnum


class ScriptStop(StrEnum):
    """Why the journal stopped a running plugin script, or that it did not."""

    STOP_FAILED = "the journal did not stop it"
    PLUGIN_DISABLED = "the plugin was switched off"
    SERVER = "the server stopped"
