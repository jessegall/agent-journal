from collections.abc import Sequence
from dataclasses import dataclass

from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace


@dataclass(frozen=True)
class WindowDeclaration:
    """A window a module adds to the viewer: its name and title, the file the viewer loads from the module's web
    folder and how, where it belongs, the read lines and commands it may run, and the events it follows."""

    name: str
    title: str
    entry: str
    loading: WindowLoading
    place: WindowPlace = WindowPlace.ENVIRONMENT
    reads: Sequence[str] = ()
    runs: Sequence[str] = ()
    events: Sequence[str] = ()
