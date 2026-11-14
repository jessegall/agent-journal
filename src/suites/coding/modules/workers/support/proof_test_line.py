import shlex

from suites.coding.modules.workers.support.worker_test_arguments import WorkerTestArguments
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames


class ProofTestLine:
    """Turns a proof's test, given as one of the worker's test names and its test files, into the line that runs."""

    def __init__(self, names: WorkerTestNames) -> None:
        self.names = names

    def resolved(self, line: str, worker_id: int) -> str:
        if not line:
            return line
        name, *test_arguments = shlex.split(line)
        resolved = self.names.line(worker_id, name, test_arguments)
        WorkerTestArguments.check(test_arguments, shlex.split(resolved))
        return resolved
