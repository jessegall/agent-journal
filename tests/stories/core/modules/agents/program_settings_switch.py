import json
from datetime import timedelta

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.fixtures import AgentStarted

OLD_JOURNAL_BLOCK = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 90}]}
FOREIGN_BLOCK = {"matcher": "Bash", "hooks": [{"type": "prompt", "prompt": "Review this"}]}


def test_a_session_started_before_the_switch_keeps_its_hooks_until_it_ends(new_story):
    story = new_story(fixture=AgentStarted)
    local = story.home.project_folder / ".claude" / "settings.local.json"
    local.parent.mkdir(parents=True, exist_ok=True)
    local.write_text(json.dumps({"hooks": {"PreToolUse": [OLD_JOURNAL_BLOCK, FOREIGN_BLOCK]}}))
    story.advance(timedelta(minutes=1))
    tick = ProgramSettingsWatch()
    tick(story.container)
    kept_while_running = json.loads(local.read_text())["hooks"]["PreToolUse"] == [OLD_JOURNAL_BLOCK, FOREIGN_BLOCK]
    blocked_mark = "until the sessions started before the switch end" in marks_text(story)
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    tick(story.container)
    story.expect_rows(kept_while_running, blocked_mark, json.loads(local.read_text()) == {"hooks": {"PreToolUse": [FOREIGN_BLOCK]}},
                      "The journal took its old hooks out of the project files of claude" in marks_text(story))
