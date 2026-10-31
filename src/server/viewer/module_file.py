from dataclasses import dataclass


@dataclass(frozen=True)
class ModuleFile:
    """A file of a module's web/dist the viewer serves: its bytes, its exact content type, and whether it is the
    entry of a window that loads in a sandboxed frame."""

    content: bytes
    content_type: str
    frame: bool
