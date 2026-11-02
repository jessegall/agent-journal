from typing import TypedDict


class PluginServicesSubcommandRowRecord(TypedDict):
    """The JSON form of PluginServicesSubcommand.row."""

    id: object
    plugin: object
    service: object
    restart: object
    running: object
    pid: object
