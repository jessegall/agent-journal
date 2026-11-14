import json

from engine.testing.stories.story import Story

FIRST_STORY_ID = 1

ASSIGNMENTS = "assignment list --json --limit 50 --environment main"
EVENTS = "event list --json --limit 50"


def assignment_rows(story: Story) -> list[dict]:
    return [row for row in json.loads(story.run(ASSIGNMENTS, actor=story.user).output_text)["rows"] if row["id"] >= FIRST_STORY_ID]


def row_actors(story: Story, model: str) -> dict[int, int]:
    """The actor of each assigned row of a model that one actor holds, by the row's id."""
    return {row["subject_id"]: row["actor_id"] for row in assignment_rows(story) if row["subject_model"] == model}


def assignment_record(story: Story, model: str, row_id: int) -> dict:
    return next(row for row in assignment_rows(story) if row["subject_model"] == model and row["subject_id"] == row_id)


def logged_events(story: Story, name: str) -> list[dict]:
    rows = json.loads(story.run(EVENTS, actor=story.user).output_text)["rows"]
    return sorted((row for row in rows if row["event"] == name), key=lambda row: row["id"])


def assigned(story: Story, row: str, actor_id: int, flags: str = "") -> str:
    outcome = story.run(f"assign {row} --to {actor_id} {flags} --environment main".replace("  ", " "), actor=story.user)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    return outcome.output_text
