from engine.database.database import Database
from engine.plan.plan_authors import PlanAuthors
from engine.plan.plan_edit import PlanEdit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.integration.support.fixture_journal import FixtureJournal


def test_the_author_of_a_plan_is_read_once_however_many_lines_name_it(journal_with):
    story = FixtureJournal.played(journal_with(), OpenTaskOrchestrator)
    story.expect_success('plan make "Receipts" --brief "Print receipts"', actor=story.agent)
    authors = story.container.get(PlanAuthors)
    with story.container.get(Database).repeated_work.request():
        answers = [authors.are_authors(story.agent.id, [PlanEdit("plan edit", 1)]) for _ in range(3)]
    story.expect_rows(answers == [True, True, True], detail=str(answers))
