from enum import StrEnum


class WindowLoading(StrEnum):
    """How the viewer loads a window: a Vue component in the page, an HTML file in a sandboxed frame, or a document
    the viewer draws itself."""

    PAGE = "page"
    FRAME = "frame"
    DOCUMENT = "document"
