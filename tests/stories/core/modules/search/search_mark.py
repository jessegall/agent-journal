import json

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import BuilderWithUser


def search_hook(line: str):
    words = line.split()
    return HookSamples.shell(line, ShellPart(words[0], CommandCategory.JOURNAL, words[1:], subcommand=words[1]))


def details(story) -> list[dict]:
    answer = json.loads(story.run("chat-mark list --environment 1 --oldest --json").output_text)
    rows = answer["rows"] if isinstance(answer, dict) else answer
    return [json.loads(row["lines"]) for row in rows if row["type"] == "search.search"]


def test_an_agent_that_searches_has_one_mark_with_its_words_and_how_many_rows_held_them(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.hook("s-1", search_hook("journal search find cart"))
    story.run_listeners()
    assert "Searched for cart: 1 row" in marks_text(story), marks_text(story)


def test_the_mark_opens_to_the_rows_found_each_with_its_noun_number_and_passage(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run('doc make "Cart rules" --abstract "How the cart counts" --body "in cents"', actor=story.user)
    story.hook("s-1", search_hook("journal search find cart"))
    story.run_listeners()
    [found] = details(story)
    assert found["terms"] == ["cart"] and found["total"] == 2
    assert [(hit["cli_name"], hit["id"]) for hit in found["hits"]] == [("doc", 1), ("task", 1)]
    assert all(hit["excerpt"] for hit in found["hits"])


def test_the_mark_keeps_the_first_ten_rows_and_says_how_many_there_were(new_story):
    story = new_story(fixture=BuilderWithUser)
    for number in range(14):
        story.run(f'task make "Cart task {number}" --environment main', actor=story.user)
    story.hook("s-1", search_hook("journal search find cart"))
    story.run_listeners()
    [found] = details(story)
    assert len(found["hits"]) == 10 and found["total"] == 14
    assert "Searched for cart: 14 rows" in marks_text(story)


def test_the_model_option_narrows_the_search_the_mark_shows(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "The cart task" --environment main', actor=story.user)
    story.run('doc make "Cart rules" --abstract "How the cart counts" --body "in cents"', actor=story.user)
    story.hook("s-1", search_hook("journal search find cart --model task"))
    story.run_listeners()
    [found] = details(story)
    assert [hit["cli_name"] for hit in found["hits"]] == ["task"]


def test_a_command_that_is_no_search_and_a_search_of_an_unknown_model_leave_no_mark(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.hook("s-1", search_hook("journal task list"))
    story.hook("s-1", search_hook("journal search find cart --model ghost"))
    story.run_listeners()
    assert details(story) == []
