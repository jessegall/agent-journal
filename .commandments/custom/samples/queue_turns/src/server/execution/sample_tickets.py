from server.execution.execution_queue import ExecutionQueue


class SampleTickets:
    """A sample ticket class that takes its place in the lane where the tickets are decided."""

    def __init__(self, queue: ExecutionQueue) -> None:
        self.queue = queue

    def admitted(self, line: str) -> None:
        # @righteous architecture_server_queue_turn_outside_execution
        return self.queue.admitted(line)
