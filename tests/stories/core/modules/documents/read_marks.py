from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.database.database import Database
from engine.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.chat.models.chat_mark import ChatMark
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.documents.support.read_marks import ReadableTexts
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.support.story_checks import expect_value


def finished_read(story, line):
    process = start_process(story, f"journal {line}")
    answer = story.run(line, actor=story.agent)
    story.expect_success(f"process part-end {process.id} --position 1 --exit-code {answer.code}", actor=story.agent)


def read_marks(story):
    return list(story.container.get(Queries).query(ChatMark).filter(type="documents.read").oldest().all_rows())


def test_document_and_report_reads_show_one_clickable_mark_per_row_in_a_turn(new_story):
    story = new_story(fixture=ReadableTexts)
    for line in ("report show 1", "doc show 1", "doc show 1", "report show 1"):
        finished_read(story, line)
    story.run_listeners()
    marks = read_marks(story)
    expect_value([(mark.text, mark.target_model, mark.target_id, mark.session_agent_id) for mark in marks],
                 [("Read report 1 (outline)", "report", 1, story.agent.id), ("Read document 1 (outline)", "doc", 1, story.agent.id)])
    declaration = next(mark for mark in Registry.read(story.container.get(Database)).marks if mark.type == "documents.read")
    expect_value(declaration.click, "open row")


@pytest.mark.parametrize("command, label", [("doc", "document"), ("report", "report")])
def test_a_read_mark_names_the_part_that_was_read(new_story, command, label):
    story = new_story(fixture=ReadableTexts)
    story.expect_success(f'{command} make "Cart sections" --abstract "The sections" --body "# Cart\nBuild the cart with two words"', actor=story.user)
    for line in (f"{command} show 2 --section 1", f'{command} show 2 --section "Cart"', f"{command} show 2 --section 1 --bullets", f'{command} show 2 --grep "two words"', f"{command} show 2 --all", f"{command} show 2"):
        finished_read(story, line)
    story.run_listeners()
    expect_value([mark.text for mark in read_marks(story)], [f"Read {label} 2 ({part})" for part in ("section 1", "section Cart", "bullets of section 1", 'search "two words"', "all", "outline")])


@pytest.mark.parametrize("role", ["worker", "helper"])
def test_another_agents_reads_make_no_document_marks(new_story, role):
    story = new_story(fixture=ReadableTexts)
    worker = story.new_row_id(f"agent start s-reader claude {role} --parent {story.agent.id} --environment main")
    story.agent = Actor(worker, ActorType.AGENT)
    finished_read(story, "doc show 1")
    finished_read(story, "report show 1")
    story.run_listeners()
    expect_value(read_marks(story), [])


def test_a_new_prompt_allows_a_new_read_mark_even_when_the_listener_runs_later(new_story):
    story = new_story(fixture=ReadableTexts)
    finished_read(story, "doc show 1")
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.prompt("Check the design again"))
    finished_read(story, "doc show 1 --all")
    story.run_listeners()
    expect_value([mark.text for mark in read_marks(story)], ["Read document 1 (outline)", "Read document 1 (all)"])


def test_a_failed_read_and_a_document_list_make_no_read_mark(new_story):
    story = new_story(fixture=ReadableTexts)
    finished_read(story, "doc show 999")
    finished_read(story, "doc list")
    story.run_listeners()
    expect_value(read_marks(story), [])
