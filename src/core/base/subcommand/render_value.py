from dataclasses import is_dataclass
from core.base.subcommand.output import Output
from core.base.model.model import Model
from core.base.page import is_page


def render_value(value: object, output: Output) -> None:
    if is_page(value):
        output.page(value)
    elif isinstance(value, Model) or (is_dataclass(value) and not isinstance(value, type)):
        output.row(value)
    else:
        output.line(str(value))
