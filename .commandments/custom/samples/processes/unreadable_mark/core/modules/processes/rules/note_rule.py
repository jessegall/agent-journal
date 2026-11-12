class UnreadableMark:
    words: str


class Repository:
    def save(self, row: object, context: object) -> object:
        return row

    def delete(self, row: object, context: object) -> None:
        return None


class Note:
    text: str


class NoteRule:
    name = "samples.note"

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def answer(self, hook):
        # @righteous architecture_processes_unreadable_mark_outside_unreadable_marks
        return self.repository.save(Note(), hook.context)
