from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from tests.stories.core.modules.processes.support.process_samples import install_runner, started_run
from tests.stories.core.support.coding_fixtures import UserBuilder

MARKS = "chat-mark list --environment 1 --oldest"


def test_a_process_run_that_moves_to_the_background_gets_its_mark_at_the_move(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = started_run(story, "./tools/serve-docs", CommandCategory.PROCESS)
    story.run_listeners()
    story.expect_absent(MARKS, f"process:{process.id}", actor=story.user)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.run_listeners()
    story.expect_text(MARKS, "processes.command", f"process:{process.id}", actor=story.user)
