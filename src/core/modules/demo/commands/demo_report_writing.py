from core.base.subcommand.output import Output
from core.modules.demo.commands.demo_report import DemoReport


class DemoReportWriting:
    """Prints a demo report, one line to a line."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DemoReport):
            output.write("\n".join(value.lines), {"lines": value.lines})
