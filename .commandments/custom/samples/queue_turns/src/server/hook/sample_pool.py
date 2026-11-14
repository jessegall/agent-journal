from server.execution.execution_queue import ExecutionQueue


class SamplePool:
    """A sample pool that takes a place in the lane itself."""

    def __init__(self, queue: ExecutionQueue) -> None:
        self.queue = queue

    def used(self, line: str) -> None:
        # @sin architecture_server_queue_turn_outside_execution
        return self.queue.admitted(line)
