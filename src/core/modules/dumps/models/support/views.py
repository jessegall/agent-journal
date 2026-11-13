from engine.query.conditions.condition_join import ConditionJoin
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.literal import Literal
from engine.query.select import Select

ITEM_COLUMNS = ("text", "state", "note", "summary", "refs")

DUMP_ROWS_SELECT = (
    Select("dumps").selecting(
        Aliased(Concat([Literal("dump:"), Column("dumps.id")]), "row_key"), Aliased(Literal("dump"), "row_type"), Aliased(Column("dumps.id"), "dump_id"),
        Aliased(Literal(0), "item_id"), Aliased(Literal(0), "position"), Column("dumps.title"), Column("dumps.brief"), Column("dumps.outcome"),
        Aliased(Literal(""), "text"), Aliased(Literal(""), "state"), Aliased(Literal(""), "note"), Aliased(Literal(""), "summary"), Aliased(Literal("[]"), "refs"))
    .union(Select("dump_items").selecting(
        Concat([Literal("item:"), Column("dump_items.id")]), Literal("item"), Column("dumps.id"), Column("dump_items.id"), Column("dump_items.position"),
        Literal(""), Literal(""), Literal(""), *(Column(f"dump_items.{name}") for name in ITEM_COLUMNS))
           .joined(ConditionJoin("dumps", condition=ColumnCompare("dumps.id", "=", "dump_items.dump_id"))))
).view_sql()
