from engine.subcommand.output import Output
from core.modules.plugins.models.queued_run import QueuedRun


def write_queued_run(value: object, output: Output) -> None:
    """Prints a queued plugin run as its one line, with its row as the JSON form."""
    if isinstance(value, QueuedRun):
        output.write(value.line(), output.values(value))
