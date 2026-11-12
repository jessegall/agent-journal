from collections.abc import Sequence

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.unreadable_mark_query import UnreadableMarkQuery

FEWEST_NOTE_WORDS = 3
MOST_LEADING_WORDS = 8


class UnreadableMarks:
    """The one keeper of the marks of commands whose output no reader can read. A mark covers a command by its
    leading words, so pytest covers pytest tests/a and not npm test; an agent that declares one says why in at least
    three words, and a person or the engine lifts it."""

    def __init__(self, marks: UnreadableMarkQuery, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def marked(self, command: str) -> UnreadableMark | None:
        return self.marks.standing().of_words(UnreadableMarks.covering_words(command)).newest().first()

    def marked_among(self, commands: Sequence[str]) -> frozenset[str]:
        """The commands a standing mark covers, from one read of the marks of all of them."""
        covering = {command: UnreadableMarks.covering_words(command) for command in dict.fromkeys(commands)}
        words = sorted({word for leading in covering.values() for word in leading})
        marked = set(self.marks.standing().of_words(words).pluck("words")) if words else set()
        return frozenset(command for command, leading in covering.items() if marked.intersection(leading))

    def excuses(self, command: str) -> bool:
        """Whether a standing mark covers the command, so nothing asks it for a reader."""
        return self.marked(command) is not None

    def last_marked_among(self, commands: Sequence[str]) -> dict[str, Timestamp | None]:
        """When the newest mark covering each command was made, lifted or not, from one read of the marks of all of
        them; none for a command never marked."""
        covering = {command: UnreadableMarks.covering_words(command) for command in dict.fromkeys(commands)}
        words = sorted({word for leading in covering.values() for word in leading})
        newest: dict[str, Timestamp] = {}
        for mark in (self.marks.of_words(words).all_rows() if words else []):
            made_at = mark.creation_timestamp()
            if mark.words not in newest or made_at > newest[mark.words]:
                newest[mark.words] = made_at
        return {command: max((newest[word] for word in leading if word in newest), default=None) for command, leading in covering.items()}

    def declare(self, creator_id: int, words: str, note: str, context: Context) -> UnreadableMark:
        return self.mark(creator_id, words, UnreadableReason.DECLARED, UnreadableMarks.checked_note(note), context)

    def mark(self, creator_id: int, words: str, reason: UnreadableReason, note: str, context: Context) -> UnreadableMark:
        return self.repository.save(UnreadableMark(creator_id=creator_id, words=UnreadableMarks.leading_words(words), reason=reason, note=note), context)

    def lift(self, words: str, lifter_id: int, context: Context) -> UnreadableMark:
        mark = self.marks.standing().of_words([UnreadableMarks.leading_words(words)]).newest().first()
        if mark is None:
            raise Refusal(f"no command {words} is marked unreadable", "journal unreadable-mark list names the marked commands")
        return self.repository.update(mark, context, lifter_id=lifter_id, lifted_at=context.timestamp)

    @staticmethod
    def leading_words(words: str) -> str:
        return " ".join(words.split())

    @staticmethod
    def checked_note(note: str) -> str:
        """The agent's reason for a mark, refused when it is empty or shorter than three words."""
        if len(note.split()) < FEWEST_NOTE_WORDS:
            raise Refusal("a command is marked unreadable only with a reason of at least three words",
                          'say why no reader can read it, such as --note "prints only a progress bar"')
        return note.strip()

    @staticmethod
    def covering_words(command: str) -> list[str]:
        """The leading words a mark covering the command can have: its first word, its first two, and so on."""
        terms = command.split()[:MOST_LEADING_WORDS]
        return [" ".join(terms[:count]) for count in range(1, len(terms) + 1)]

    @staticmethod
    def covers(words: str, command: str) -> bool:
        """Whether a mark of these leading words covers the command."""
        return UnreadableMarks.leading_words(words) in UnreadableMarks.covering_words(command)
