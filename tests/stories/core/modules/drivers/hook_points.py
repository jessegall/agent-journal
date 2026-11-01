from core.base.database.database import Database
from core.modules.drivers.support.hook_durations import HOOK_LIMIT_POINTS
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.drivers.hook_durations import BuilderWithUser

ROW_COUNT = 40
SAMPLES = {
    "session_start": HookSamples.session_start(),
    "prompt": HookSamples.prompt("Fix the cart"),
    "edit": HookSamples.edit("cart.py"),
    "shell": HookSamples.shell("ls -la", ShellPart("ls", CommandCategory.READ, ["-la"])),
    "stop": HookSamples.stop(),
    "tick": HookSamples.tick(),
}


def filled(story) -> None:
    for number in range(ROW_COUNT):
        story.run(f'task make "Task {number}" --brief "A job to do" --environment main', actor=story.user)
        story.run(f'message send "Message {number}" --environment main', actor=story.user)
        story.run(f'memory make fact "Fact {number}" --project', actor=story.user)


def test_every_kind_of_hook_costs_the_database_under_the_points_a_hook_may_cost_on_a_filled_journal(new_story):
    story = new_story(fixture=BuilderWithUser)
    filled(story)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    database = story.container.get(Database)
    over = {}
    for name, sample in SAMPLES.items():
        before = database.tally.points()
        story.hook("s-1", sample)
        points = database.tally.points().minus(before)
        if points.total >= HOOK_LIMIT_POINTS:
            over[name] = f"{points.total} points ({points.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in points.statements.most_common(3))
    assert not over, "\n".join(f"{name}: {line}" for name, line in over.items())
