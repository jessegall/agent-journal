from enum import StrEnum


class InspectorWidth(StrEnum):
    """How wide the viewer draws an inspector: small for a row of text, medium for a row with parts, large for
    a document, wide for the most."""

    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    WIDE = "wide"
