from tests.stories.core.modules.skills.agent_skills import due_notes, started
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import AgentSkillSeed

"""Book 3 of doc 1255, story 26: the unread skills of an agent are walked in statements of 50, so an agent with
many skill rows gives the same answer within the read limit."""

SEEDED_SKILL_ROWS = 128


def test_agent_skill_unread_with_128_skill_rows_reads_in_statements_of_50(new_story):
    story = started(new_story)
    story.seed(AgentSkillSeed, SEEDED_SKILL_ROWS, session_agent_id=story.agent.id)
    due_notes(story)
    limit_reads(story)
    story.expect_success(f"agent-skill unread {agent_number(story, story.agent.id)}", "journal-notes")
