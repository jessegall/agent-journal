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
            return OutputView.unmeasured(output.id, (), ending)
        if not output.watch_reader:
            return OutputView.unmeasured(output.id, tuple(files.last(TAIL_LINES)), ending)
        reader, lines = self.readers.lookup(output.watch_reader), files.lines()
        progress = reader.progress(lines)
        figure = progress.text() if progress.is_known() else ""
        return OutputView(output.id, tuple(reader.read(lines)[-VIEW_LINES:]), figure, progress.fraction(), ending)

    def card(self, output: CommandOutput) -> OutputView:
        view = self.view(output)
        data = {"kind": "card", "icon": "terminal", "tone": "", "output": output.id, "figure": view.figure, "fraction": view.fraction, "ending": view.ending}
        label = f"Watching output {output.id}: {output.headline()[:HEADLINE_CHARACTERS]}"
        self.cards.keyed(output.environment_id, OutputView.key(output.id), label, data if output.session is None else {**data, "session": output.session}, Actor.system(), CardKind.COMMANDS, "\n".join(view.lines))
        return view

    def card_view(self, output: CommandOutput) -> OutputView:
        cards = self.messages.keyed(OutputView.key(output.id), Actor.system())
        return OutputView.parsed(cards[0]) if cards else OutputView.empty()
