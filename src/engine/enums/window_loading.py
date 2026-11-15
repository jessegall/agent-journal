from enum import StrEnum


class WindowLoading(StrEnum):
    """How the viewer loads a window: a Vue component in the page, an HTML file in a sandboxed stacked state, or a
    document the viewer draws itself."""

    COMPONENT = "component"
    STACKED_STATE = "frame"
    DOCUMENT = "document"
