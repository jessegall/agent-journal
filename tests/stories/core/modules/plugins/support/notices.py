from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine


def expect_plugin_notice(story, sample, expected):
    query = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id)
    before = {row.id for row in query.all_rows()}
    story.expect_hook_allowed("s-1", sample)
    lines = [row.text for row in query.all_rows() if row.id not in before]
    assert expected in lines, lines
