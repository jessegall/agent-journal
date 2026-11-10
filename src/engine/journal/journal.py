import sys

TEST_RUNNER = "pytest"


class Journal:
    """The global facade any code can ask about the process it runs in."""

    @staticmethod
    def is_running_unit_tests() -> bool:
        return TEST_RUNNER in sys.modules
