from pathlib import Path
from unittest.mock import patch

from engine.change.event_log import EventLog
from engine.change.touched import Touched
from engine.database.database import Database
from core.modules.skills.listeners.skill_event_listener import SkillEventListener
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.story_checks import expect_value


def test_an_event_no_skill_names_reads_no_skill_file_and_no_table(new_story):
    story = new_story(DUE, fixture=CodingEnvironment)
    plugin_skill = story.home.project_folder / ".agents/skills/sample-plugin/SKILL.md"
    plugin_skill.parent.mkdir(parents=True)
    plugin_skill.write_text("---\nplugin: sample\ndescription: Sample plugin skill\n---\nRead the sample.\n")
    story.expect_success('message send "A note" --environment main', actor=story.user)
    log = story.container.get(EventLog)
    logged = next(event for event in log.events_after(0) if event.event == "message.create")
    database = story.container.get(Database)
    listener = story.container.get(SkillEventListener)
    statements = []
    database.connection.set_trace_callback(statements.append)
    try:
        with patch.object(Path, "read_text", autospec=True, side_effect=Path.read_text) as read_text:
            listener.handle(Touched(), logged)
        expect_value(read_text.call_count, 0)
        expect_value(statements, [])
    finally:
        database.connection.set_trace_callback(None)
