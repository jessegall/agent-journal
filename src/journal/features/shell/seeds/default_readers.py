from journal.config import Config
from journal.features.seed import Seed
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.reader_commands import ReaderCommands
from journal.features.shell.support.readers import Readers

SHIPPED = (
    Reader("pytest", "the failures, the errors and the summary of a pytest run", r"[0-9]+ (passed|failed|errors?)\b", r"\[ *([0-9]+)%\]", "Running tests", ReaderCommands(("pytest",)), r"[.FEsxX]"),
    Reader("dotnet-test", "the failed tests and the totals of a dotnet test run", r"Failed |error |Passed!|Failed!|Total tests", "", "Running tests", ReaderCommands(("dotnet test",))),
    Reader("phpunit", "the failures and the totals of a phpunit or pest run", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)", "Running tests", ReaderCommands(("phpunit", "pest", "artisan test")), r"[.FEWRSI]"),
)


RETIRED_LABELS = ("Tests", "Running the tests")


class DefaultReaders(Seed):
    """The readers the journal ships, for pytest, dotnet test and phpunit or pest, written into the project's readers at boot when a reader of that name is not there yet, or is still one shipped before, known by its older label, as working examples a test run is told of."""

    def __init__(self, config: Config, readers: Readers) -> None:
        self.config, self.readers = config, readers

    def run(self) -> None:
        for reader in SHIPPED:
            if not any((self.config.readers / f"{reader.name}{suffix}").is_file() for suffix in (".pattern", ".sh")) or self.is_retired(reader.name):
                self.readers.add(reader)

    def is_retired(self, name: str) -> bool:
        path = self.config.readers / f"{name}.pattern"
        return path.is_file() and self.readers.lookup(name).label in RETIRED_LABELS
