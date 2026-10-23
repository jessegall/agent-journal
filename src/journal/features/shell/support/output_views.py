import time
from dataclasses import replace
from pathlib import Path

from journal.features.shell.support.card_line import CardLine
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.step_tally import StepTally
from journal.models.command_output import CommandOutput

TAIL_LINES = 10
VIEW_LINES = 20
SILENT_SECONDS = 30


class OutputViews:
    """The view of a watched output, read from its files through its reader, and the lines, progress and silence its process card shows."""

    def __init__(self, readers: Readers) -> None:
        self.readers = readers

    def view(self, output: CommandOutput) -> OutputView:
        measured = self.measured(output)
        return replace(measured, silent=self.is_silent(output, measured))

    def is_silent(self, output: CommandOutput, view: OutputView) -> bool:
        return not output.ended and time.time() - output.creation_time.timestamp() >= SILENT_SECONDS and not view.figure and not self.card_lines(output, view)

    def measured(self, output: CommandOutput) -> OutputView:
        files = OutputFiles(Path(output.folder))
        ending = output.ending() if output.ended else ""
        if not files.is_stored():
            return OutputView.unmeasured(output.row_id, (), ending)
        if not output.watch_reader:
            return OutputView.unmeasured(output.row_id, tuple(files.last(TAIL_LINES)), ending)
        reader, lines = self.readers.lookup(output.watch_reader).variant(output.stage()), files.lines()
        progress = reader.progress(lines)
        tally = reader.tally(lines) if not output.ended else StepTally(0, 0)
        figure = " · ".join(part for part in (progress.text() if progress.is_known() else "", tally.text() if tally.is_known() else "") if part)
        return OutputView(output.row_id, tuple(reader.read(lines)[-VIEW_LINES:]), figure, progress.fraction(), ending)

    def card_lines(self, output: CommandOutput, view: OutputView) -> tuple[str, ...]:
        files = OutputFiles(Path(output.folder))
        if not output.watch_reader or not files.is_stored():
            return view.lines
        reader, lines = self.readers.lookup(output.watch_reader).variant(output.stage()), files.lines()
        summary_lines = tuple(CardLine.plain(line) for line in reader.card_lines(lines)[-VIEW_LINES:])
        return summary_lines or self.tally_lines(output, reader.tally(lines))

    @staticmethod
    def tally_lines(output: CommandOutput, tally: StepTally) -> tuple[str, ...]:
        return (tally.text(),) if output.ended and tally.is_known() else ()

    def is_summary_missing(self, output: CommandOutput) -> bool:
        files = OutputFiles(Path(output.folder))
        if not output.ended or not output.watch_reader or not files.is_stored():
            return False
        reader, lines = self.readers.lookup(output.watch_reader).variant(output.stage()), files.lines()
        return not reader.card_lines(lines) and reader.tally(lines).is_known()

    @staticmethod
    def ending_lines(output: CommandOutput) -> tuple[str, ...]:
        return (output.ending(),) if output.ended else ()

    def is_empty_card(self, output: CommandOutput, view: OutputView) -> bool:
        return bool(output.watch_reader) and output.ended and not self.card_lines(output, view) and not view.figure

    def poor_line(self, output: CommandOutput, view: OutputView) -> str:
        return next((line for line in self.card_lines(output, view) if output.watch_reader and CardLine.is_poor(line)), "")

    def count(self, output: CommandOutput) -> str:
        files = OutputFiles(Path(output.folder))
        if output.ended or not output.watch_reader or not files.is_stored():
            return ""
        progress = self.readers.lookup(output.watch_reader).progress(files.lines())
        return progress.count_text() if progress.is_known() else ""

    def card_text(self, output: CommandOutput, view: OutputView) -> str:
        return "\n".join(self.card_lines(output, view) or self.ending_lines(output))
