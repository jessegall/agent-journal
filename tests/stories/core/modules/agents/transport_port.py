from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.program_transport import ProgramTransport
from tests.stories.core.modules.agents.support.other_machine_transport import DIFFERENT_MACHINE, OtherMachineTransport
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent
from tests.stories.core.support.agent_labels import agent_number

PROGRAM_LINE = "claude -p Read"


def test_559_an_agent_on_another_machine_is_started_read_and_stopped_by_the_same_commands_through_another_transport(new_story):
    story = new_story(DIFFERENT_MACHINE, fixture=EndedHelper)
    helper = helper_agent(story)
    number, folder = agent_number(story, helper.id), story.container.get(AgentFolders).folder(helper)
    story.expect_success(f"agent start-program --folder {folder} --environment main {number} {PROGRAM_LINE}", "start: started", actor=story.user)
    story.expect_text(f"agent standing {number} --environment main", "standing: running", actor=story.user)
    story.expect_success(f"agent stop-program {number} --environment main", "stop: program_ended", actor=story.user)
    transport = story.container.get(ProgramTransport)
    story.expect_text(f"agent standing {number} --environment main", "standing: ended", actor=story.user)
    story.expect_rows(isinstance(transport, OtherMachineTransport), not story.home.socket(LAUNCHER_SOCKET).exists(), detail=f"the bound transport is {type(transport).__name__}")
    story.expect_rows([start["command"] for start in transport.starts] == [PROGRAM_LINE.split()], transport.stopped_ids == [helper.id], detail=f"{transport.starts} {transport.stopped_ids}")
