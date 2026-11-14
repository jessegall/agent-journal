from datetime import timedelta

import pytest

from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from tests.stories.core.modules.helpers.cold_sessions import with_job
from tests.stories.core.modules.helpers.helper_jobs import helper_agent, resumable_session
from tests.stories.core.modules.helpers.lifetime_combinations import launched_job
from tests.stories.core.modules.helpers.rotation_mid_job import session_rows
from tests.stories.core.modules.helpers.support.rotating_helper import EndedColdRotationHelper, story_with_profile_file
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number

SILENT_MINUTES = 180
LIMIT_TOKENS = 400000


@pytest.fixture
def cooling(new_story):
    return story_with_profile_file(new_story, EndedColdRotationHelper)






def test_an_idle_helper_that_gets_no_job_for_a_day_keeps_its_session_and_its_history(cooling):
    helper, rows = helper_agent(cooling), session_rows(cooling)
    cooling.advance(timedelta(days=1))
    cooling.run_listeners()
    current = helper_agent(cooling)
    cooling.expect_rows(current.session == helper.session, current.retired_at is None, session_rows(cooling) == rows, detail=str(session_rows(cooling)))


