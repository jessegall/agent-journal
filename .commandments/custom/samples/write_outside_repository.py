# @sin WriteOutsideRepositoryDetector
from journal.db.connection import Connection
# @righteous WriteOutsideRepositoryDetector
from journal.repositories.tasks import Tasks


class TaskCloser:
    def __init__(self, connection: Connection, tasks: Tasks) -> None:
        self.connection, self.tasks = connection, tasks

    def close(self, number: int) -> None:
        # @sin QueryOutsideRepositoryDetector
        with self.connection.transaction():
            # @sin QueryOutsideRepositoryDetector
            self.connection.execute("UPDATE tasks SET state = 'done' WHERE id = ?", (number,))

    def finish(self, number: int, actor) -> None:
        # @righteous QueryOutsideRepositoryDetector
        self.tasks.save(self.tasks.find(number).finished(0.0, "by hand"), actor)
