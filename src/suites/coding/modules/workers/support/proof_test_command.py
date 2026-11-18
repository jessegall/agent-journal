import re
import shlex
from collections.abc import Sequence
from dataclasses import dataclass

TEST_FILE_ENDINGS = (".php", ".py", ".js", ".ts", ".go", ".rb")
NAMESPACE_ROOT = "tests"
# a line of a test run's output that reports a failure: a FAIL or error mark, or a numbered failure as PHPUnit lists them
FAILURE_LINE = re.compile(r"fail|error|^\s*\d+\) ", re.IGNORECASE)


@dataclass(frozen=True)
class ProofTestCommand:
    """A proof's test command split into the program that runs the tests and the test files or folders named at
    its end, so the proofs of one worktree that run one program are run together over the union of their files."""

    program: tuple[str, ...]
    files: tuple[str, ...]

    @classmethod
    def parsed(cls, command: str) -> "ProofTestCommand":
        try:
            words = shlex.split(command)
        except ValueError:
            return cls(tuple(command.split()), ())
        end = len(words)
        while end > 0 and cls.is_test_file(words[end - 1]):
            end -= 1
        return cls(tuple(words[:end]), tuple(words[end:]))

    @staticmethod
    def is_test_file(word: str) -> bool:
        return not word.startswith("-") and ("/" in word or word.split("::")[0].endswith(TEST_FILE_ENDINGS))

    # the one command that runs the tests of proofs grouped together: the program over the union of their files
    @classmethod
    def combined(cls, commands: Sequence[str]) -> str:
        parsed = [cls.parsed(command) for command in commands]
        if len(commands) == 1 or not parsed[0].files:
            return commands[0]
        return shlex.join([*parsed[0].program, *dict.fromkeys(file for command in parsed for file in command.files)])

    # how a test file shows in a run's output: as its path, or as the namespace PHP test runners print
    @staticmethod
    def output_names(file: str) -> tuple[str, ...]:
        path = file.split("::")[0].removesuffix("/")
        stem = path.rsplit(".", 1)[0] if path.endswith(TEST_FILE_ENDINGS) else path
        parts = stem.split("/")
        namespace = "\\".join(part[:1].upper() + part[1:] if index == 0 and part == NAMESPACE_ROOT else part for index, part in enumerate(parts))
        return tuple(dict.fromkeys((path, stem, namespace)))

    @staticmethod
    def failure_text(output: str) -> str:
        return "\n".join(line for line in output.splitlines() if FAILURE_LINE.search(line))

    def is_named_in(self, text: str) -> bool:
        return any(name in text for file in self.files for name in self.output_names(file))
