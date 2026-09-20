import tarfile
from pathlib import Path

from controllers.types import Environments, Todos
from engine import attic
from engine.record import Record
from migrations import run as migrate
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_removing_packs_the_record_and_unarchiving_restores_it_byte_for_byte():
    record = fresh()
    envs = Environments(record, actor=AGENT, session="s-1")
    home = envs.create(record.env)
    envs.switch(home.n)
    made = envs.create("scratch")
    scratch = Record(record.root, "scratch")
    todos = Todos(scratch, actor=USER)
    row = todos.create("keep me", brief="exactly this")
    picture = Path(record.root / "shot.png")
    picture.write_bytes(bytes(range(256)) * 4)
    todos.attach(row.n, str(picture))
    before = {p.relative_to(scratch.home): p.read_bytes() for p in scratch.home.rglob("*") if p.is_file()}

    said = envs.complete(made.n, yes=True)
    packed = list(attic.folder(record.root).iterdir())
    assert ([p.name.endswith(".tar.gz") for p in packed], scratch.home.exists()) == ([True], False), \
        "the record is one .tar.gz in the attic, the folder gone"
    assert said.endswith("journal environment unarchive scratch brings it back") is True, \
        "the removal says how to bring it back"
    assert tarfile.is_tarfile(packed[0]) and packed[0].read_bytes()[:2] == b"\x1f\x8b", "the archive is gzip"

    envs.unarchive("scratch")
    after = {p.relative_to(scratch.home): p.read_bytes() for p in scratch.home.rglob("*") if p.is_file()}
    assert after == before, "every file comes back exactly"
    assert ([e.title for e in envs.all()], list(attic.folder(record.root).iterdir())) == ([record.env, "scratch"], []), \
        "the environment row is back and the archive is spent"
    assert refused(lambda: envs.unarchive("scratch")) == "no archived environment 'scratch' in attic/", \
        "a live environment of that name is not overwritten"

    envs.complete(envs.find("scratch").n, yes=True)
    envs.create("scratch")
    assert refused(lambda: envs.unarchive("scratch")) == "environment 'scratch' exists: rename it before bringing the archived one back", \
        "an archive whose name is taken is refused, not merged"
    assert refused(lambda: envs.unarchive("never")) == "no archived environment 'never' in attic/", \
        "nothing archived under that name: refused"


def test_the_newest_archive_of_a_name_wins_a_longer_name_sharing_the_prefix_is_not_mistaken_for_it():
    root = fresh().root
    (attic.folder(root)).mkdir()
    for name in ("a-1", "a-20", "a-b-99"):
        (root / "environments" / name).mkdir(parents=True)
        (root / "environments" / name / "note").write_text(name)
        attic.pack(root / "environments" / name, name)
    assert attic.latest(root, "a").name == "a-20.tar.gz", "the latest by its stamp, not by text"

    (root / "environments" / "b").mkdir()
    attic.pack(root / "environments" / "b", "b")
    assert attic.latest(root, "b").name == "b.tar.gz", \
        "an archive from before stamps, named only for its environment, is still found"


def test_the_migration_compresses_every_folder_already_in_the_attic_contents_intact():
    record = fresh()
    old = attic.folder(record.root) / "legacy-1700000000"
    (old / "todo").mkdir(parents=True)
    (old / "todo" / "001.md").write_text("the old row\n")
    ran = migrate(record.root)
    assert ("m0004_compress_attic" in ran, attic.folder(record.root).joinpath("legacy-1700000000.tar.gz").is_file(), old.exists()) == \
        (True, True, False), "the migration ran and named what it packed"

    target = record.root / "environments" / "back"
    attic.unpack(attic.folder(record.root) / "legacy-1700000000.tar.gz", target)
    assert (target / "todo" / "001.md").read_text() == "the old row\n", "its contents unpack unchanged"


def test_a_pack_that_does_not_check_out_leaves_the_folder_in_place_and_no_archive_behind():
    record = fresh()
    kept = record.root / "environments" / "fragile"
    kept.mkdir(parents=True)
    (kept / "a").write_text("a")
    real = tarfile.TarFile.add
    tarfile.TarFile.add = lambda self, name, arcname=None, **kw: None
    assert refused(lambda: attic.pack(kept, "fragile-1")) == "fragile did not pack whole; it is left where it was", \
        "a failed pack is refused, saying the folder stays"
    tarfile.TarFile.add = real
    assert ((kept / "a").read_text(), sorted(p.name for p in attic.folder(record.root).iterdir())) == ("a", []), \
        "the folder is untouched and no partial archive remains"
