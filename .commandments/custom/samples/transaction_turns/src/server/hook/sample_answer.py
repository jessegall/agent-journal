class SampleAnswer:
    """A sample hook answer that takes its place in the lane and writes."""

    def __init__(self, tickets, database) -> None:
        self.tickets, self.database = tickets, database

    def held_answer(self) -> None:
        with self.database.transaction():
            # @sin architecture_server_transaction_before_admitted
            with self.tickets.admitted("PostToolUse"):
                return None

    def answer(self) -> None:
        # @righteous architecture_server_transaction_before_admitted
        with self.tickets.admitted("PostToolUse"):
            with self.database.transaction():
                return None
