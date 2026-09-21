import pytest

import features
from controllers.types import Styles
from resources.base import USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_style_rule_writes_a_skill_that_updates_and_is_removed_when_struck():
    record = fresh()
    styles = Styles(record, actor=USER)
    rule = styles.create("Helper functions in the viewer", subject="js-helpers", decision="a top-level helper is a function declaration", when="static/app.js helpers", brief="Decided in the review.")
    skill = record.root.parent / ".agents" / "skills" / "style-js-helpers" / "SKILL.md"
    linked = record.root.parent / ".claude" / "skills" / "style-js-helpers"
    assert skill.read_text() == "---\nname: style-js-helpers\ndescription: Helper functions in the viewer: a top-level helper is a function declaration\n---\n\n# Helper functions in the viewer\n\n**The rule here:** a top-level helper is a function declaration\n\nApplies to static/app.js helpers.\n\nDecided in the review.\n", \
        "a style rule writes its skill"
    styles.update(rule.n, decision="a top-level helper is a function declaration, never a const arrow")
    assert ("never a const arrow" in skill.read_text(), linked.is_symlink(), (linked / "SKILL.md").read_text() == skill.read_text()) == \
        (True, True, True), "a change rewrites it, and Claude reads it through a link"
    styles.method("strike")(rule.n, "no longer wanted")
    assert (skill.exists(), linked.exists()) == (False, False), "struck: the skill and its link are gone"
    assert (styles.resource.scope, styles.resource.labels["brief"]) == ("project", "Reasoning"), \
        "style rules are the project's, with their reasoning"
