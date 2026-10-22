import re
from collections.abc import Mapping
from dataclasses import dataclass, replace

from journal.db.condition import Condition
from journal.db.schema import Schema
from journal.db.unknown_column import UnknownColumn
from journal.models.model import Model
from journal.models.support.column import Column

JSON_KEY = re.compile(r"^[a-z_]+$")
JSON_ARROW = "->"
PREFIX_END = "￿"


@dataclass(frozen=True)
class Query:
    """A read or a write of one table composed in calls, each returning a new query, and rendered to SQL text and its parameters for the Connection to run; a column the table does not have fails as it is named, and data->key->key names a JSON path in a column."""

    table: str
    columns: Mapping[str, Column]
    conditions: tuple[Condition, ...] = ()
    orders: tuple[str, ...] = ()
    row_limit: int = -1
    row_offset: int = 0

    @classmethod
    def build(cls, model: type[Model]) -> "Query":
        return cls(model.table(), {column.name: column for column in Schema.columns(model)})

    def filter(self, **fields) -> "Query":
        query = self
        for name, value in fields.items():
            query = query.filter_null(name) if value is None else query._compared(name, "=", value)
        return query

    def filter_json(self, path: str, value) -> "Query":
        return self._compared(path, "=", value)

    def filter_unequal(self, column: str, value) -> "Query":
        return self._compared(column, "IS NOT", value)

    def filter_greater(self, column: str, value) -> "Query":
        return self._compared(column, ">", value)

    def filter_less(self, column: str, value) -> "Query":
        return self._compared(column, "<", value)

    def filter_greater_equal(self, column: str, value) -> "Query":
        return self._compared(column, ">=", value)

    def filter_less_equal(self, column: str, value) -> "Query":
        return self._compared(column, "<=", value)

    def filter_listed(self, column: str, values) -> "Query":
        return self._listed(column, "IN", values)

    def filter_unlisted(self, column: str, values) -> "Query":
        return self._listed(column, "NOT IN", values)

    def filter_null(self, column: str) -> "Query":
        return self._with(Condition(f"{self._expression(column)} IS NULL"))

    def filter_present(self, column: str) -> "Query":
        return self._with(Condition(f"{self._expression(column)} IS NOT NULL"))

    def filter_prefix(self, column: str, prefix: str) -> "Query":
        return self.filter_greater_equal(column, prefix).filter_less(column, prefix + PREFIX_END)

    def filter_lacking_prefix(self, column: str, prefix: str) -> "Query":
        expression = self._expression(column)
        return self._with(Condition(f"({expression} IS NULL OR {expression} < ? OR {expression} >= ?)", (prefix, prefix + PREFIX_END)))

    def filter_containing(self, column: str, text: str) -> "Query":
        escaped = text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        return self._with(Condition(f"{self._expression(column)} LIKE ? ESCAPE '\\'", (f"%{escaped}%",)))

    def filter_alternatives(self, *alternatives: "Query") -> "Query":
        terms = [alternative._joined() for alternative in alternatives]
        text = " OR ".join(term.text if len(alternative.conditions) == 1 else f"({term.text})" for term, alternative in zip(terms, alternatives))
        return self._with(Condition(f"({text})", tuple(param for term in terms for param in term.params)))

    def filter_absent(self, query: "Query") -> "Query":
        filters = query._filters()
        return self._with(Condition(f"NOT EXISTS (SELECT 1 FROM {query.table}{filters.text})", filters.params))

    def filter_ref(self, column: str, query: "Query") -> "Query":
        return self._with(Condition(f"{self.table}.{self._column(column).name} = ? || {query.table}.id", (f"{query.table}:",)))

    def inlined(self) -> "Query":
        return replace(self, conditions=tuple(condition.inlined() for condition in self.conditions))

    def order(self, column: str) -> "Query":
        return replace(self, orders=(*self.orders, self._expression(column)))

    def order_descending(self, column: str) -> "Query":
        return replace(self, orders=(*self.orders, f"{self._expression(column)} DESC"))

    def limit(self, rows: int) -> "Query":
        return replace(self, row_limit=rows)

    def offset(self, rows: int) -> "Query":
        return replace(self, row_offset=rows)

    def clause(self) -> str:
        return self._joined().text

    def select(self) -> tuple[str, tuple]:
        return self._read("*")

    def count(self) -> tuple[str, tuple]:
        return self._read("count(*) AS value")

    def maximum(self, column: str, empty_value) -> tuple[str, tuple]:
        return self._read(f"COALESCE(MAX({self._expression(column)}), {Condition.literal(empty_value)}) AS value")

    def repeated(self, column: str, minimum: int) -> tuple[str, tuple]:
        text, params = self._read(f"{self._expression(column)} AS value")
        return f"SELECT value FROM ({text}) WHERE value != '' GROUP BY value HAVING COUNT(*) >= ?", (*params, minimum)

    def insert(self, **values) -> tuple[str, tuple]:
        names = ", ".join(self._column(name).name for name in values)
        return f"INSERT INTO {self.table} ({names}) VALUES ({', '.join('?' for _ in values)})", self._values(values)

    def update(self, **values) -> tuple[str, tuple]:
        filters = self._filters()
        assignments = ", ".join(f"{self._column(name).name} = ?" for name in values)
        return f"UPDATE {self.table} SET {assignments}{filters.text}", (*self._values(values), *filters.params)

    def delete(self) -> tuple[str, tuple]:
        filters = self._filters()
        return f"DELETE FROM {self.table}{filters.text}", filters.params

    def _read(self, selection: str) -> tuple[str, tuple]:
        filters = self._filters()
        text = f"SELECT {selection} FROM {self.table}{filters.text}"
        if self.orders:
            text += f" ORDER BY {', '.join(self.orders)}"
        if self.row_limit == -1 and not self.row_offset:
            return text, filters.params
        return f"{text} LIMIT ? OFFSET ?", (*filters.params, self.row_limit, self.row_offset)

    def _filters(self) -> Condition:
        joined = self._joined()
        return Condition(f" WHERE {joined.text}", joined.params) if self.conditions else joined

    def _joined(self) -> Condition:
        return Condition(" AND ".join(condition.text for condition in self.conditions), tuple(param for condition in self.conditions for param in condition.params))

    def _compared(self, column: str, operator: str, value) -> "Query":
        return self._with(Condition(f"{self._expression(column)} {operator} ?", (self._value(column, value),)))

    def _listed(self, column: str, operator: str, values) -> "Query":
        values = tuple(self._value(column, value) for value in values)
        return self._with(Condition(f"{self._expression(column)} {operator} ({', '.join('?' for _ in values)})", values))

    def _with(self, condition: Condition) -> "Query":
        return replace(self, conditions=(*self.conditions, condition))

    def _values(self, values: dict) -> tuple:
        return tuple(self._column(name).sql(value) for name, value in values.items())

    def _value(self, column: str, value):
        return value if JSON_ARROW in column else self._column(column).sql(value)

    def _expression(self, column: str) -> str:
        name, *keys = column.split(JSON_ARROW)
        if not all(JSON_KEY.match(key) for key in keys):
            raise UnknownColumn(self.table, column)
        matched = self._column(name).name
        return f"json_extract({matched}, '$.{'.'.join(keys)}')" if keys else matched

    def _column(self, name: str) -> Column:
        if name not in self.columns:
            raise UnknownColumn(self.table, name)
        return self.columns[name]
