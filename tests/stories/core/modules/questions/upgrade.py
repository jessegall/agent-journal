from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_an_answered_question_moves_with_its_options_answer_and_asking_agent_from_version_4_questions(new_story):
    story = upgraded_story(new_story)
    story.expect_success("question show 1", "question 1: Which database?", "choices: Postgres / SQLite", "state: answered")
    story.expect_text("question show 1 --json", '"answer": "SQLite"', '"recommended": "SQLite"')


def test_an_open_question_moves_open(new_story):
    story = upgraded_story(new_story)
    story.expect_success("question show 2", "question 2: Ship on Friday?", "state: open")
    assert "questions: moved 2" in story.upgrade_text
