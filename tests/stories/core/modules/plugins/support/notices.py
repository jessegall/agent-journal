from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine


def expect_plugin_notice(story, sample, expected, session="s-1", agent_id=None):
    query = story.container.get(Queries).query(AgentLine).filter(session_agent_id=agent_id if agent_id is not None else story.agent.id)
    previous = {row.id for row in query.all_rows()}
    story.expect_hook_allowed(session, sample)
    lines = [row.text for row in query.all_rows() if row.id not in previous]
    assert expected in lines, lines
