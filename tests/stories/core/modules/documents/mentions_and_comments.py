from tests.stories.core.support.fixtures import UserJoined


def test_a_document_naming_a_task_by_its_number_links_to_it_once(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run('doc make "Plan notes" --abstract "Notes" --body "See task 1, and task 1 again, and task 99"', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source docs:1", "tasks:1", "mentions", actor=story.user)
    story.expect_absent("link list --source docs:1", "tasks:99", actor=story.user)


def test_a_document_with_no_comments_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Plan notes" --abstract "Notes" --body "text"', actor=story.user)
    story.expect_text("doc comments 1", "no comments on doc 1", actor=story.user)
