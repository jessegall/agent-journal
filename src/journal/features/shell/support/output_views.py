from pathlib import Path

from journal.chat.cards import Cards
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
        data = {"kind": "card", "icon": "terminal", "tone": "", "output": output.id, "figure": view.figure, "fraction": view.fraction, "ending": view.ending}
        label = f"Watching output {output.id}: {self.watched_part(output)[:HEADLINE_CHARACTERS]}"
        self.cards.keyed(output.environment_id, OutputView.key(output.row_id), label, data, Actor.system(), CardKind.COMMANDS, "\n".join(view.lines), output.session)
        return view

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
