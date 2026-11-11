import json

from engine.testing.stories.story import Story

FIRST_STORY_ID = 1

HOLDER_STATES = ("started", "testing", "blocked")
ROW_LIMIT = 200


def rows(story: Story, line: str) -> list[dict]:
    return json.loads(story.run(f"{line} --json --limit {ROW_LIMIT}", actor=story.user or story.agent).output_text)["rows"]


def task_assignees(story: Story) -> dict[int, list[int]]:
    assignees: dict[int, list[int]] = {}
    for assignment in rows(story, "assignment list"):
        if assignment["subject_model"] == "task" and assignment["subject_id"] >= FIRST_STORY_ID:
            assignees.setdefault(assignment["subject_id"], []).append(assignment["actor_id"])
    return assignees


def assert_holders_are_assignees(story: Story) -> None:
    """Every task an agent works on, or has blocked while it held it, is assigned to that agent and to nobody else."""
    agent_ids = {agent["id"] for agent in rows(story, "agent list")}
    assignees = task_assignees(story)
    for task in rows(story, "task list"):
        holder_id = task["holder_id"]
        if task["state"] in HOLDER_STATES and holder_id in agent_ids:
            story.expect_rows(assignees.get(task["id"], []) == [holder_id], detail=f"task {task['id']} is held by {holder_id} and assigned to {assignees.get(task['id'], [])}")


def assert_pivot_equals_column(story: Story) -> None:
    """While the column delegated_to exists, the assignment of every task equals it. Deleted in phase 9 of plan 1104."""
    assignees = task_assignees(story)
    for task in (task for task in rows(story, "task list") if task["id"] >= FIRST_STORY_ID):
        expected = [task["delegated_to"]] if task["delegated_to"] is not None else []
        story.expect_rows(assignees.get(task["id"], []) == expected, detail=f"task {task['id']} is delegated to {task['delegated_to']} and assigned to {assignees.get(task['id'], [])}")
