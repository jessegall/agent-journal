import subprocess

from journal.features.shell.support.cap import Cap
from journal.features.shell.support.output_files import OutputFiles

PART_CHARACTERS = 60


class OutputShow:
    """What the agent sees of a part's output in the foreground, as the cap says: whole for a line of journal commands or an output under the cap; a cut part's cut applied and shown, the whole kept and named by the same one line; half the characters from each end for a read past the cap, with a line naming the lines shown and the lines cut; and for any other output past the cap one line naming the output to read by its number, with its lines, its characters and the part it came from, and a shorter line for each later part the output also holds."""

    def __init__(self, folder: OutputFiles, cap: Cap) -> None:
        self.folder, self.cap = folder, cap
        self.named = False

    def of(self, i: int) -> str:
        return "".join(self.shown(i, name) for name in ("out", "err"))

    def shown(self, i: int, name: str) -> str:
        path = self.folder.folder / f"{i}.{name}"
        if not path.is_file():
            return ""
        text = path.read_text(errors="replace")
        cut = self.folder.cut_of(i)
        if cut and name == "out":
            shortened = subprocess.run(["sh", "-c", cut], input=text, capture_output=True, text=True).stdout
            shown = shortened if len(shortened) <= self.cap.characters else shortened[-self.cap.characters:]
            return f"{shown.rstrip(chr(10))}\n{self.kept_line(i, text)}"
        if self.cap.is_whole() or len(text) <= self.cap.characters:
            return text
        if self.cap.is_ends():
            return self.ends(text)
        return self.kept_line(i, text)

    def kept_line(self, i: int, text: str) -> str:
        if self.named:
            return f"[journal] output {self.folder.number()} also holds {self.part_label(i)} ({self.counts(text)})\n"
        self.named = True
        label = self.part_label(i)
        return f"[journal] output {self.folder.number()} kept, {self.counts(text)}{', ' + label if label else ''}\n"

    def ends(self, text: str) -> str:
        half = self.cap.characters // 2
        head, tail = text[:half], text[-half:]
        lines, head_lines, tail_lines = self.line_count(text), head.count("\n"), tail.count("\n")
        number = self.folder.number()
        cut = f"{head_lines + 1}-{lines - tail_lines}"
        return f"{head}\n[journal] output {number}: {lines} lines, {len(text)} characters; lines 1-{head_lines} and {lines - tail_lines + 1}-{lines} shown, {cut} cut from the middle. journal output read {number} --lines {cut} or --grep reads them\n{tail}"

    def part_label(self, i: int) -> str:
        if len(self.folder.kinds()) == 1:
            return ""
        first = self.folder.part_text(i).strip().splitlines()[0] if self.folder.part_text(i).strip() else ""
        shortened = first if len(first) <= PART_CHARACTERS else first[:PART_CHARACTERS] + "\u2026"
        return f"part {i + 1} of the line: {shortened}"

    def counts(self, text: str) -> str:
        return f"{self.line_count(text)} lines, {len(text)} characters"

    @staticmethod
    def line_count(text: str) -> int:
        return text.count("\n") + (1 if text and not text.endswith("\n") else 0)
