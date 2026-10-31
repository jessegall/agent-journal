from collections.abc import Callable
from typing import TypeVar

from core.base.model.model import Model
from core.base.subcommand.output import Output
from core.base.type_guards import is_tuple

M = TypeVar("M", bound=Model)


class ListedRows:
    """Writes the rows of one model that a list subcommand read, a line each, and all of them as JSON."""

    @staticmethod
    def write(output: Output, value: object, model: type[M], line: Callable[[M], str]) -> None:
        rows = [row for row in value if isinstance(row, model)] if is_tuple(value) else []
        output.write("\n".join(line(row) for row in rows), {"rows": [output.values(row) for row in rows]})
