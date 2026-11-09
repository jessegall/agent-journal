from collections.abc import Sequence
from pathlib import PurePosixPath

from engine.errors.refusal import Refusal

TEST_FILE_ENDINGS = (".py", ".js", ".mjs", ".ts", ".go")
SHELL_OPERATORS = {"|", ";", "&", "&&", "||", ">", ">>", "<"}
SHELL_MARKS = ("`", "$(")
ROOT_OPTIONS = ("-C", "--rootdir", "--prefix", "--cwd", "--config")
PARENT_FOLDER = ".."
FULL_SUITE_REFUSAL = "name each test file the run covers, never the whole suite"


class WorkerTestArguments:
    """Checks the arguments after a worker's test command name: they name test files and change neither the program
    nor the folder it runs in."""

    @classmethod
    def check(cls, test_arguments: Sequence[str]) -> None:
        for argument in test_arguments:
            if cls.is_forbidden(argument):
                raise Refusal(f"{argument} cannot change the program or leave the worktree", "give only test files and plain options")
        if cls.is_full_suite(test_arguments):
            raise Refusal(FULL_SUITE_REFUSAL, "journal worker test <name> <test files>")

    @classmethod
    def is_full_suite(cls, test_arguments: Sequence[str]) -> bool:
        return not any(cls.is_test_file(argument) for argument in test_arguments)

    @classmethod
    def is_forbidden(cls, argument: str) -> bool:
        return (argument in SHELL_OPERATORS or any(mark in argument for mark in SHELL_MARKS) or argument.startswith("/")
                or PARENT_FOLDER in PurePosixPath(argument).parts or argument.split("=")[0] in ROOT_OPTIONS)

    @staticmethod
    def is_test_file(argument: str) -> bool:
        return not argument.startswith("-") and ("::" in argument or argument.endswith(TEST_FILE_ENDINGS))
