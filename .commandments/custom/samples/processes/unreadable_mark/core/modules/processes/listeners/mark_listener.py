class UnreadableMark:
    words: str


class Repository:
    def save(self, row: object, context: object) -> object:
        return row

    def delete(self, row: object, context: object) -> None:
        return None


class MarkListener:
    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, mark: UnreadableMark, context: object) -> None:
        # @sin architecture_processes_unreadable_mark_outside_unreadable_marks
        self.repository.delete(mark, context)
