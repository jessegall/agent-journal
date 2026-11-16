from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.program_transport import ProgramTransport
from tests.stories.core.modules.agents.support.other_machine_transport import DIFFERENT_MACHINE, RemoteMachineTransport
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent

PROGRAM_LINE = "claude -p Read"


def test_559_an_agent_on_another_machine_is_started_read_and_stopped_by_the_same_commands_through_another_transport(played):
    story = played(EndedHelper, DIFFERENT_MACHINE)
    helper = helper_agent(story)
    number, folder = helper.id, story.container.get(AgentFolders).folder(helper)
    story.expect_success(f"agent start-program --folder {folder} --environment main {number} {PROGRAM_LINE}", "start: started", actor=story.user)
    story.expect_text(f"agent status {number} --environment main", "state: running", actor=story.user)
    story.expect_success(f"agent stop-program {number} --environment main", "stop: program_ended", actor=story.user)
    transport = story.container.get(ProgramTransport)
    story.expect_text(f"agent status {number} --environment main", "state: ended", actor=story.user)
    story.expect_rows(isinstance(transport, RemoteMachineTransport), not story.home.socket(LAUNCHER_SOCKET).exists(), detail=f"the bound transport is {type(transport).__name__}")
    story.expect_rows([start["command"] for start in transport.starts] == [PROGRAM_LINE.split()], transport.stopped_ids == [helper.id], detail=f"{transport.starts} {transport.stopped_ids}")
