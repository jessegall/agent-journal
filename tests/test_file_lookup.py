from commands.http import dispatch
from tests.conftest import fresh


def test_a_bare_or_partial_name_finds_the_file_it_ends_inside_the_project():
    record = fresh("main")
    project = record.root.parent
    for rel, text in (("web/src/text/files.js", "one"), ("engine/files.py", "two"), ("tools/a/notes.md", "a"), ("docs/b/notes.md", "b")):
        (project / rel).parent.mkdir(parents=True, exist_ok=True)
        (project / rel).write_text(text)

    def ask(path):
        return dispatch("GET", "/api/main/file", record.root, {"path": path}, {})

    assert ask("engine/files.py").body["text"] == "two", "a full path opens as before"
    assert (ask("files.js").body["path"], ask("files.js").body["text"]) == ("web/src/text/files.js", "one"), \
        "a bare name found once in the project opens that file"
    assert ask("text/files.js").body["path"] == "web/src/text/files.js", "a partial path finds the file it ends"
    assert ask("notes.md").body == {"matches": ["docs/b/notes.md", "tools/a/notes.md"]}, \
        "a name shared by several files lists them to choose from"
    assert ask("missing.js").code == 404, "a name nowhere in the project is not found"
    assert ask("s.js").code == 404, "a name that only ends another name does not match it"
    assert ask("../../etc/passwd").code == 404, "nothing outside the project is reachable by a bare name"
