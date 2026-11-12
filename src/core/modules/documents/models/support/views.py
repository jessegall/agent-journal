from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.literal import Literal
from engine.query.select import Select

SHARED_COLUMNS = ("id", "title", "abstract", "close_reason", "updated_at")


def document_rows(table: str, row_type: str) -> Select:
    """The rows of one kind of document, keyed by its type and id."""
    return Select(table).selecting(Aliased(Concat([Literal(f"{row_type}:"), Column("id")]), "row_key"), Aliased(Literal(row_type), "row_type"),
                                   *(Column(name) for name in SHARED_COLUMNS))


DOCUMENT_ROWS_SELECT = document_rows("docs", "doc").union(document_rows("reports", "report")).view_sql()
