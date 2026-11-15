import shlex
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import PurePosixPath

FULL_SUITE = "tests"
PYTEST = "pytest"
SHELL_OPERATORS = frozenset({"|", ";", "&", "&&", "||"})
# the options of pytest and its runner plugins whose value is the next word when it is not joined with =
VALUE_OPTIONS = frozenset({"-n", "-k", "-m", "-p", "-c", "-o", "-W", "-r", "--tb", "--maxfail", "--deselect", "--durations", "--rootdir", "--basetemp",
                           "--junitxml", "--ignore", "--ignore-glob", "--dist", "--timeout", "--numprocesses", "--confcutdir", "--log-level", "--import-mode",
                           "--color", "--capture", "--override-ini"})
# the options that leave out part of the suite
NARROWING_OPTIONS = frozenset({"-k", "-m", "--deselect", "--ignore", "--ignore-glob", "--lf", "--last-failed", "--sw", "--stepwise"})


@dataclass(frozen=True)
class PytestLine:
    """A shell line that runs pytest, read for what it runs: the targets it names after pytest, and whether an
    option leaves part of the suite out. A run of the whole suite names no target but the tests folder."""

    line: str

    @staticmethod
    def is_full_suite(targets: Sequence[str]) -> bool:
        return all(target.rstrip("/") == FULL_SUITE for target in targets)

    def is_full_run(self) -> bool:
        terms = self.terms()
        start = next((index + 1 for index, term in enumerate(terms) if PurePosixPath(term).name == PYTEST), None)
        if start is None:
            return False
        targets: list[str] = []
        arguments = iter(terms[start:])
        for argument in arguments:
            if argument in SHELL_OPERATORS:
                break
            name = argument.split("=")[0]
            if name in NARROWING_OPTIONS:
                return False
            if argument in VALUE_OPTIONS:
                next(arguments, "")
            elif not argument.startswith("-"):
                targets.append(argument)
        return self.is_full_suite(targets)

    # a line the shell could not split names nothing pytest would run
    def terms(self) -> list[str]:
        try:
            return shlex.split(self.line)
        except ValueError:
            return []
