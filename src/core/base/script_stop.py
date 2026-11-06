from enum import StrEnum


class ScriptStop(StrEnum):
    """Why the journal stopped a running plugin script."""

    SWITCHED_OFF = "the plugin was switched off"
    SERVER = "the server stopped"
