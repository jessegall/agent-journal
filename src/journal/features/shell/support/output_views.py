from pathlib import Path

from journal.chat.cards import Cards
from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.readers import Readers
from journal.models.command_output import CommandOutput
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.card_kind import CardKind

TAIL_LINES = 10
VIEW_LINES = 20
HEADLINE_CHARACTERS = 60


class OutputViews:
    """The view of a watched output, read from its files through its reader, and the card in the chat that shows it, kept in place by its key."""

    def __init__(self, readers: Readers, cards: Cards, messages: Messages) -> None:
        self.readers, self.cards, self.messages = readers, cards, messages

    def view(self, output: CommandOutput) -> OutputView:
        files = OutputFiles(Path(output.folder))
        ending = output.ending() if output.ended else ""
        if not files.is_stored():
            return OutputView.unmeasured(output.row_id, (), ending)
        if not output.watch_reader:
            return OutputView.unmeasured(output.row_id, tuple(files.last(TAIL_LINES)), ending)
        reader, lines = self.readers.lookup(output.watch_reader), files.lines()
        progress = reader.progress(lines)
        figure = progress.text() if progress.is_known() else ""
        return OutputView(output.row_id, tuple(reader.read(lines)[-VIEW_LINES:]), figure, progress.fraction(), ending)

    def card(self, output: CommandOutput) -> OutputView:
        view = self.view(output)
        part = self.watched_part(output)
        data = {"kind": "card", "icon": "terminal", "tone": self.tone(output), "output": output.id, "figure": view.figure, "fraction": view.fraction, "ending": view.ending, "line": part}
        self.cards.keyed(output.environment_id, OutputView.key(output.row_id), self.title(output, part), data, Actor.system(), CardKind.COMMANDS, "\n".join(view.lines), output.session)
        return view

    @staticmethod
    def tone(output: CommandOutput) -> str:
        if not output.ended:
            return ""
        return "good" if output.is_success() else "bad"

    def title(self, output: CommandOutput, part: str) -> str:
        reader_label = self.readers.lookup(output.watch_reader).label if output.watch_reader else ""
        heading = output.watch_title or reader_label or ActivityLabel.build(part)
        return heading[:1].upper() + heading[1:HEADLINE_CHARACTERS]

    @staticmethod
    def watched_part(output: CommandOutput) -> str:
        files = OutputFiles(Path(output.folder))
        if not files.is_stored() or not files.recorded():
            return output.headline()
        open_parts = [i for i in files.recorded() if not files.has_ended(i)]
        return files.part_text(open_parts[0] if open_parts else files.recorded()[-1])

    def card_view(self, output: CommandOutput) -> OutputView:
        cards = self.messages.keyed(OutputView.key(output.row_id), Actor.system())
        return OutputView.parsed(cards[0]) if cards else OutputView.empty()
