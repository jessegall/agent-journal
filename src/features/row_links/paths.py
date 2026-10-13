import re

from resources.markers import marked
from events.answers import Allowed, Answer, Rewritten
from events.asking import TextFormatting
from framework.format import VIEWER
from receiving import Answerer
from serving import ReadFiles
from features.row_links.formatters import CODE, KEPT, outside

EXT = ("py|js|mjs|cjs|ts|tsx|jsx|vue|md|json|css|scss|html|txt|log|yml|yaml|toml|ini|sh|zsh|bash|svg|png|jpg|jpeg|gif|webp|csv|lock|php|cs|"
       "java|go|rs|rb|sql|xml|env|gitignore|prettierrc")
PATH = re.compile(rf"(^|[\s(])((?:/(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))|(?:\.{{1,2}}/)?(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))(:\d+(?:-\d+)?)?(?=[\s).,;:]|$)")
SHA = re.compile(r"(^|[\s(])([0-9a-f]{7,40})(?=[\s).,;:]|$)")
URL = re.compile(r"\bhttps?://[^\s<>\"'|\]*`]+[^\s<>\"'.,;:)|\]*`]")
LOOKS_LINKED = re.compile(r"https?://|\.\w|[0-9a-f]{7}")
DOTFILE = re.compile(r"^\.(gitignore|env|prettierrc)$")


def a_file(path: str) -> bool:
    name = path.split("/")[-1]
    return not re.match(r"^https?:|^\d", path) and not path.startswith("//") and bool(re.search(r"[\w-]\.\w+$", name) or DOTFILE.match(name))


def a_commit(sha: str) -> bool:
    return bool(re.search(r"\d", sha) and re.search(r"[a-f]", sha))


def resolved(files: ReadFiles, path: str) -> str:
    if "/" not in path:
        found = files.matching(path)
        return found[0] if len(found) == 1 else ""
    return path


def existing(files: ReadFiles, path: str) -> str:
    if "/" not in path:
        return resolved(files, path)
    return path if files.is_file(path) else ""


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


def code_path(span: str, files: ReadFiles):
    m = PATH.fullmatch(span.strip("`").strip())
    return m, existing(files, m.group(2)) if m and a_file(m.group(2)) else ""


def found(part: str, files: ReadFiles) -> list[str]:
    if CODE.fullmatch(part):
        _, value = code_path(part, files)
        return [value] if value else []
    return [value for m in PATH.finditer(part) if a_file(m.group(2)) and (value := resolved(files, m.group(2)))]


def filed(m, files: ReadFiles, names: dict[str, str]) -> str:
    value = resolved(files, m.group(2)) if a_file(m.group(2)) else ""
    return m.group(1) + chip(value, m.expand(r"\3"), names) if value else m.group(0)


def linked(text: str, files: ReadFiles, names: dict[str, str]) -> str:
    text = PATH.sub(lambda m: filed(m, files, names), text)
    return SHA.sub(lambda m: m.group(1) + marked("commit", m.group(2), m.group(2)[:7]) if a_commit(m.group(2)) else m.group(0), text)


def coded(span: str, files: ReadFiles, names: dict[str, str]) -> str:
    m, value = code_path(span, files)
    return chip(value, m.expand(r"\3"), names) if value else span


class MarkPaths(Answerer[TextFormatting]):
    surfaces = (VIEWER,)

    def answer(self, request: TextFormatting, files: ReadFiles) -> Answer:
        text = request.text
        if request.surface not in self.surfaces or not LOOKS_LINKED.search(text):
            return Allowed()
        parts = re.split(r"(`[^`]*`)", text)
        names = labels([value for part in parts for value in found(part, files)])
        return Rewritten("".join(coded(part, files, names) if CODE.fullmatch(part) else
                                 outside(KEPT, URL.sub(lambda m: marked("url", m.group(0), m.group(0)), part), lambda rest: linked(rest, files, names))
                                 for part in parts))
