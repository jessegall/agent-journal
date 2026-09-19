import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from commands.http import dispatch  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh("main")
project = record.root.parent
for rel, text in (("web/src/text/files.js", "one"), ("engine/files.py", "two"), ("tools/a/notes.md", "a"), ("docs/b/notes.md", "b")):
    (project / rel).parent.mkdir(parents=True, exist_ok=True)
    (project / rel).write_text(text)


def ask(path):
    return dispatch("GET", "/api/main/file", record.root, {"path": path}, {})


check("a full path opens as before", ask("engine/files.py").body["text"], "two")
check("a bare name found once in the project opens that file", (ask("files.js").body["path"], ask("files.js").body["text"]), ("web/src/text/files.js", "one"))
check("a partial path finds the file it ends", ask("text/files.js").body["path"], "web/src/text/files.js")
check("a name shared by several files lists them to choose from", ask("notes.md").body, {"matches": ["docs/b/notes.md", "tools/a/notes.md"]})
check("a name nowhere in the project is not found", ask("missing.js").code, 404)
check("a name that only ends another name does not match it", ask("s.js").code, 404)
check("nothing outside the project is reachable by a bare name", ask("../../etc/passwd").code, 404)

done()
