from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.readers import Readers

LONG_RUNS = ("testing", "building")


class WatchSuggestions:
    """What a command moved to the background is told it may do: watching it live so the user sees it move, through the reader whose commands it runs; a test run or a build no reader reads is told to make a reader first."""

    def __init__(self, readers: Readers) -> None:
        self.readers = readers

    def lines(self, number: int, part: str) -> list[str]:
        from journal.features.shell.feature import Shell
        reader = self.readers.reading(part)
        if reader is not None:
            return [Shell.WATCH_SUGGESTION.create(n=number, reader=f" --reader {reader.name}").rendered()]
        watch = Shell.WATCH_SUGGESTION.create(n=number, reader="").rendered()
        if ActivityLabel.build(part) not in LONG_RUNS:
            return [watch]
        return [watch, Shell.NEW_READER_SUGGESTION.create(command=" ".join(part.split()[:2])).rendered()]
