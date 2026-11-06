from collections.abc import Sequence


class WorkContextReferenceColumns:
    """Leaves report and document bodies out of reference metadata reads."""

    @staticmethod
    def columns(columns: Sequence[str]) -> str:
        return ", ".join("'' AS body" if column == "body" else column for column in columns)
