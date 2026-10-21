from dataclasses import dataclass


@dataclass(frozen=True)
class Condition:
    """One term of a query's WHERE, its SQL text and the values bound to its placeholders."""

    text: str
    params: tuple = ()

    def inlined(self) -> "Condition":
        parts = self.text.split("?")
        return Condition("".join(part + self.literal(value) for part, value in zip(parts, self.params)) + parts[-1])

    @staticmethod
    def literal(value) -> str:
        if value is None:
            return "NULL"
        if isinstance(value, str):
            return "'" + value.replace("'", "''") + "'"
        return str(int(value) if isinstance(value, bool) else value)
