from core.base.subcommand.output import Output
from core.modules.processes.commands.output_lines import OutputLines


class OutputLinesWriting:
    """Prints the lines a subcommand read from an output, or says there are none."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            value.write(output)
