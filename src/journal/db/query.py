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
DAY_SECONDS = 86400


@dataclass(frozen=True)
class Query:
    """A read or a write of one table composed in calls, each returning a new query, and rendered to SQL text and its parameters for the Connection to run; a column the table does not have fails as it is named, and data->key->key names a JSON path in a column; a model that shares its table with another reads and writes only rows of its own kind, and is named in refs by its own name; a read may leave columns out, whose fields its rows then hold at their defaults, and keys out of a JSON column."""

    table: str
    columns: Mapping[str, Column]
    conditions: tuple[Condition, ...] = ()
    orders: tuple[str, ...] = ()
    row_limit: int = -1
    row_offset: int = 0
    subquery_tables: tuple[str, ...] = ()
    ref_table: str = ""
    omitted: tuple[str, ...] = ()
    omitted_keys: tuple[tuple[str, str], ...] = ()

    @classmethod
    def build(cls, model: type[Model]) -> "Query":
        return cls(model.storage(), {column.name: column for column in Schema.columns(model)}, ref_table=model.table()).filter(**model.type_filter())

    @property
    def ref_name(self) -> str:
        return self.ref_table or self.table

    def filter(self, **fields) -> "Query":
        query = self
        for name, value in fields.items():
            query = query.filter_null(name) if value is None else query._compared(name, "=", value)
        return query

    def filter_json(self, path: str, value) -> "Query":
        return self._compared(path, "=", value)

    def filter_record(self, column: str, **fields) -> "Query":
        checks = " AND ".join(f"{self.record_key(column, key)} = ?" for key in fields)
        return self._with(Condition(f"EXISTS (SELECT 1 FROM json_each({self._column(column).name}) WHERE {checks})", tuple(fields.values())))

    def filter_record_listed(self, column: str, key: str, values: list) -> "Query":
        marks = ", ".join("?" for _ in values)
        return self._with(Condition(f"EXISTS (SELECT 1 FROM json_each({self._column(column).name}) WHERE {self.record_key(column, key)} IN ({marks}))", tuple(values)))

    def record_key(self, column: str, key: str) -> str:
        if not JSON_KEY.match(key):
            raise UnknownColumn(self.table, f"{column}{JSON_ARROW}{key}")
        return f"json_extract(value, '$.{key}')"

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
        return self._with(Condition(f"{self.expression(column)} IS NULL"))

    def filter_present(self, column: str) -> "Query":
        return self._with(Condition(f"{self.expression(column)} IS NOT NULL"))

    def filter_lasting(self, start: str, end: str, seconds: float) -> "Query":
        return self._with(Condition(f"{self._span(start, end)} >= ?", (seconds / DAY_SECONDS,)))

    def filter_lasting_less(self, start: str, end: str, seconds: float) -> "Query":
        return self._with(Condition(f"{self._span(start, end)} < ?", (seconds / DAY_SECONDS,)))

    def _span(self, start: str, end: str) -> str:
        return f"julianday({self.expression(end)}) - julianday({self.expression(start)})"

    def filter_prefix(self, column: str, prefix: str) -> "Query":
        return self.filter_greater_equal(column, prefix).filter_less(column, prefix + PREFIX_END)

    def filter_missing_prefix(self, column: str, prefix: str) -> "Query":
        expression = self.expression(column)
        return self._with(Condition(f"({expression} IS NULL OR {expression} < ? OR {expression} >= ?)", (prefix, prefix + PREFIX_END)))

    def filter_containing(self, column: str, text: str) -> "Query":
        escaped = text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        return self._with(Condition(f"{self.expression(column)} LIKE ? ESCAPE '\\'", (f"%{escaped}%",)))

    def filter_alternatives(self, *alternatives: "Query") -> "Query":
        terms = [alternative._joined() for alternative in alternatives]
        text = " OR ".join(term.text if len(alternative.conditions) == 1 else f"({term.text})" for term, alternative in zip(terms, alternatives))
        alternated = self._with(Condition(f"({text})", tuple(param for term in terms for param in term.params)))
        return replace(alternated, subquery_tables=(*self.subquery_tables, *(table for alternative in alternatives for table in alternative.subquery_tables)))

    def filter_absent(self, query: "Query") -> "Query":
        return self._matched("NOT EXISTS", query)

    def filter_existing(self, query: "Query") -> "Query":
        return self._matched("EXISTS", query)

    def _matched(self, operator: str, query: "Query") -> "Query":
        filters = query._filters()
        matched = self._with(Condition(f"{operator} (SELECT 1 FROM {query.table}{filters.text})", filters.params))
        return replace(matched, subquery_tables=(*self.subquery_tables, query.table, *query.subquery_tables))

    def tables(self) -> tuple[str, ...]:
        return (self.table, *self.subquery_tables)

    def filter_ref(self, column: str, query: "Query") -> "Query":
        return self._with(Condition(f"{self.table}.{self._column(column).name} = ? || {query.table}.id", (f"{query.ref_name}:",)))

    # the id is read out of the name first, so the row is found by its primary key, not by reading the whole table; the
    # whole name is compared after, so only an exact "<name>:<id>" matches
    def filter_name_column(self, query: "Query", column: str) -> "Query":
        name_column, prefix = f"{query.table}.{query._column(column).name}", f"{self.ref_name}:"
        return self._with(Condition(f"{self.table}.id = CAST(substr({name_column}, {len(prefix) + 1}) AS INTEGER) AND {name_column} = ? || {self.table}.id", (prefix,)))

    def inlined(self) -> "Query":
        return replace(self, conditions=tuple(condition.inlined() for condition in self.conditions))

    def order(self, column: str) -> "Query":
        return replace(self, orders=(*self.orders, self.expression(column)))

    def order_descending(self, column: str) -> "Query":
        return replace(self, orders=(*self.orders, f"{self.expression(column)} DESC"))

    def limit(self, rows: int) -> "Query":
        return replace(self, row_limit=rows)

    def without(self, *columns: str) -> "Query":
        return replace(self, omitted=(*self.omitted, *(self._column(name).name for name in columns)))

    def with_columns(self, *columns: str) -> "Query":
        columns_read = {"id", *(self._column(name).name for name in columns)}
        return replace(self, omitted=tuple(name for name in self.columns if name not in columns_read))

    def without_keys(self, column: str, *keys: str) -> "Query":
        if not all(JSON_KEY.match(key) for key in keys):
            raise UnknownColumn(self.table, column)
        return replace(self, omitted_keys=(*self.omitted_keys, *((self._column(column).name, key) for key in keys)))

    def offset(self, rows: int) -> "Query":
        return replace(self, row_offset=rows)

    def clause(self) -> str:
        return self._joined().text

    def select(self) -> tuple[str, tuple]:
        return self._read(", ".join(self.selected_column(name) for name in self.columns if name not in self.omitted) if self.omitted or self.omitted_keys else "*")

    def selected_column(self, name: str) -> str:
        keys = [f"'$.{key}'" for column, key in self.omitted_keys if column == name]
        return f"json_remove({name}, {', '.join(keys)}) AS {name}" if keys else name

    def select_ids(self) -> tuple[str, tuple]:
        return self._read("id")

    def select_values(self, column: str) -> tuple[str, tuple]:
        return self._read(f"{self.expression(column)} AS value")

    def count(self) -> tuple[str, tuple]:
        return self._read("count(*) AS value")

    def grouped(self, column: str) -> tuple[str, tuple]:
        text, params = self._read(f"{self.expression(column)} AS value, count(*) AS total")
        return f"{text} GROUP BY value", params

    def grouped_tally(self, columns: tuple[str, ...], latest: str) -> tuple[str, tuple]:
        selections = ", ".join(f"{self.expression(column)} AS value{index}" for index, column in enumerate(columns))
        text, params = self._read(f"{selections}, count(*) AS total, MAX({self.expression(latest)}) AS latest")
        return f"{text} GROUP BY {', '.join(f'value{index}' for index in range(len(columns)))}", params

    def grouped_sum(self, column: str, *summed: str) -> tuple[str, tuple]:
        total = " + ".join(f"COALESCE(SUM({self.expression(name)}), 0)" for name in summed)
        text, params = self._read(f"{self.expression(column)} AS value, {total} AS total")
        return f"{text} GROUP BY value", params

    def maximum(self, column: str, empty_value) -> tuple[str, tuple]:
        return self._read(f"COALESCE(MAX({self.expression(column)}), {Condition.literal(empty_value)}) AS value")

    def minimum(self, column: str, empty_value) -> tuple[str, tuple]:
        return self._read(f"COALESCE(MIN({self.expression(column)}), {Condition.literal(empty_value)}) AS value")

    def repeated(self, column: str, minimum: int) -> tuple[str, tuple]:
        text, params = self._read(f"{self.expression(column)} AS value")
        return f"SELECT value FROM ({text}) WHERE value != '' GROUP BY value HAVING COUNT(*) >= ?", (*params, minimum)

    def insert(self, **values) -> tuple[str, tuple]:
        names = ", ".join(self._column(name).name for name in values)
        return f"INSERT INTO {self.table} ({names}) VALUES ({', '.join('?' for _ in values)})", self._values(values)

    def upsert(self, **values) -> tuple[str, tuple]:
        text, params = self.insert(**values)
        assignments = ", ".join(f"{self._column(name).name} = excluded.{self._column(name).name}" for name in values if name != "id")
        return f"{text} ON CONFLICT(id) DO UPDATE SET {assignments}", params

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
        return self._with(Condition(f"{self.expression(column)} {operator} ?", (self._value(column, value),)))

    def _listed(self, column: str, operator: str, values) -> "Query":
        values = tuple(self._value(column, value) for value in values)
        return self._with(Condition(f"{self.expression(column)} {operator} ({', '.join('?' for _ in values)})", values))

    def _with(self, condition: Condition) -> "Query":
        return replace(self, conditions=(*self.conditions, condition))

    def _values(self, values: dict) -> tuple:
        return tuple(self._column(name).sql(value) for name, value in values.items())

    def _value(self, column: str, value):
        return value if JSON_ARROW in column else self._column(column).sql(value)

    def expression(self, column: str) -> str:
        name, *keys = column.split(JSON_ARROW)
        if not all(JSON_KEY.match(key) for key in keys):
            raise UnknownColumn(self.table, column)
        matched = self._column(name).name
        return f"json_extract({matched}, '$.{'.'.join(keys)}')" if keys else matched

    def _column(self, name: str) -> Column:
        if name not in self.columns:
            raise UnknownColumn(self.table, name)
        return self.columns[name]
