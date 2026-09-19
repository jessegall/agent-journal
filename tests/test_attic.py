import sys
import tarfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Environments, Todos  # noqa: E402
from engine import attic  # noqa: E402
from engine.record import Record  # noqa: E402
from migrations import run as migrate  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

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

# REMOVING packs the record into one gzip archive and takes the folder away
said = envs.complete(made.n, yes=True)
packed = list(attic.folder(record.root).iterdir())
check("the record is one .tar.gz in the attic, the folder gone", ([p.name.endswith(".tar.gz") for p in packed], scratch.home.exists()), ([True], False))
check("the removal says how to bring it back", said.endswith("journal environment unarchive scratch brings it back"), True)
check("the archive is gzip", tarfile.is_tarfile(packed[0]) and packed[0].read_bytes()[:2] == b"\x1f\x8b", True)

# UNARCHIVING restores every file byte for byte, attachments too, and the row
envs.unarchive("scratch")
after = {p.relative_to(scratch.home): p.read_bytes() for p in scratch.home.rglob("*") if p.is_file()}
check("every file comes back exactly", after, before)
check("the environment row is back and the archive is spent", ([e.title for e in envs.all()], list(attic.folder(record.root).iterdir())), ([record.env, "scratch"], []))
check("a live environment of that name is not overwritten", refused(lambda: envs.unarchive("scratch")), "no archived environment 'scratch' in attic/")
envs.complete(envs.find("scratch").n, yes=True)
envs.create("scratch")
check("an archive whose name is taken is refused, not merged", refused(lambda: envs.unarchive("scratch")), "environment 'scratch' exists: rename it before bringing the archived one back")
check("nothing archived under that name: refused", refused(lambda: envs.unarchive("never")), "no archived environment 'never' in attic/")

# THE NEWEST ARCHIVE of a name wins; a longer name sharing the prefix is not mistaken for it
root = fresh().root
(attic.folder(root)).mkdir()
for name in ("a-1", "a-20", "a-b-99"):
    (root / "environments" / name).mkdir(parents=True)
    (root / "environments" / name / "note").write_text(name)
    attic.pack(root / "environments" / name, name)
check("the latest by its stamp, not by text", attic.latest(root, "a").name, "a-20.tar.gz")

# THE MIGRATION compresses every folder already in the attic, contents intact
record = fresh()
old = attic.folder(record.root) / "legacy-1700000000"
(old / "todo").mkdir(parents=True)
(old / "todo" / "001.md").write_text("the old row\n")
ran = migrate(record.root)
check("the migration ran and named what it packed", ("m0004_compress_attic" in ran, attic.folder(record.root).joinpath("legacy-1700000000.tar.gz").is_file(), old.exists()), (True, True, False))
target = record.root / "environments" / "back"
attic.unpack(attic.folder(record.root) / "legacy-1700000000.tar.gz", target)
check("its contents unpack unchanged", (target / "todo" / "001.md").read_text(), "the old row\n")

# A PACK THAT DOES NOT CHECK OUT leaves the folder in place and no archive behind
record = fresh()
kept = record.root / "environments" / "fragile"
kept.mkdir(parents=True)
(kept / "a").write_text("a")
real = tarfile.TarFile.add
tarfile.TarFile.add = lambda self, name, arcname=None, **kw: None
check("a failed pack is refused, saying the folder stays", refused(lambda: attic.pack(kept, "fragile-1")), "fragile did not pack whole; it is left where it was")
tarfile.TarFile.add = real
check("the folder is untouched and no partial archive remains", ((kept / "a").read_text(), sorted(p.name for p in attic.folder(record.root).iterdir())), ("a", []))

done()
