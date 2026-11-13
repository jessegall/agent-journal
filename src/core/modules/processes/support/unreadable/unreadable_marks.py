from collections.abc import Sequence

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.unreadable_mark_query import UnreadableMarkQuery

TERM_MARKS_REASON = "Every mark of the leading words of the commands in hand, lifted or not, so the newest mark of each word is found."

FEWEST_NOTE_TERMS = 3
MOST_LEADING_TERMS = 8


class UnreadableMarks:
    """The one keeper of the marks of commands whose output no reader can read. A mark covers a command
    by its leading words, so pytest covers pytest tests/a and not npm test; an agent that declares
    one says why in at least three words, and a user or the engine lifts it."""

    def __init__(self, marks: UnreadableMarkQuery, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def flagged(self, command: str) -> UnreadableMark | None:
        return self.marks.standing().matching_terms(UnreadableMarks.covering_words(command)).newest().first()

    def flagged_among(self, commands: Sequence[str]) -> frozenset[str]:
        covering, terms = UnreadableMarks.covered_by(commands)
        flagged = set(self.marks.standing().matching_terms(terms).pluck("words", str))
        return frozenset(command for command, leading in covering.items() if flagged.intersection(leading))

    def excuses(self, command: str) -> bool:
        return self.flagged(command) is not None

    def last_flagged_among(self, commands: Sequence[str]) -> dict[str, Timestamp | None]:
        covering, terms = UnreadableMarks.covered_by(commands)
        newest: dict[str, Timestamp] = {}
        for mark in self.marks.matching_terms(terms).every_row(TERM_MARKS_REASON):
            made_at = mark.creation_timestamp()
            if mark.words not in newest or made_at > newest[mark.words]:
                newest[mark.words] = made_at
        return {command: max((newest[word] for word in leading if word in newest), default=None) for command, leading in covering.items()}

    def declare(self, creator_id: int, terms: str, note: str, context: Context) -> UnreadableMark:
        return self.mark(creator_id, terms, UnreadableReason.DECLARED, UnreadableMarks.checked_note(note), context)

    def mark(self, creator_id: int, terms: str, reason: UnreadableReason, note: str, context: Context) -> UnreadableMark:
        return self.repository.save(UnreadableMark(creator_id=creator_id, words=UnreadableMarks.leading_words(terms), reason=reason, note=note), context)

    def lift(self, terms: str, lifter_id: int, context: Context) -> UnreadableMark:
        mark = self.marks.standing().matching_terms([UnreadableMarks.leading_words(terms)]).newest().first()
        if mark is None:
            raise Refusal(f"no command {terms} is marked unreadable", "journal unreadable-mark list shows the marked commands")
        return self.repository.update(mark, context, lifter_id=lifter_id, lifted_at=context.timestamp)

    @staticmethod
    def leading_words(terms: str) -> str:
        return " ".join(terms.split())

    @staticmethod
    def checked_note(note: str) -> str:
        if len(note.split()) < FEWEST_NOTE_TERMS:
            raise Refusal("a command is marked unreadable only with a reason of at least three words",
                          'say why no reader can read it, such as --note "prints only a progress bar"')
        return note.strip()

    @staticmethod
    def covering_words(command: str) -> list[str]:
        terms = command.split()[:MOST_LEADING_TERMS]
        return [" ".join(terms[:count]) for count in range(1, len(terms) + 1)]

    @staticmethod
    def covered_by(commands: Sequence[str]) -> tuple[dict[str, list[str]], list[str]]:
        covering = {command: UnreadableMarks.covering_words(command) for command in dict.fromkeys(commands)}
        return covering, sorted({word for leading in covering.values() for word in leading})

    @staticmethod
    def covers(terms: str, command: str) -> bool:
        return UnreadableMarks.leading_words(terms) in UnreadableMarks.covering_words(command)
