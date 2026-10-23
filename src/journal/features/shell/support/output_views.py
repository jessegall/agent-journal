import time
from dataclasses import replace
from pathlib import Path

from journal.chat.cards import AUTO_DOCKED, DOCKED, Cards
from journal.chat.docking import Docking
from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.card_line import CardLine
from journal.features.shell.support.card_progress import CardProgress
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.readers import Readers
from journal.models.command_output import CommandOutput
from journal.repositories.messages import Messages
from journal.repositories.setting_rows import SettingRows
from journal.support.actor import Actor
from journal.support.card_kind import CardKind

TAIL_LINES = 10
VIEW_LINES = 20
HEADLINE_CHARACTERS = 60
ENDED_DOCK_SECONDS = 5
UNDOCK_AT = "undock_at"
SILENT_SECONDS = 30


class OutputViews:
    """The view of a watched output, read from its files through its reader, and the card in the chat that shows it, kept in place by its key."""

    def __init__(self, readers: Readers, cards: Cards, messages: Messages, settings: SettingRows, docking: Docking) -> None:
        self.readers, self.cards, self.messages, self.settings, self.docking = readers, cards, messages, settings, docking

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
        figure = progress.text() if progress.is_known() else ""
        return OutputView(output.row_id, tuple(reader.read(lines)[-VIEW_LINES:]), figure, progress.fraction(), ending)

    def card_lines(self, output: CommandOutput, view: OutputView) -> tuple[str, ...]:
        files = OutputFiles(Path(output.folder))
        if not output.watch_reader or not files.is_stored():
            return view.lines
        return tuple(CardLine.plain(line) for line in self.readers.lookup(output.watch_reader).variant(output.stage()).card_lines(files.lines())[-VIEW_LINES:])

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

    def card(self, output: CommandOutput) -> OutputView:
        view = self.view(output)
        part = self.watched_part(output)
        data = {"kind": "card", "icon": "terminal", "output": output.id, "line": part, "reader": output.watch_reader, "poor_line": self.poor_line(output, view), "empty_card": self.is_empty_card(output, view), "silent": view.silent, **self.progress(output, view).fields(), **self.dock_state(output)}
        self.cards.keyed(output.environment_id, OutputView.key(output.row_id), self.title(output, part), data, Actor.system(), CardKind.COMMANDS, self.card_text(output, view), output.session)
        return view

    def progress(self, output: CommandOutput, view: OutputView) -> CardProgress:
        return CardProgress(self.tone(output), view.figure, view.fraction, view.ending, self.count(output))

    def progress_view(self, output: CommandOutput) -> dict:
        view = self.view(output)
        return {**self.progress(output, view).fields(), **self.cards.detail_parts(self.card_text(output, view))}

    def card_text(self, output: CommandOutput, view: OutputView) -> str:
        return "\n".join(self.card_lines(output, view) or self.ending_lines(output))

    def dock_state(self, output: CommandOutput) -> dict:
        from journal.features.shell.feature import Shell
        cards = self.messages.keyed(OutputView.key(output.row_id), Actor.system())
        if not cards:
            return {DOCKED: True, AUTO_DOCKED: True} if not output.ended and self.settings.option(Shell.OUTPUT_DOCK) else {}
        if not output.ended or not cards[0].data.get(AUTO_DOCKED):
            return {}
        return {UNDOCK_AT: cards[0].data.get(UNDOCK_AT) or time.time() + ENDED_DOCK_SECONDS}

    @staticmethod
    def tone(output: CommandOutput) -> str:
        if not output.ended:
            return ""
        return "good" if output.is_success() else "bad"

    def title(self, output: CommandOutput, part: str) -> str:
        reader = self.readers.lookup(output.watch_reader) if output.watch_reader else None
        heading = output.watch_title or (reader.label if reader is not None else "") or ActivityLabel.build(part)
        topic = reader.topic(output.command) if reader is not None else ""
        full = f"{heading}: {topic}" if topic else heading
        return full[:1].upper() + full[1:HEADLINE_CHARACTERS]

    @staticmethod
    def watched_part(output: CommandOutput) -> str:
        files = OutputFiles(Path(output.folder))
        if not files.is_stored() or not files.recorded():
            return output.headline()
        open_parts = [i for i in files.recorded() if not files.has_ended(i)]
        return files.part_text(open_parts[0] if open_parts else files.recorded()[-1])

    def undocked(self, output: CommandOutput, actor: Actor) -> None:
        for card in self.messages.keyed(OutputView.key(output.row_id), Actor.system()):
            self.docking.release(card, actor)

    def card_view(self, output: CommandOutput) -> OutputView:
        cards = self.messages.keyed(OutputView.key(output.row_id), Actor.system())
        return OutputView.parsed(cards[0]) if cards else OutputView.empty()
