from journal.config import Config
from journal.features.seed import Seed
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.reader_commands import ReaderCommands
from journal.features.shell.support.readers import Readers

SHIPPED = (
    Reader("pytest", "the summary of a pytest run, or the error that stopped it", r"^(=+ )?([0-9]+ (passed|failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$", r"\[ *([0-9]+)%\]", "Running tests", ReaderCommands(("pytest",)), r"[.FEsxX]", r"(\S+\.py)\b|-k\s+(\"[^\"]+\"|'[^']+'|\S+)",
           r"^(=+ )?[0-9]+ passed", r"^(=+ )?([0-9]+ (failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$"),
    Reader("dotnet-test", "the failed tests and the totals of a dotnet test run", r"Failed |error |Passed!|Failed!|Total tests", "", "Running tests", ReaderCommands(("dotnet test",)), finished_pattern=r"Passed!|Total tests", failed_pattern=r"Failed |Failed!|error "),
    Reader("phpunit", "the failures and the totals of a phpunit or pest run", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)", "Running tests", ReaderCommands(("phpunit", "pest", "artisan test")), r"[.FEWRSI]",
           finished_pattern=r"OK \(|Tests: ", failed_pattern=r"FAILURES!|ERRORS!|FAIL |Failed asserting|Tests: "),
)


RETIRED_LABELS = ("Tests", "Running the tests")


class DefaultReaders(Seed):
    """The readers the journal ships, for pytest, dotnet test and phpunit or pest, written into the project's readers at boot when a reader of that name is not there yet, or is still one shipped before, known by its older label or a part it lacks, as working examples a test run is told of."""

    def __init__(self, config: Config, readers: Readers) -> None:
        self.config, self.readers = config, readers

    def run(self) -> None:
        for reader in SHIPPED:
            if not any((self.config.readers / f"{reader.name}{suffix}").is_file() for suffix in (".pattern", ".sh")) or self.is_retired(reader):
                self.readers.add(reader)

    def is_retired(self, shipped: Reader) -> bool:
        path = self.config.readers / f"{shipped.name}.pattern"
        if not path.is_file():
            return False
        existing = self.readers.lookup(shipped.name)
        return existing.label in RETIRED_LABELS or (existing.label == shipped.label and self.has_missing_pattern(existing, shipped))

    @staticmethod
    def has_missing_pattern(existing: Reader, default: Reader) -> bool:
        return (not existing.topic_pattern and bool(default.topic_pattern)) or (not existing.finished_pattern and bool(default.finished_pattern))
