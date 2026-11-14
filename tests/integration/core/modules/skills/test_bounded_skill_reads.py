from core.modules.skills.support.unread_skills import UnreadSkills
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from tests.integration.support.seeded_rows import limit_reads, seeded
from tests.stories.core.support.seeds.large_read_seeds import AgentSkillSeed

"""Book 3 of doc 1255, story 26: the unread skills of an agent are walked in statements of 50, so an agent with many
skill rows gives the same answer within the read limit."""

SEEDED_SKILL_ROWS = 128


def test_agent_skill_unread_with_128_skill_rows_reads_in_statements_of_50(journal):
    agent_id = journal.new_row_id("agent start s-1 claude main --environment main")
    journal.container.get(CommitListenerRunner).run()
    unread = journal.container.get(UnreadSkills)
    few = unread.unread(agent_id)
    seeded(journal, AgentSkillSeed, SEEDED_SKILL_ROWS, session_agent_id=agent_id)
    limit_reads(journal)
    assert unread.unread(agent_id) == few
