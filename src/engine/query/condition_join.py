from dataclasses import dataclass

from engine.query.conditions.condition import Condition
from engine.query.expressions.expression import Expression
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.sql_name import SqlName


@dataclass(frozen=True)
class ConditionJoin:
    """One source a read joins, a table or a subselect or json_each under an alias, on any condition, or on none to
    pair every row; its values are written into the text, as a view needs them."""

    source: str | Expression
    left: bool = False
    condition: Condition | None = None
    alias: str | None = None

    def __post_init__(self) -> None:
        if isinstance(self.source, str):
            SqlName(self.source)
        if self.alias is not None:
            SqlName(self.alias)

    @property
    def table(self) -> str:
        return str(self.source) if self.alias is None else self.alias

    @property
    def sql(self) -> str:
        source = self.source if isinstance(self.source, str) else self.source.sql()
        named = source if self.alias is None else f"{source} AS {self.alias}"
        on = f" ON {Inlined(self.condition).text()}" if self.condition is not None else ""
        return f"{'LEFT JOIN' if self.left else 'JOIN'} {named}{on}"
