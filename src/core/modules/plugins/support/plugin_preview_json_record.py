from typing import TypedDict


class PluginPreviewJsonRecord(TypedDict):
    """The JSON form of PluginPreview.json."""

    name: str
    title: str
    version: str
    source: str
    rows: list[dict[str, str]]
