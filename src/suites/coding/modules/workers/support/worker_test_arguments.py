import re
from engine.text.run_target import RunTarget
from collections.abc import Sequence
from pathlib import PurePosixPath

from engine.errors.refusal import Refusal

FILE_EXTENSION = re.compile(r"\.[A-Za-z]\w*")
SHELL_OPERATORS = {"|", ";", "&", "&&", "||", ">", ">>", "<"}
SHELL_MARKS = ("`", "$(")
ROOT_OPTIONS = ("-C", "--rootdir", "--prefix", "--cwd", "--config")
PARENT_FOLDER = ".."
GOLANG_PACKAGE = re.compile(r"\./(?!\.\.\.$)[\w-]+(?:/[\w.-]+)*(?:/\.\.\.)?")
RUN_PATTERN_OPTION = "-run"
NAMING_PATTERN = re.compile(r"\w")
FULL_SUITE_REFUSAL = "name each test file the run covers, never the whole suite"


class WorkerTestArguments:
    """Checks the arguments after a worker's test command name: they change neither the program nor the folder it
    runs in, and the whole line they make with the command names test files of any language, Go packages or a pattern of Go
    test names, so a command that already names its packages needs no file beside them. A pattern names tests
    only when it holds a letter, digit or underscore: ., .* or ^ match every test and are the whole suite."""

    @classmethod
    def check(cls, test_arguments: Sequence[str], line_terms: Sequence[str]) -> None:
        for argument in test_arguments:
            if cls.is_forbidden(argument):
                raise Refusal(f"{argument} cannot change the program or leave the worktree", "give only test files and plain options")
        if cls.is_full_suite(line_terms):
            raise Refusal(FULL_SUITE_REFUSAL, "journal worker test <name> <test files>")

    @classmethod
    def is_full_suite(cls, test_arguments: Sequence[str]) -> bool:
        return not (any(cls.is_test_file(argument) or GOLANG_PACKAGE.fullmatch(argument) for argument in test_arguments) or cls.has_run_pattern(test_arguments))

    @classmethod
    def has_run_pattern(cls, test_arguments: Sequence[str]) -> bool:
        return any(cls.has_test_names(pattern) for pattern in cls.run_patterns(test_arguments))

    @staticmethod
    def run_patterns(test_arguments: Sequence[str]) -> list[str]:
        joined = [argument.removeprefix(f"{RUN_PATTERN_OPTION}=") for argument in test_arguments if argument.startswith(f"{RUN_PATTERN_OPTION}=")]
        following = [following for argument, following in zip(test_arguments, [*test_arguments[1:], ""]) if argument == RUN_PATTERN_OPTION and not following.startswith("-")]
        return [*joined, *following]

    @staticmethod
    def has_test_names(pattern: str) -> bool:
        return NAMING_PATTERN.search(pattern) is not None

    @classmethod
    def is_forbidden(cls, argument: str) -> bool:
        return (argument in SHELL_OPERATORS or any(mark in argument for mark in SHELL_MARKS) or argument.startswith("/")
                or PARENT_FOLDER in PurePosixPath(argument).parts or argument.split("=")[0] in ROOT_OPTIONS)

    @staticmethod
    def is_test_file(argument: str) -> bool:
        """A file of any language: a name with an extension that starts with a letter, so neither an option, a
        variable such as DB_HOST=127.0.0.1 nor a program such as python3.14 counts."""
        if argument.startswith("-") or "=" in argument:
            return False
        return RunTarget(argument).is_single_test or FILE_EXTENSION.fullmatch(PurePosixPath(argument).suffix) is not None
