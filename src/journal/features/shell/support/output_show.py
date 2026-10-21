import subprocess

from journal.features.shell.support.cap import Cap
from journal.features.shell.support.output_files import OutputFiles


class OutputShow:
    """What the agent sees of a part's output in the foreground, as the cap says: whole for a line of journal commands or an output under the cap; a cut part's cut applied, the whole kept; half the characters from each end for a read past the cap, with a line naming the middle; and for any other output past the cap one line, once per chain, naming the output to read by its number."""

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
            if len(shortened) <= self.cap.characters:
                return f"{shortened.rstrip(chr(10))}\n[journal] the whole output is kept as output {self.folder.number()}\n"
        if self.cap.is_whole() or len(text) <= self.cap.characters:
            return text
        if self.cap.is_ends():
            half = self.cap.characters // 2
            return f"{text[:half]}\n[journal] output {self.folder.number()}: {len(text)} characters, {len(text) - self.cap.characters} cut from the middle. journal output read {self.folder.number()} --lines or --grep reads them\n{text[-half:]}"
        if self.named:
            return ""
        self.named = True
        return f"[journal] output {self.folder.number()} kept, {len(text)} characters\n"
