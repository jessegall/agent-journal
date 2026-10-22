from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class DashboardRow(Model):
    """One line of a plugin's dashboard, written by the plugin under a key of its own: what it says, a badge and its tone, a note, and the heading it is shown under."""

    shared: ClassVar[bool] = False

    plugin: str = ""
    key: str = ""
    label: str = ""
    badge: str = ""
    tone: str = ""
    note: str = ""
    section: str = ""
