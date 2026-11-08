class RunCpu:
    """The processor seconds the tests of one test runner used, setup and teardown included."""

    def __init__(self) -> None:
        self.seconds = 0.0

    def add(self, seconds: float) -> None:
        self.seconds += seconds
