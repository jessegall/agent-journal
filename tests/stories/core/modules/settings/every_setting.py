import json
import shlex

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_absent_value, expect_value_5

FIXTURE_KEYS = ["journal.core.drivers.suite"]
OPTIONAL_GROUP = "journal.core.developer.tools"


def rows(story) -> list[dict]:
    return json.loads(story.run("setting tree --json --environment main", actor=story.user).output_text)["rows"]


def saved_text(row: dict) -> str:
    match row["type"]:
        case "list":
            return row["default"]
        case "number list":
            return ",".join(str(item) for item in json.loads(row["default"]))
        case "flag":
            return "on" if row["default"] else "off"
        case _:
            return str(row["default"])


def test_every_setting_shows_its_default_and_keeps_it_when_saved_unchanged(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting switch {OPTIONAL_GROUP} on --project", actor=story.user)
    problems = []
    for row in rows(story):
        if row["secret"] or row["default"] is None or row["type"] in ("group", "any") or row["key"] in FIXTURE_KEYS:
            continue
        if row["value"] != row["default"]:
            problems.append(f"{row['key']} shows {row['value']!r}, its default is {row['default']!r}")
            continue
        outcome = story.run(f"setting set {row['key']} {shlex.quote(saved_text(row))} --environment main", actor=story.user)
        if outcome.code != 0:
            continue
        saved = next(listed for listed in rows(story) if listed["key"] == row["key"])
        if saved["value"] != row["default"]:
            problems.append(f"{row['key']} saved unchanged became {saved['value']!r}, its default is {row['default']!r}")
    expect_absent_value(problems)


def test_a_list_item_holding_a_comma_stays_one_item(new_story):
    story = new_story(fixture=UserBuilder)
    key = "journal.core.overview.commands"
    story.expect_success(f"""setting set {key} '["task list --columns id,title", "question list"]' --environment main""", actor=story.user)
    value = next(row["value"] for row in rows(story) if row["key"] == key)
    expect_value_5(value, ["task list --columns id,title", "question list"])
