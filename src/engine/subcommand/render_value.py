from dataclasses import is_dataclass
from engine.subcommand.lines_value import LinesValue
from engine.subcommand.output import Output
from engine.model.model import Model
from engine.row.page import is_page


def render_value(value: object, output: Output) -> None:
    if isinstance(value, LinesValue):
        output.write("\n".join(value.lines()), value.json())
    elif is_page(value):
        output.page(value)
    elif isinstance(value, Model) or (is_dataclass(value) and not isinstance(value, type)):
        output.row(value)
    else:
        output.line(str(value))
