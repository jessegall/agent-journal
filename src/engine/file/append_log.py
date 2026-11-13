from pathlib import Path

from engine.file.file_access import FileAccess


class AppendLog:
    """A file that many writers append lines to and one reader takes them from. The reader moves the file aside
    and reads the moved file only on its next round, so a line appended through a handle opened just before
    the move has landed by then; a round removes the moved file and writes back only the lines it did not
    finish."""

    def __init__(self, path: Path, taken_path: Path, files: FileAccess) -> None:
        self.path, self.taken_path, self.files = path, taken_path, files

    def append(self, line: str) -> None:
        with self.files.writer(self.path, "a") as log:
            log.write(line + "\n")

    def taken_lines(self) -> tuple[str, ...]:
        if not self.taken_path.exists():
            return ()
        return tuple(line for line in self.files.read(self.taken_path).splitlines() if line)

    def replace_taken(self, lines: tuple[str, ...]) -> None:
        self.files.write(self.taken_path, "".join(line + "\n" for line in lines))

    def move_aside(self, unfinished: tuple[str, ...] = ()) -> None:
        self.taken_path.unlink(missing_ok=True)
        if self.path.exists():
            self.files.replace(self.path, self.taken_path)
        if unfinished:
            with self.files.writer(self.taken_path, "a") as taken:
                taken.write("".join(line + "\n" for line in unfinished))
