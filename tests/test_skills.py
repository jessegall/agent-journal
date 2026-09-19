import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from skills import reference, render, write  # noqa: E402
from tests.kit import check, done  # noqa: E402

got = render()
subjects = [path for path in (Path(__file__).resolve().parents[1] / "skills").glob("*.md") if path.name != "journal.md"]
check("the core, subject skills and one per feature", (sorted(got)[:1], len(got)), (["journal-agents/SKILL.md"], 1 + len(subjects) + len(features.FEATURES)))
core = got["journal/SKILL.md"]
check("the core skill has its front matter and the reference", (core.startswith("---\nname: journal\n"), "## Reference: every noun and its words" in core), (True, True))
check("the core skill teaches autonomous to-do priority judgment", "Agents assign priority themselves when urgency, impact, dependencies or risk make a difference" in core, True)
ref = reference()
for type_, c in CONTROLLERS.items():
    check(f"{type_}: every word is in the reference under its noun", all(f"journal {type_} {c.resource.names.get(m, m)}" in ref for m in ("create", "complete", "show")), True)
check("a type's own word, not the method's name", ("journal todo done <n>" in ref, "journal todo complete" in ref, "journal plan continue <n>" in ref), (True, False, True))
check("the old words never appear", any(w in core for w in ("journal next", "MCP", " reference <n>", "kinds", "dispatcher", "verb")), False)
auto = got["journal-auto/SKILL.md"]
check("a feature's skill says what it listens to, when it speaks and its default", ("It listens to: agent.updated" in auto, "It speaks on idle" in auto, "Off by default" in auto), (True, True, True))
check("message tracing names the automatic message-to-resource links", "# Message tracing" in got["journal-became/SKILL.md"], True)
check("subject skills use v2's singular noun and word commands", ("journal todo start" in got["journal-todos/SKILL.md"], "journal report create" in got["journal-reports/SKILL.md"]), (True, True))
folder = Path(tempfile.mkdtemp())
written = write(folder)
check("written as SKILL.md files, one folder each", (len(written), (folder / "journal" / "SKILL.md").is_file(), (folder / "journal-work" / "SKILL.md").is_file()), (len(got), True, True))

done()
