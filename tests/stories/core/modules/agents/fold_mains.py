import json

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.seeds.project_seeds import AgentActorSeed, AgentSeed

OLDER_NUMBER = 7


def main_rows(story) -> list[dict]:
    return json.loads(story.run("agent list --role main --environment main --json", actor=story.user).output_text)["rows"]


def test_the_check_folds_an_older_main_row_on_a_copy_and_files_a_report_while_the_live_rows_stay(new_story):
    story = new_story(fixture=UserBuilder)
    story.seed(AgentActorSeed, 1)
    story.seed(AgentSeed, 1, role="main", number=OLDER_NUMBER, retired_at=None, retirement_reason=None)
    before = main_rows(story)
    story.expect_text("agent fold-mains --check", f"agent {story.agent.id} survives as number 1", f"(number {OLDER_NUMBER})", actor=story.user)
    story.expect_text("report list", "Fold of main agents, checked on a copy", actor=story.user)
    story.expect_rows(main_rows(story) == before, len(before) == 2, detail=str(before))


def test_with_one_main_row_the_check_has_nothing_to_fold(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("agent fold-mains --check", "nothing to fold", actor=story.user)
