from journal.config import Config
from journal.features.seed import Seed
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.reader_commands import ReaderCommands
from journal.features.shell.support.readers import Readers

SHIPPED = (
    Reader("pytest", "the failures, the errors and the summary of a pytest run", r"FAILED|ERROR|^E  |[0-9]+ (passed|failed)", r"\[ *([0-9]+)%\]", "Tests", ReaderCommands(("pytest",)), r"[.FEsxX]"),
    Reader("dotnet-test", "the failed tests and the totals of a dotnet test run", r"Failed |error |Passed!|Failed!|Total tests", "", "Tests", ReaderCommands(("dotnet test",))),
    Reader("phpunit", "the failures and the totals of a phpunit or pest run", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)", "Tests", ReaderCommands(("phpunit", "pest", "artisan test")), r"[.FEWRSI]"),
)


class DefaultReaders(Seed):
    """The readers the journal ships, for pytest, dotnet test and phpunit or pest, written into the project's readers at boot when a reader of that name is not there yet, as working examples a test run is told of."""

    def __init__(self, config: Config, readers: Readers) -> None:
        self.config, self.readers = config, readers

    def run(self) -> None:
        for reader in SHIPPED:
            if not any((self.config.readers / f"{reader.name}{suffix}").is_file() for suffix in (".pattern", ".sh")):
                self.readers.add(reader)
