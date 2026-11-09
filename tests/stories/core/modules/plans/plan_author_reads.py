from core.base.database.database import Database
from core.base.plan_authors import PlanAuthors, PlanEdit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator


def test_the_author_of_a_plan_is_read_once_however_many_lines_name_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success('plan make "Receipts" --brief "Print receipts"', actor=story.agent)
    authors = story.container.get(PlanAuthors)
    with story.container.get(Database).repeated_work.request():
        answers = [authors.are_authors(story.agent.id, [PlanEdit("plan edit", 1)]) for _ in range(3)]
    story.expect_rows(answers == [True, True, True], detail=str(answers))
