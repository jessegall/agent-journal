import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Styles  # noqa: E402
from resources.base import USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
styles = Styles(record, actor=USER)
rule = styles.create("Helper functions in the viewer", subject="js-helpers", decision="a top-level helper is a function declaration", when="static/app.js helpers", brief="Decided in the review.")
skill = record.root.parent / ".claude" / "skills" / "style-js-helpers" / "SKILL.md"
check("a style rule writes its skill", skill.read_text(), "---\nname: style-js-helpers\ndescription: Helper functions in the viewer: a top-level helper is a function declaration\n---\n\n# Helper functions in the viewer\n\n**The rule here:** a top-level helper is a function declaration\n\nApplies to static/app.js helpers.\n\nDecided in the review.\n")
styles.update(rule.n, decision="a top-level helper is a function declaration, never a const arrow")
check("a change rewrites it", "never a const arrow" in skill.read_text(), True)
styles.method("strike")(rule.n, "no longer wanted")
check("struck: the skill is gone", skill.exists(), False)
check("style rules are the project's, with their reasoning", (styles.resource.scope, styles.resource.labels["brief"]), ("project", "Reasoning"))

done()
