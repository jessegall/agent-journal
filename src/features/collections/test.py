from controllers.types import CONTROLLERS, Docs, Messages, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_collection_holds_rows_of_any_type_and_a_row_can_sit_in_several():
    record = fresh()
    collections = CONTROLLERS["collection"](record, actor=AGENT)
    task, doc = Todos(record, actor=AGENT).create("a task"), Docs(record, actor=AGENT).create("a doc")
    note = Messages(record, actor=USER).create("a note")
    launch, later = collections.create("Launch"), collections.create("Later")
    collections.add(launch.n, [task.ref, doc.ref, note.ref])
    collections.add(later.n, [task.ref])
    assert collections.members(launch.n) == ["todo 1  a task", "doc 1  a doc", "message 1  a note"], "any type joins, in the order it was added"
    assert collections.members(later.n) == ["todo 1  a task"], "the same row sits in a second collection"

    collections.remove(launch.n, doc.ref)
    Messages(record, actor=USER).delete(note.n, why="gone")
    assert collections.members(launch.n) == ["todo 1  a task"], "a removed row and a deleted one are left out"

    assert "already open" in refused(lambda: collections.create("launch")), "an open collection's name is not taken twice"
    assert "names no item" in refused(lambda: collections.add(launch.n, ["nothing"])), "a ref that is not a row is refused"
    assert refused(lambda: collections.add(launch.n, ["todo:99"])) != "", "a row that does not exist is refused"
    collections.add(later.n, [doc.ref])
    Docs(record, actor=AGENT).force_delete(doc.n)
    assert collections.members(later.n) == ["todo 1  a task"], "a row that is gone for good is left out of its collection"


def test_a_collection_holds_a_row_of_another_environment_and_reads_it_live():
    import shutil
    from engine.record import Record
    record = fresh()
    other = Record(record.root, "ticket-1")
    other.home.mkdir(parents=True)
    plans = CONTROLLERS["plan"](other, actor=AGENT)
    plan = plans.create("Ticket plan", goal="done")
    collections = CONTROLLERS["collection"](record, actor=AGENT)
    launch = collections.create("Launch")
    collections.add(launch.n, ["ticket-1/plan:1"])
    assert collections.members(launch.n) == ["ticket-1/plan:1  Ticket plan"], "a ref that names an environment loads the row from that environment"
    plans.update(plan.n, title="Renamed")
    assert collections.members(launch.n) == ["ticket-1/plan:1  Renamed"], "the member is read live, never copied"
    assert "no environment" in refused(lambda: collections.add(launch.n, ["nowhere/plan:1"])), "an environment that does not exist is refused"
    shutil.rmtree(other.home)
    assert collections.members(launch.n) == [], "a member whose environment is gone is left out quietly"


def test_old_collections_filed_from_a_dump_name_their_dump():
    from migrations.m0057_collections_name_their_dump import run

    record = fresh()
    collections = CONTROLLERS["collection"](record, actor=AGENT)
    filed = collections.create("From a dump", abstract="Everything dump 3 was filed into")
    collections.link(filed.n, "dump:3")
    plain = collections.create("By hand", abstract="Whatever I like")
    collections.link(plain.n, "todo:1")
    assert run(record.root) == [f"t {filed.ref} came from dump:3"], "only a collection whose abstract says a dump filled it is named for that dump"
    assert collections.load(filed.n).source == "dump:3" and not collections.load(plain.n).source, "the other collection is left alone"
    assert run(record.root) == [], "a collection that already names its dump is not touched again"


def test_old_group_folders_become_collections_and_what_pointed_at_them_follows(tmp_path):
    from migrations.m0018_groups_become_collections import run

    home = tmp_path / "environments" / "main"
    (home / "group").mkdir(parents=True)
    (home / "group" / "001.md").write_text("a group")
    (home / "group" / "index.json").write_text("{}")
    (home / "todo").mkdir()
    (home / "todo" / "001.md").write_text("belongs to group:1")
    (tmp_path / "environments" / "second" / "group").mkdir(parents=True)
    (tmp_path / "environments" / "second" / "collection").mkdir()
    assert run(tmp_path) == "groups are collections: 1 rows moved, 1 files point at them now", "a group folder is renamed and what named its rows is repointed"
    assert (home / "collection" / "001.md").read_text() == "a group" and not (home / "group").exists(), "the rows moved with their folder"
    assert (home / "todo" / "001.md").read_text() == "belongs to collection:1", "a row that named the group names the collection"
    assert (tmp_path / "environments" / "second" / "group").exists(), "an environment that already has collections keeps its old folder untouched"
