from dataclasses import dataclass
from pathlib import Path

from controllers.base import Controller
from resources import types
from resources.base import SECTION, Refused
from controllers.marks import action


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

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        buttons = data.get("buttons") or []
        pending = any(button.get("choice") for button in buttons)
        data.setdefault("status", "draft" if pending else "final")
        return super().create(title, abstract, brief, **data)

    @action
    def hide(self, n: int):
        return self.update(int(n), hidden=True)

    @action
    def unhide(self, n: int):
        return self.update(int(n), hidden=False)

    def _visible(self, row) -> bool:
        return not row.hidden

    @action
    def search(self, term: str, archived: bool = False):
        return [r for r in super().search(term, archived) if not r.hidden]

    @action
    def file(self, title: str, path: str):
        source = Path(path).expanduser()
        if not source.is_file():
            raise Refused(f"no such file: {path}; write the finished text to a file, then journal doc file \"{title}\" <file>")
        written = Written.read(source.read_text(errors="replace"))
        return self._created_with_sections(title, "", written.brief, list(written.chapters), written=True)

    @action
    def cut(self, n: int, title: str):
        with self.record.locked(self.resource.scope):
            doc = self.load(n)
            if not any(s[SECTION.title] == title for s in doc.sections):
                raise Refused(f"doc {doc.n} has no part named {title!r}")
            doc.sections = [s for s in doc.sections if s[SECTION.title] != title]
            return self.save(doc, "updated", section=title)

    @action
    def draft(self, n: int):
        return self.update(n, status="writing")

    @action
    def complete(self, n: int, how: str = "", **data):
        self.update(n, status="final")
        return super().complete(n, how or "final", **data)

    @action
    def supersede(self, n: int, by: int):
        newer = self._supersede(n, self.load(by).n)
        self.link(n, newer.ref)
        return newer
