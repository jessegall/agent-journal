import re
from pathlib import Path

from engine.markers import marked
from engine.project_files import matching
from features.format import VIEWER
from features.parts import Context, TextFormatter
from features.row_links.formatters import CODE, KEPT, outside

EXT = ("py|js|mjs|cjs|ts|tsx|jsx|vue|md|json|css|scss|html|txt|log|yml|yaml|toml|ini|sh|zsh|bash|svg|png|jpg|jpeg|gif|webp|csv|lock|php|cs|"
       "java|go|rs|rb|sql|xml|env|gitignore|prettierrc")
PATH = re.compile(rf"(^|[\s(])((?:/(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))|(?:\.{{1,2}}/)?(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))(:\d+(?:-\d+)?)?(?=[\s).,;:]|$)")
SHA = re.compile(r"(^|[\s(])([0-9a-f]{7,40})(?=[\s).,;:]|$)")
URL = re.compile(r"\bhttps?://[^\s<>\"'|\]*`]+[^\s<>\"'.,;:)|\]*`]")
DOTFILE = re.compile(r"^\.(gitignore|env|prettierrc)$")


def a_file(path: str) -> bool:
    name = path.split("/")[-1]
    return not re.match(r"^https?:|^\d", path) and not path.startswith("//") and bool(re.search(r"[\w-]\.\w+$", name) or DOTFILE.match(name))


def a_commit(sha: str) -> bool:
    return bool(re.search(r"\d", sha) and re.search(r"[a-f]", sha))


def resolved(project: Path, path: str) -> str:
    if "/" not in path:
        found = matching(project, path)
        return found[0] if len(found) == 1 else ""
    return path


def existing(project: Path, path: str) -> str:
    if "/" not in path:
        return resolved(project, path)
    return path if (project / path).is_file() or Path(path).is_file() else ""


def labels(paths: list[str]) -> dict[str, str]:
    unique = list(dict.fromkeys(paths))
    tail = lambda path, k: "/".join(path.strip("/").split("/")[-k:])
    out = {}
    for path in unique:
        k = next((k for k in range(1, path.count("/") + 2) if not any(tail(other, k) == tail(path, k) for other in unique if other != path)),
                 path.count("/") + 1)
        out[path] = tail(path, k)
    return out


def chip(value: str, line: str, names: dict[str, str]) -> str:
    number = line.lstrip(":").split("-")[0]
    return marked("file", f"{value}#L{number}" if number else value, f"{names.get(value, value)}{line}")


def code_path(span: str, project: Path):
    m = PATH.fullmatch(span.strip("`").strip())
    return m, existing(project, m.group(2)) if m and a_file(m.group(2)) else ""


def found(part: str, project: Path) -> list[str]:
    if CODE.fullmatch(part):
        _, value = code_path(part, project)
        return [value] if value else []
    return [value for m in PATH.finditer(part) if a_file(m.group(2)) and (value := resolved(project, m.group(2)))]


def filed(m, project: Path, names: dict[str, str]) -> str:
    value = resolved(project, m.group(2)) if a_file(m.group(2)) else ""
    return m.group(1) + chip(value, m.expand(r"\3"), names) if value else m.group(0)


def linked(text: str, project: Path, names: dict[str, str]) -> str:
    text = PATH.sub(lambda m: filed(m, project, names), text)
    return SHA.sub(lambda m: m.group(1) + marked("commit", m.group(2), m.group(2)[:7]) if a_commit(m.group(2)) else m.group(0), text)


def coded(span: str, project: Path, names: dict[str, str]) -> str:
    m, value = code_path(span, project)
    return chip(value, m.expand(r"\3"), names) if value else span


class MarkPaths(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        project = context.record.root.parent
        parts = re.split(r"(`[^`]*`)", text)
        names = labels([value for part in parts for value in found(part, project)])
        return "".join(coded(part, project, names) if CODE.fullmatch(part) else
                       outside(KEPT, URL.sub(lambda m: marked("url", m.group(0), m.group(0)), part), lambda rest: linked(rest, project, names))
                       for part in parts)
