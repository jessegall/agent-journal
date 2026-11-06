from collections.abc import Sequence


class LinkEndpointColumns:
    """Projects endpoint titles without loading document bodies or complete message text."""

    @staticmethod
    def columns(columns: Sequence[str]) -> str:
        empty = ("body", "brief", "outcome", "captions", "reactions", "flowchart_edges")
        return ", ".join(f"'' AS {column}" if column in empty else
                         f"substr({column}, 1, 160) AS {column}" if column in ("text", "line") else column
                         for column in columns)
