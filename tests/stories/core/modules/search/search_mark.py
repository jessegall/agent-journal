import json

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.modules.search.support.row_search import RowSearch
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import marks_text, expect_marks_text
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_total_closed, expect_value


def search_hook(line: str):
    tokens = line.split()
    return HookSamples.shell(line, ShellPart(tokens[0], CommandCategory.JOURNAL, tokens[1:], subcommand=tokens[1]))


def test_a_search_in_a_chain_has_its_mark_too(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.shell("ls src && journal search find cart", ShellPart("ls", CommandCategory.READ, ["src"]), ShellPart("journal", CommandCategory.JOURNAL, ["search", "find", "cart"], subcommand="search")))
    story.run_listeners()
    expect_marks_text(story, "Searched for cart: 1 row")


def test_a_search_uses_what_its_mark_read_once_and_reads_the_rows_itself_after_that(new_story, monkeypatch):
    story = install_runner(new_story(fixture=UserBuilder))
    story.run('task make "Mend the door" --environment main', actor=story.user)
    story.hook("s-1", search_hook("journal search find door"))
    story.run_listeners()
    search = story.container.get(RowSearch)
    original_search, calls = search.result, []
    monkeypatch.setattr(search, "result", lambda terms, models: calls.append(terms) or original_search(terms, models))
    story.expect_text("search find door", "Mend the door", actor=story.agent)
    expect_value(calls, [])
    story.expect_text("search find door", "Mend the door", actor=story.agent)
    expect_value(calls, [["door"]])


def details(story) -> list[dict]:
    answer = json.loads(story.run("chat-mark list --environment 1 --oldest --json").output_text)
    rows = answer["rows"] if isinstance(answer, dict) else answer
    return [json.loads(row["lines"]) for row in rows if row["type"] == "search.search"]


def test_the_mark_opens_to_the_rows_found_each_with_its_noun_number_and_passage(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run('doc make "Cart rules" --abstract "How the cart counts" --body "in cents"', actor=story.user)
    story.hook("s-1", search_hook("journal search find cart"))
    story.run_listeners()
    [mark] = details(story)
    expect_row(mark, terms=["cart"])
    expect_row(mark, total=2)
    expect_cli_hit_id(mark, [("doc", 1), ("task", 1)])
    expect_excerpt_hit_hits(mark)


def expect_excerpt_hit_hits(mark) -> None:
    actual = all((hit['excerpt'] for hit in mark['hits']))
    assert actual, actual


def expect_cli_hit_id(mark, expected) -> None:
    actual = [(hit['cli_name'], hit['id']) for hit in mark['hits']]
    assert actual == expected, actual
