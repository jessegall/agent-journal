from typing import TypedDict


class PluginServicesSubcommandRowRecord(TypedDict):
    """The JSON form of PluginServicesSubcommand.row."""

    id: str
    plugin: str
    service: str
    restart: str
    running: bool
    pid: int | None
