from dataclasses import dataclass

from engine.enums.command_category import CommandCategory


@dataclass(frozen=True)
class ReaderCandidates:
    """Patterns to try in order on the output of one command type."""

    title: str
    lines: tuple[str, ...]
    progress: tuple[str, ...]
    summary: tuple[str, ...]
    count: tuple[str, ...]


TEST_CANDIDATES = ReaderCandidates("Tests", (
    r"(?i)failed|error|passed|tests?:|tests? +[0-9]",
),
                                   (r"\[ *([0-9]+)%\]", r"([0-9]+)/([0-9]+)"),
                                   (r"([0-9]+ passed)", r"(?i)(tests?:[^\n]+)", r"(?i)([0-9]+ tests?[^\n]*)"),
                                   (r"collected ([0-9]+)", r"(?i)total tests?: *([0-9]+)", r"(?i)tests?: *([0-9]+)", r"([0-9]+) tests?"))
BUILD_CANDIDATES = ReaderCandidates("Building project", (
    r"(?i)error|failed|built|success|done|finished",
),
                                    (r"\[ *([0-9]+)%\]", r"([0-9]+)/([0-9]+)"),
                                    (
    r"(?i)(built[^\n]*|success[^\n]*|done[^\n]*|finished[^\n]*)",
), ())
CANDIDATES = {CommandCategory.TEST_RUN: TEST_CANDIDATES, CommandCategory.BUILD: BUILD_CANDIDATES,
              CommandCategory.CHECK: ReaderCandidates("Checking project", BUILD_CANDIDATES.lines, (), BUILD_CANDIDATES.summary, ())}
