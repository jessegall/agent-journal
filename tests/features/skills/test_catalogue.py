import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages  # noqa: E402
from engine.queries import start_block  # noqa: E402
from features.skills.catalogue import SKILL, always, catalogue, handed, load_now, skills  # noqa: E402
from resources.base import USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
project = record.root.parent
for home in (".claude/skills", ".codex/skills"):
    folder = project / home / "journal-auto"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-auto\ndescription: "Auto mode"\n---\n\n# Auto\n')
obsolete = project / ".claude" / "skills" / "journal-obsolete"
obsolete.mkdir(parents=True)
(obsolete / "SKILL.md").write_text('---\nname: journal-obsolete\ndescription: "Old skill"\n---\n\n# Old\n')
rows = catalogue(project)
auto = next(row for row in rows if row[SKILL.name] == "journal-auto")
check("the catalogue reads every SKILL.md under both agent homes, with its frontmatter", (auto[SKILL.description], auto[SKILL.path]), ("Auto mode", ".claude/skills/journal-auto/SKILL.md"))
listed = skills(record)
auto = next(row for row in listed if row[SKILL.name] == "journal-auto")
check("with no agent nothing is loaded or stale; a current journal skill is always by default", (auto[SKILL.loaded], auto[SKILL.stale], auto[SKILL.always]), (0, False, True))
check("the start block names current skills present for both agents, not obsolete provider-only ones", ("Skill: journal-auto" in start_block(record), "journal-obsolete" in start_block(record)), (True, False))
record.skills = ["journal-auto", "journal-obsolete"]
check("stale persisted choices are filtered from the start block", handed(record), "SKILLS to load now, at every start, before the first write: Skill: journal-auto")
always(record, "journal-auto", False)
check("always off takes it out, and the choice is now the setting", (record.skills, handed(record)), ([], ""))
always(record, "journal-auto", True)
check("always on puts it back", record.skills, ["journal-auto"])
load_now(record, "journal-auto")
check("load now leaves the agent a message asking for the skill", [m.title for m in Messages(record, actor=USER).unread("agent")], ["Please load the journal-auto skill now"])

done()
