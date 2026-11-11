from dataclasses import dataclass

TEST_NAME_SEPARATOR = "::"


@dataclass(frozen=True)
class RunTarget:
    """What a test run is given to run, as test tools write it: a file or a folder, or one test, which is its
    file and then two colons before each name inside the file."""

    name: str

    @property
    def file(self) -> str:
        return self.name.split(TEST_NAME_SEPARATOR)[0]

    @property
    def is_single_test(self) -> bool:
        return TEST_NAME_SEPARATOR in self.name
