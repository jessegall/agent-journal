from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.chat.models.chat_mark import ChatMark
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.documents.support.read_marks import ReadableTexts
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.support.story_checks import expect_value



def finished_read(story, line):
    process = start_process(story, f"journal {line}")
    answer = story.run(line, actor=story.agent)
    story.expect_success(f"process part-end {process.id} --position 1 --exit-code {answer.code}", actor=story.agent)


def read_marks(story):
    return list(story.story_rows(ChatMark, type="documents.read"))


def test_document_and_report_reads_show_one_clickable_mark_per_row_in_a_turn(played):
    story = played(ReadableTexts)
    for line in ("report show 1", "doc show 1", "doc show 1", "report show 1"):
        finished_read(story, line)
    story.run_listeners()
    marks = read_marks(story)
    expect_value([(mark.text, mark.target_model, mark.target_id, mark.session_agent_id) for mark in marks],
                 [("Read report 1 (outline)", "report", 1, story.agent.id), ("Read document 1 (outline)", "doc", 1, story.agent.id)])
    declaration = next(mark for mark in Registry.read(story.container.get(Database)).marks if mark.type == "documents.read")
    expect_value(declaration.click, "open row")








