from collections.abc import Sequence
from dataclasses import dataclass

from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace


@dataclass(frozen=True)
class WindowDeclaration:
    """A window a module adds to the viewer: its name and title, the file the viewer loads from the module's web
    folder and how, where it belongs and for which agent roles, the window kit versions it was built for, the read
    lines and commands it may run, and the events it follows."""

    name: str
    title: str
    entry: str
    loading: WindowLoading
    place: WindowPlace = WindowPlace.ENVIRONMENT
    roles: Sequence[str] = ()
    kit: str = ">=1,<2"
    reads: Sequence[str] = ()
    runs: Sequence[str] = ()
    events: Sequence[str] = ()
