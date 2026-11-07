from collections.abc import Sequence


class LinkEndpointColumns:
    """Projects endpoint titles without loading document bodies or complete message text."""

    EMPTIED = ("body", "brief", "outcome", "captions", "reactions", "flowchart_edges")
    SHORTENED = ("text", "line")

    @classmethod
    def columns(cls, columns: Sequence[str]) -> str:
        return ", ".join(cls.projected(column) for column in columns)

    @classmethod
    def projected(cls, column: str) -> str:
        if column in cls.EMPTIED:
            return f"'' AS {column}"
        if column in cls.SHORTENED:
            return f"substr({column}, 1, 160) AS {column}"
        return column
