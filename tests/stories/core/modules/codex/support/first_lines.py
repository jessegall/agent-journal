import json
import subprocess

from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.processes.support.process_nudges import SILENT_RUN
from core.modules.processes.support.streaming_hints import StreamingHints
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment, dispatched_worker, worker_session


def expect_memory_start(story) -> None:
    story.expect_success('memory make "Totals are cents" --environment main')
    story.expect_success("skill write")
    answer = story.hook("s-1", HookSamples.session_start().with_fields(program="codex"))
    line = next(line for line in answer.lines if "memories to read" in line)
    assert line.index("load the memory skill") < line.index("list them"), line


def expect_read_request(story) -> None:
    story.expect_success("skill write")
    codex = hook_agent(story, story.hook("s-2", HookSamples.session_start().with_fields(program="codex", session="s-2")))
    story.agent = codex
    path = story.container.get(SkillFiles).readable("journal-memory")
    answer = story.run(f"skill require {story.agent.id} journal-memory", actor=story.agent)
    assert answer.code == 0 and answer.output_text.strip().startswith("read this first: ") and "Skill tool" not in answer.output_text, answer.output_text
    raw = story.run(f"skill require {story.agent.id} journal-memory --json", actor=story.agent)
    assert raw.code == 0 and json.loads(raw.output_text)["state"] == "due", raw.output_text
    story.hook("s-2", HookSamples.tool_use("Read", ToolType.READ, [str(path)], None).with_fields(program="codex", session="s-2"))
    story.run_listeners()
    story.expect_success(f"skill require {story.agent.id} journal-memory", "loaded: journal-memory", actor=story.agent)


def expect_image_read(story) -> None:
    story.expect_success("skill write")
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(program="codex")))
    story.container.get(SkillRequirement).is_required = True
    home = story.home.folder
    (home.parent / ".journal").symlink_to(home, target_is_directory=True)
    binary = GoBuild.built("journal-hook", home.parent / "journal-hook")
    with server_story(story):
        story.expect_success(f"skill require {story.agent.id} journal-memory")
        for _ in range(SKILL_TOOL_USES + 2):
            codex_tool(binary, home, "apply_patch", {"patch": "*** Begin Patch\n*** Add File: preview.txt\n+new\n*** End Patch"})
        writes = list(story.container.get(Queries).query(HookCall).filter(tool="apply_patch").oldest().all_rows())
        assert len(writes) == SKILL_TOOL_USES + 2 and "read this first" in writes[-1].refusal, writes
        finished = codex_tool(binary, home, "view_image", {"path": str(home.parent / "preview.png")})
    assert finished.returncode == 0, finished.stderr
    calls = list(story.container.get(Queries).query(HookCall).filter(tool="view_image").all_rows())
    assert len(calls) == 1, (finished.stdout, finished.stderr)
    assert calls[0].refusal == "", calls[0]
    assert calls[0].summary == str(home.parent / "preview.png"), calls[0]


def codex_tool(binary, home, name: str, arguments: dict[str, str]):
    body = {"session_id": "s-1", "hook_event_name": "PreToolUse", "tool_name": name, "tool_input": arguments}
    return subprocess.run([str(binary), "codex", str(home.parent)], input=json.dumps(body), capture_output=True, text=True, cwd=home.parent, timeout=30,
                          env=GoBuild.environment(AGENT_JOURNAL_ACTIVE="1", JOURNAL_ENV="main", JOURNAL_ACTOR="agent"))


def expect_worker_commands(story) -> None:
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    opening = story.hook(session, HookSamples.session_start())
    assert "python3" in "\n".join(opening.lines), opening.lines
    line = SILENT_RUN.nudge(output=1, seconds=15, hint=StreamingHints.hint("python3 tools/deploy.py")).text
    assert "python3 -u" in line and "python -u" not in line, line
    story.expect_success("task overview 1", actor=worker)
    story.expect_success(f"skill require {worker.id} journal-memory", actor=worker)
    story.expect_success("skill write", actor=worker)
    rows = story.container.get(Queries).query(AgentSkill).filter(session_agent_id=worker.id, skill="journal-memory")
    assert next(rows.all_rows()).state is AgentSkillState.DUE
    code, text = story.synced()
    assert code == 0, text
    rows = story.container.get(Queries).query(AgentSkill).filter(session_agent_id=worker.id, skill="journal-memory")
    assert next(rows.all_rows()).state is AgentSkillState.DUE
    instructions = story.container.get(SkillFiles).readable("journal-workers").read_text()
    assert "skill write" in instructions and "module sync" in instructions and "same point" in instructions, instructions
    proof = story.new_row_id('proof make 1 --task 1 "Initial evidence"', actor=worker)
    story.expect_success('proof make 1 --task 1 "Corrected evidence"', actor=worker)
    story.expect_success(f"proof show {proof}", "text: Corrected evidence", actor=worker)
    story.expect_success(f"proof check {proof}", actor=story.agent)
    story.expect_refusal('proof make 1 --task 1 "Too late"', "checked already", actor=worker)
