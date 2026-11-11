from dataclasses import dataclass

FAILED_MARK = "FAILED "
TEST_NAME_SEPARATOR = "::"


@dataclass(frozen=True)
class FailedTestPaths:
    """The test files a run names as failed: the path on each line of its output that starts with FAILED, as
    pytest prints one for each failed test. An output with no such line names no path."""

    paths: tuple[str, ...]

    @classmethod
    def read(cls, output: str) -> "FailedTestPaths":
        failed_lines = [line[len(FAILED_MARK):] for line in output.splitlines() if line.startswith(FAILED_MARK)]
        return cls(tuple(dict.fromkeys(line.split()[0].split(TEST_NAME_SEPARATOR)[0] for line in failed_lines if line.strip())))
