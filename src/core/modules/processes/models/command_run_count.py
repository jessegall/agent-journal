from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class CommandRunCount(Model):
    """One command, by its key, and how many of its runs ended without a good reader since the count was last set
    back to zero by a reader saved or changed for it or a mark that its output cannot be read."""

    model_name = "command_run_count"
    cli_name = "command-run-count"

    command_key: str
    runs_without_reader: int = 0
