from dataclasses import dataclass
from pathlib import Path

from controllers.base import Controller
from resources import types
from resources.base import Refused


@dataclass(frozen=True)
class Written:
    brief: str
    chapters: tuple[tuple[str, str], ...]

    @classmethod
    def read(cls, text: str) -> "Written":
        lines = text.strip().splitlines()
        if lines and lines[0].startswith("# "):
            lines = lines[1:]
        mark = "## " if any(line.startswith("## ") for line in lines) else "# "
        heads = [i for i, line in enumerate(lines) if line.startswith(mark)]
        brief = "\n".join(lines[:heads[0] if heads else len(lines)]).strip()
        return cls(brief, tuple((lines[i][len(mark):].strip(), "\n".join(lines[i + 1:end]).strip()) for i, end in zip(heads, [*heads[1:], len(lines)])))


class Docs(Controller):
    resource = types.Doc

    def hide(self, n: int):
        return self.update(int(n), hidden=True)

    def unhide(self, n: int):
        return self.update(int(n), hidden=False)

    def _standing(self):
        return [r for r in super()._standing() if not r.data.get("hidden")]

    def search(self, term: str):
        return [r for r in super().search(term) if not r.data.get("hidden")]

    def file(self, title: str, path: str):
        source = Path(path).expanduser()
        if not source.is_file():
            raise Refused(f"no such file: {path}; write the finished text to a file, then journal doc file \"{title}\" <file>")
        written = Written.read(source.read_text(errors="replace"))
        doc = self.create(title, brief=written.brief, written=True)
        for chapter, body in written.chapters:
            self.section(doc.n, chapter, body)
        return self.load(doc.n)

    def draft(self, n: int):
        return self.update(n, status="draft")

    def complete(self, n: int, how: str = "", **data):
        self.update(n, status="final")
        return super().complete(n, how or "final", **data)

    def supersede(self, n: int, by: int):
        newer = self.load(by)
        self.complete(n, how=f"superseded by doc {newer.n}")
        self.link(n, newer.ref)
        return self.link(newer.n, self.load(n).ref)
