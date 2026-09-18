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
folder = project / ".claude" / "skills" / "journal-todos"
folder.mkdir(parents=True)
(folder / "SKILL.md").write_text('---\nname: journal-todos\ndescription: "To-dos and auto mode"\n---\n\n# To-dos\n')
rows = catalogue(project)
check("the catalogue reads every SKILL.md under .claude/skills, with its frontmatter", (rows[0][SKILL.name], rows[0][SKILL.description], rows[0][SKILL.path]), ("journal-todos", "To-dos and auto mode", ".claude/skills/journal-todos/SKILL.md"))
listed = skills(record)
check("with no agent nothing is loaded or stale; a journal skill is always by default", (listed[0][SKILL.loaded], listed[0][SKILL.stale], listed[0][SKILL.always]), (0, False, True))
check("until chosen otherwise every journal skill is named in the start block", "SKILLS to load now, at every start, before the first write: Skill: journal-todos" in start_block(record), True)
always(record, "journal-todos", False)
check("always off takes it out, and the choice is now the setting", (record.skills, handed(record)), ([], ""))
always(record, "journal-todos", True)
check("always on puts it back", record.skills, ["journal-todos"])
load_now(record, "journal-todos")
check("load now leaves the agent a message asking for the skill", [m.title for m in Messages(record, actor=USER).unread("agent")], ["Please load the journal-todos skill now"])

done()
