from commands.dispatch import shaped
from controllers.types import Todos
from features import load
from features.format import VIEWER
from resources.base import USER
from tests.conftest import fresh


def test_a_row_named_in_text_is_a_chip_in_the_viewer_and_plain_words_everywhere_else():
    load()
    record = fresh()
    todos = Todos(record, actor=USER)
    row = todos.create("see to-do 648", brief="answered message 1712, not `todo 5`")
    viewer = shaped(todos.load(row.n), record, VIEWER)
    assert (viewer["title"], viewer["brief"]) == ("see to-do 648", "answered [[chip message:1712|message 1712]], not `todo 5`"), \
        "the viewer gets each row named in a brief marked as a chip, code left alone; a title stays plain words"
    assert shaped(todos.load(row.n), record)["brief"] == "answered message 1712, not `todo 5`", "the command line gets the plain words"
    todos.update(row.n, brief=viewer["brief"])
    assert todos.load(row.n).brief == "answered message 1712, not `todo 5`", "a marker sent back by the viewer is saved as plain words"
    listed = todos.create("reviews", brief="messages 3485, 3494 and 3508")
    assert shaped(todos.load(listed.n), record, VIEWER)["brief"] == "[[chips message:3485,3494,3508|messages 3485, 3494, 3508]]", \
        "several numbers after one type name are one chip naming each row"


def test_files_commits_and_links_are_marked_by_the_server_and_code_is_left_alone():
    load()
    record = fresh()
    row = Todos(record, actor=USER).create("paths", brief="See engine/hooks.py, commit 4b64ddbb7 and https://example.com/a. `engine/x.py` stays")
    viewed = shaped(row, record, VIEWER)["brief"]
    assert "[[file engine/hooks.py|engine/hooks.py]]" in viewed and "[[commit 4b64ddbb7|4b64ddb]]" in viewed, "a path and a commit get their markers"
    assert "[[url https://example.com/a|https://example.com/a]]" in viewed, "a link gets its marker"
    assert "`engine/x.py`" in viewed, "a path in code is left as code"
    assert shaped(row, record)["brief"] == row.brief, "outside the viewer the text stays plain"


def test_a_file_chip_into_another_project_opens_the_file_and_names_that_project():
    from commands.http import dispatch
    record = fresh()
    other = record.root.parent.parent / "other-project"
    (other / ".git").mkdir(parents=True)
    (other / "composer.json").write_text("{}\n")
    (other / ".env").write_text("SECRET=1\n")
    got = dispatch("GET", f"/api/{record.env}/file", record.root, {"path": str(other / "composer.json")}, {})
    hidden = dispatch("GET", f"/api/{record.env}/file", record.root, {"path": str(other / ".env")}, {})
    body = got.body
    assert (got.code, body.get("project"), body.get("path"), body.get("text")) == (200, "other-project", "composer.json", "{}\n"), body
    assert hidden.code == 404, "a hidden file in another project stays closed"


def test_a_file_name_is_a_chip_when_one_project_file_has_it_and_the_agent_hears_of_a_shared_one():
    from controllers.types import Agents, Nudges
    from engine import chat
    from resources.base import SYSTEM
    from tests.kit import report
    load()
    record = fresh()
    project = record.root.parent
    for path in ("web/Turn.vue", "a/test.py", "b/test.py"):
        (project / path).parent.mkdir(parents=True, exist_ok=True)
        (project / path).write_text("x")
    row = Todos(record, actor=USER).create("files", brief="Turn.vue, test.py, `web/Turn.vue` and `web/Gone.vue`")
    viewed = shaped(row, record, VIEWER)["brief"]
    assert viewed.count("[[file web/Turn.vue|") == 2, f"a unique name and an existing path in code both open the file: {viewed}"
    assert "/test.py|" not in viewed and "`web/Gone.vue`" in viewed, f"a shared name and a missing path stay text: {viewed}"
    report(record, "working", "PostToolUse")
    chat.send(record, Agents(record, actor=SYSTEM).by_session("claude-1"), "the fix is in test.py")
    told = [n.title for n in Nudges(record).all() if "test.py" in n.title]
    assert told == ["test.py names 2 files in the project"], f"the agent is told to write the path: {told}"
