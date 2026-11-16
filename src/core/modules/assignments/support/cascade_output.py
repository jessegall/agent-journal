from engine.subcommand.output import Output
from core.modules.assignments.support.cascade import Cascade


class CascadeOutput:
    """Prints an assignment's cascade: its lines and its JSON."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Cascade):
            output.write(value.text, value.json())
