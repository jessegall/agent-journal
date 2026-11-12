class UnreadableMark:
    words: str


class Repository:
    def save(self, row: object, context: object) -> object:
        return row

    def delete(self, row: object, context: object) -> None:
        return None


class MarkRule:
    name = "samples.mark"

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def answer(self, hook):
        # @sin architecture_processes_unreadable_mark_outside_unreadable_marks
        return self.repository.save(UnreadableMark(), hook.context)
