from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.drivers.support.hook_cost_tool import HOOK_LIMIT_POINTS
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.drivers.hook_durations import BuilderWithUser

ROW_COUNT = 40
READS_MEASURED = 60
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
        start = database.tally.points()
        story.hook("s-1", sample)
        cost = database.tally.points().minus(start)
        if cost.total >= HOOK_LIMIT_POINTS:
            over[name] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
    assert not over, "\n".join(f"{name}: {line}" for name, line in over.items())


def test_every_read_a_window_asks_of_an_endpoint_costs_under_the_same_points_on_a_filled_journal(new_story):
    story = new_story(fixture=BuilderWithUser)
    filled(story)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    database = story.container.get(Database)
    over = {}
    measured = 0
    for read in sorted({read for window in story.container.get(Registry).windows for read in window.reads}):
        for line in (read, f"{read} 1", f"{read} --agent {story.agent.id}"):
            start = database.tally.points()
            outcome = story.run(line, actor=story.user)
            cost = database.tally.points().minus(start)
            if outcome.code != 0:
                continue
            measured += 1
            if cost.total >= HOOK_LIMIT_POINTS:
                over[line] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
            break
    assert measured > READS_MEASURED, f"only {measured} reads ran"
    assert not over, "\n".join(f"{line}: {text}" for line, text in over.items())
