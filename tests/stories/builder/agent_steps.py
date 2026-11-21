from journal.support.typed_lines import JOURNAL_PREFIX
from tests.stories.builder.story_agent import StoryAgent
import json
import shutil
import re
import shlex
import subprocess
from datetime import datetime, timezone
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from journal.engine.nudge import Nudge
from journal.version import VERSION
from journal.support.listener_queue import ListenerQueue
from journal.events.journal_updated import JournalUpdated
from journal.events.announcer import Announcer
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.repositories.sequences import Sequences
from journal.repositories.templates import Templates
from journal.support.time_source import TimeSource
from journal.features.health.support.journal_repository import JOURNAL_HOOK_SCRIPT
from journal.support.actor import Actor
from journal.providers.claude import Claude
from journal.providers.codex import Codex
from journal.repositories.command_outputs import CommandOutputs
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.restart_queue import RestartQueue
from journal.features.shell.support.shell_runner import ShellRunner
from journal.features.shell.support.chain_worker import ChainWorker
from journal.features.shell.support.shell_record import ShellRecord
from journal.hooks.support.hook_seats import HookSeats
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.support.caller import Caller
from journal.support.option import Option
from journal.support.plugin_tokens import PluginTokens
from journal.features.plugins.support.manifest_reader import MANIFEST
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.repositories.plugins import Plugins
from journal.features.skills.support.skill_files import HOMES, SKILL_FILE
from journal.features.shell.support.shell_runner import EXIT
from journal.engine.clock import Clock
from journal.http.controllers.hooks import FIRING_HEADER, SILENCE_HEADER
from journal.features.usage.support.process_usage_store import ProcessUsageStore
from journal.support.process_usage import ProcessUsage
from journal.repositories.agents import Agents
from journal.support.researcher_session import ResearcherSession
from journal.console.support.outcome import Outcome
from tests.full_project import MAIN
from tests.in_process import get_answer, posted
from tests.agent_hooks import pass_time
from tests.stories.builder.hook_verdict import HookVerdict
from urllib.request import Request as HttpRequest, urlopen
from tests.stories.builder.step_result import StepResult
from journal.http.support.project_check import PROJECT_HEADER
from journal.models.template import Template

# the longest a story waits on one git command of its own setup
GIT_TIMEOUT_SECONDS = 30

SUBAGENT_MODEL = "haiku"
# the plugin a story's publisher releases from a git folder of the project, and the journal it updated from
PLUGIN_SOURCE_FOLDER = "plugin-source"
RELEASED_PLUGIN = {"name": "tagged", "program": "run.py", "hears": []}
EARLIER_JOURNAL = "0.0.1"
# the status a session's status line reports in a story: its model, how full its context is and how much of its five hours it used
REPORTED_MODEL = "Opus"
REPORTED_CONTEXT_PERCENT = 20
REPORTED_FIVE_HOUR_PERCENT = 75
REPORTED_RESET_TIME = 2000000000
# how much later a new turn starts than the step before it
TURN_GAP_SECONDS = 1


class AgentSteps:
    """What the story's main agent does, each a sentence that plays the real hook or command for the story's provider: its tool uses and stops, its journal commands that make rows, its shell runs, its sessions, in this environment or another, as many tool uses as a setting allows, and a setting read as the viewer reads it; another environment of the project is made as its launcher makes one."""

    def agent_starts_a_session(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "agent starts a session", "SessionStart", source="startup")

    def agent_resumes_the_session(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "agent resumes its session", "SessionStart", source="resume")

    def agent_ends_the_session(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "agent ends its session", "SessionEnd", reason="exit")

    def agent_uses_the_providers_tool(self, agent: StoryAgent, tool: str, **tool_input) -> StepResult:
        return self.hooked(agent, f"agent uses {tool}", "PreToolUse", tool_name=tool, tool_input=tool_input)

    def agent_closes_its_turn(self, agent: StoryAgent, text: str) -> StepResult:
        return self.hooked(agent, "agent closes its turn", "MessageDisplay", delta=text, message_id=f"turn-{len(self.path)}", index=0, final=True)

    def agent_has_written(self, agent: StoryAgent, text: str, seconds_ago: float = 0) -> StepResult:
        written_at = datetime.fromtimestamp(self.app.container.get(Clock).held_at - seconds_ago, timezone.utc).isoformat().replace("+00:00", "Z")
        self.transcript_record(agent, {"type": "assistant", "timestamp": written_at, "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}})
        return self.observed(f"the {agent.role} writes a text block in its transcript", None, None)

    def agent_has_taken_a_queued_note(self, agent: StoryAgent, text: str) -> StepResult:
        self.transcript_record(agent, {"type": "queue-operation", "operation": "enqueue", "content": text})
        return self.observed(f"the {agent.role}'s transcript records a note queued for it", None, None)

    def another_session_sends(self, agent: StoryAgent, sender: str, text: str) -> StepResult:
        content = f'<cross-session-message from="uds:/tmp/cc-socks/1.sock" from-name="{sender}" from-mode="bypass">\n{text}\n</cross-session-message>'
        self.transcript_record(agent, {"type": "queue-operation", "operation": "enqueue", "content": content})
        return self.observed(f"another session's agent sends the {agent.role} a message", None, None)

    def a_claude_session_is_kept(self, session: str, prompt: str, reply: str) -> StepResult:
        folder = Claude.config_folder() / "projects" / Claude.folder_name(self.app.config.root)
        folder.mkdir(parents=True, exist_ok=True)
        rows = ({"type": "user", "message": {"content": prompt}, "timestamp": "2026-10-01T10:00:00Z"}, {"type": "assistant", "message": {"content": [{"type": "text", "text": reply}]}, "timestamp": "2026-10-01T10:01:00Z"})
        (folder / f"{session}.jsonl").write_text("".join(json.dumps(row) + "\n" for row in rows))
        return self.observed("a Claude Code session is kept in the project's folder", None, None)

    def transcript_record(self, agent: StoryAgent, record: dict) -> None:
        transcript = Claude.config_folder() / "projects" / Claude.folder_name(self.app.config.root) / f"{self.session_of(agent)}.jsonl"
        transcript.parent.mkdir(parents=True, exist_ok=True)
        with transcript.open("a") as lines:
            lines.write(json.dumps(record) + "\n")

    def agent_is_prompted(self, agent: StoryAgent, text: str) -> StepResult:
        return self.hooked(agent, "the user prompts the agent", "UserPromptSubmit", prompt=text)

    def agent_is_woken_by_the_typed_line(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "the line typed wakes the agent", "UserPromptSubmit", prompt=self.typed[-1] if self.typed else JOURNAL_PREFIX)

    def agent_is_prompted_in_a_new_turn(self, agent: StoryAgent, text: str) -> StepResult:
        pass_time(self.app, TURN_GAP_SECONDS)
        return self.agent_is_prompted(agent, text)

    def agent_looks_at_the_overview(self, agent: StoryAgent) -> StepResult:
        return self.agent_runs(agent, "environment overview")

    def agent_runs(self, agent: StoryAgent, line: str) -> StepResult:
        arguments = shlex.split(line)
        flags = [word for word in arguments if word.startswith("--")]
        outcome = self.app.console().run(arguments, self.caller_of(agent))
        return self.record_command(f"agent runs {' '.join(arguments[:2] + flags)}{', refused' if outcome.code else ''}", outcome)

    def command_from_a_shell_naming_no_session(self, line: str) -> StepResult:
        arguments = shlex.split(line)
        answer = posted(self.app, "/cli", {"argv": arguments, "env": "main", "agent": True, "provider": self.provider}, MAIN)[1]
        return self.record_command(f"a shell naming no session runs {' '.join(arguments[:2])}", Outcome(answer["code"], answer["text"], answer.get("error", "")))

    def command_from_a_shell(self, line: str, headers: dict, body: dict) -> StepResult:
        arguments = shlex.split(line)
        answer = posted(self.app, "/cli", {"argv": arguments, "env": "main", **body}, {**MAIN, **headers})[1]
        return self.record_command(f"a shell runs {' '.join(arguments[:2])}", Outcome(answer.get("code", 1), answer.get("text", ""), answer.get("error", "")))

    def another_projects_shell_runs(self, folder: str, line: str) -> StepResult:
        arguments = shlex.split(line)
        status, answer = posted(self.app, "/cli", {"argv": arguments, "env": "main", "agent": True, "provider": self.provider}, {**MAIN, PROJECT_HEADER: str(self.app.config.root.parent / folder)})
        return self.record_command(f"another project's shell runs {' '.join(arguments[:2])}", Outcome(answer.get("code", 1) if status < 300 else 1, answer.get("text", ""), answer.get("error", "")))

    def another_projects_agent_hooks(self, folder: str, type_name: str) -> StepResult:
        body = {"hook_event_name": type_name, "session_id": "another-project-session", "source": "startup"}
        return self.hook_observed("another project's agent posts a hook", *posted(self.app, f"/hooks/{self.provider}", body, {**MAIN, PROJECT_HEADER: str(self.app.config.root.parent / folder)}))

    def this_projects_shell_runs(self, line: str) -> StepResult:
        arguments = shlex.split(line)
        answer = posted(self.app, "/cli", {"argv": arguments, "env": "main", "agent": True, "provider": self.provider}, {**MAIN, PROJECT_HEADER: str(self.app.config.root)})[1]
        return self.record_command(f"this project's shell runs {' '.join(arguments[:2])}", Outcome(answer.get("code", 1), answer.get("text", ""), answer.get("error", "")))

    def subagent_runs_in_the_shell(self, subagent: str, line: str) -> StepResult:
        return self.hooked(self.agents.subject, f"a subagent runs in the shell {line.split()[0]}", "PreToolUse", agent_id=subagent, tool_name=self.tools.shell, tool_input={"command": line})

    def agent_reads(self, agent: StoryAgent, path: str = "a.py", count: int = 1) -> StepResult:
        for _ in range(count):
            self.hooked(agent, "agent reads", "PreToolUse", tool_name=self.tools.read, tool_input={"file_path": path})
        return self.last_step

    def agent_writes_in_one_firing(self, agent: StoryAgent, path: str, firing: str) -> StepResult:
        headers = {**self.headers_of(agent), FIRING_HEADER: firing}
        call = dict(tool_name=self.tools.write, tool_input={"file_path": path, "content": "x"})
        return self.hook_observed(f"agent writes in firing {firing}", *self.session_posted_hook(self.session_of(agent), headers, "PreToolUse", call))

    def agent_reads_after_the_journal_was_down(self, agent: StoryAgent, seconds: float) -> StepResult:
        silence_start = self.app.container.get(Clock).held_at - seconds
        headers = {**self.headers_of(agent), SILENCE_HEADER: str(silence_start)}
        call = dict(tool_name=self.tools.read, tool_input={"file_path": "a.py"})
        return self.hook_observed("agent reads after the journal was down", *self.session_posted_hook(self.session_of(agent), headers, "PreToolUse", call))

    def agent_has_run_in_the_shell(self, agent: StoryAgent, line: str) -> StepResult:
        return self.hooked(agent, f"agent has run in the shell {line.split()[0]}", "PostToolUse", tool_name=self.tools.shell, tool_input={"command": line}, tool_response={"stdout": self.shell_text, "stderr": ""})

    def agent_has_run_printing(self, agent: StoryAgent, line: str, printed: str) -> StepResult:
        return self.hooked(agent, f"agent has run in the shell {line.split()[0]}", "PostToolUse", tool_name=self.tools.shell, tool_input={"command": line}, tool_response={"stdout": printed, "stderr": ""})

    def agent_has_edited_a_file_holding(self, agent: StoryAgent, path: str, text: str) -> StepResult:
        return self.hooked(agent, "agent has edited", "PostToolUse", tool_name=self.tools.write, tool_input={"file_path": str(self.app.config.root / path), "content": text}, tool_response={"originalFile": text})

    def agent_has_read(self, agent: StoryAgent, path: str = "a.py") -> StepResult:
        return self.hooked(agent, "agent has read", "PostToolUse", tool_name=self.tools.read, tool_input={"file_path": path}, tool_response={})

    def agent_reads_part(self, agent: StoryAgent, path: str, limit: int) -> StepResult:
        return self.hooked(agent, "agent reads part of a file", "PreToolUse", tool_name=self.tools.read, tool_input={"file_path": path, "limit": limit})

    def agent_reads_skills_at_once(self, agent: StoryAgent, *folders: str) -> StepResult:
        def read(folder: str) -> tuple[int, object]:
            call = dict(tool_name=self.tools.read, tool_input={"file_path": str(self.app.config.root / HOMES[0] / folder / SKILL_FILE)}, tool_response={})
            return self.posted_hook(agent, "PostToolUse", **call)
        with ThreadPoolExecutor(len(folders)) as pool:
            answers = list(pool.map(read, folders))
        return self.hook_observed("agent has read skills at once", *answers[-1])

    def agent_loads_a_skill(self, agent: StoryAgent, name: str) -> StepResult:
        return self.hooked(agent, "agent loads a skill by the skill tool", "PostToolUse", tool_name="Skill", tool_input={"skill": name}, tool_response="")

    def agent_reads_a_skill(self, agent: StoryAgent, folder: str) -> StepResult:
        call = dict(tool_name=self.tools.read, tool_input={"file_path": str(self.app.config.root / HOMES[0] / folder / SKILL_FILE)})
        self.hooked(agent, "agent reads a skill", "PreToolUse", **call)
        return self.hooked(agent, "agent has read the skill", "PostToolUse", **call, tool_response={})

    def agent_cats_a_skill_through_the_runner(self, agent: StoryAgent, home: str, folder: str) -> StepResult:
        line = f"cat {home}/{folder}/{SKILL_FILE}"
        self.agent_runs_in_the_shell(agent, line)
        return self.agent_has_run_printing(agent, Codex.runner_command(line), "")

    def agent_writes(self, agent: StoryAgent, path: str) -> StepResult:
        return self.hooked(agent, "agent writes", "PreToolUse", tool_name=self.tools.write, tool_input={"file_path": path, "content": "x"})

    def agent_writes_from_a_hook_without_its_header(self, agent: StoryAgent, path: str) -> StepResult:
        call = {"tool_name": self.tools.write, "tool_input": {"file_path": path, "content": "x"}}
        return self.hook_observed("agent writes from a hook without its header", *self.session_posted_hook(self.hook_session_of(agent), {}, "PreToolUse", {**self.hook_fields_of(agent), **call}))

    def agent_has_edited(self, agent: StoryAgent, path: str) -> StepResult:
        patch = [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]
        return self.hooked(agent, "agent has edited", "PostToolUse", tool_name=self.tools.write, tool_input={"file_path": str(self.app.config.root / path), "content": "y"}, tool_response={"structuredPatch": patch})

    def agent_runs_in_its_own_background(self, agent: StoryAgent, line: str) -> StepResult:
        return self.hooked(agent, f"agent runs in its own background {line.split()[0]}", "PreToolUse", tool_name=self.tools.shell, tool_input={"command": line, "run_in_background": True})

    def agent_runs_in_the_shell(self, agent: StoryAgent, line: str) -> StepResult:
        return self.hooked(agent, f"agent runs in the shell {line.split()[0]}", "PreToolUse", tool_name=self.tools.shell, tool_input={"command": line})

    def agent_runs_in_the_shell_as_argv(self, agent: StoryAgent, *argv: str) -> StepResult:
        return self.hooked(agent, f"agent runs in the shell {argv[0]}", "PreToolUse", tool_name=self.tools.shell, tool_input={"command": list(argv)})

    def agent_sends_subagent(self, agent: StoryAgent, role: str, job: str) -> StepResult:
        return self.hooked(agent, "agent sends a subagent", "PreToolUse", tool_name=self.tools.subagent, tool_input={"subagent_type": role, "description": job, "task_name": job, "prompt": job, "model": SUBAGENT_MODEL})

    def an_older_journal_left_the_subagent_on_void(self, subagent: str) -> StepResult:
        session = ResearcherSession.joined(self.main_session(), subagent)
        with self.app.container.get(Scope).environment(1):
            agents = self.app.container.get(Agents)
            agents.save(agents.session_agent(session).with_(stack=({"state": "void", "data": {}},), state="void"), Actor.system())
        return self.observed("an older journal's end left the subagent's row resting on Void", None, None)

    def subagent_starts(self, subagent: str, role: str) -> StepResult:
        return self.hooked(self.agents.subject, "a subagent starts", "SubagentStart", agent_id=subagent, agent_type=role)

    def subagent_writes(self, subagent: str, path: str) -> StepResult:
        return self.hooked(self.agents.subject, "a subagent writes", "PreToolUse", agent_id=subagent, tool_name=self.tools.write, tool_input={"file_path": path, "content": "x"})

    def agent_sends_subagent_with(self, agent: StoryAgent, **tool_input) -> StepResult:
        return self.hooked(agent, "agent sends a subagent", "PreToolUse", tool_name=self.tools.subagent, tool_input=tool_input)

    def agent_sends_subagent_in_the_background(self, agent: StoryAgent, role: str, job: str, subagent: str) -> StepResult:
        call = f"dispatch-{subagent}"
        self.hooked(agent, "agent sends a subagent in the background", "PreToolUse", tool_name=self.tools.subagent, tool_use_id=call, tool_input={"subagent_type": role, "description": job, "prompt": job, "model": SUBAGENT_MODEL})
        return self.hooked(agent, "the subagent goes to the background", "PostToolUse", tool_name=self.tools.subagent, tool_use_id=call, tool_input={}, tool_response={"isAsync": True, "agentId": subagent})

    def agent_sends_subagent_that_fails(self, agent: StoryAgent, role: str, job: str, error: str) -> StepResult:
        call = f"failing-{len(self.path)}"
        self.hooked(agent, "agent sends a subagent", "PreToolUse", tool_name=self.tools.subagent, tool_use_id=call, tool_input={"subagent_type": role, "description": job, "prompt": job, "model": SUBAGENT_MODEL})
        return self.hooked(agent, "the subagent tool fails", "PostToolUseFailure", tool_name=self.tools.subagent, tool_use_id=call, tool_input={}, error=error)

    def agent_schedules_a_job(self, agent: StoryAgent, job: str) -> StepResult:
        created = {"cron": "7,22,37,52 * * * *", "prompt": "Journal health check", "recurring": True}
        self.hooked(agent, "agent schedules a job", "PreToolUse", tool_name="CronCreate", tool_use_id=f"create-{job}", tool_input=created)
        return self.hooked(agent, "the job is scheduled", "PostToolUse", tool_name="CronCreate", tool_use_id=f"create-{job}", tool_input=created, tool_response=f"Scheduled recurring job {job} (7,22,37,52 * * * *). Session-only.")

    def agent_deletes_the_job(self, agent: StoryAgent, job: str) -> StepResult:
        self.hooked(agent, "agent deletes a job", "PreToolUse", tool_name="CronDelete", tool_use_id=f"delete-{job}", tool_input={"id": job})
        return self.hooked(agent, "the job is deleted", "PostToolUse", tool_name="CronDelete", tool_use_id=f"delete-{job}", tool_input={"id": job}, tool_response=f"Cancelled job {job}.")

    def agent_messages_subagent(self, agent: StoryAgent, subagent: str, text: str) -> StepResult:
        call, words = f"message-{subagent}", {"to": subagent, "message": text}
        self.hooked(agent, "agent messages a subagent", "PreToolUse", tool_name="SendMessage", tool_use_id=call, tool_input=words)
        return self.hooked(agent, "the message reaches the subagent", "PostToolUse", tool_name="SendMessage", tool_use_id=call, tool_input=words, tool_response={})

    def subagent_ends(self, subagent: str) -> StepResult:
        return self.hooked(self.agents.subject, "a subagent ends", "SubagentStop", agent_id=subagent)

    def agent_turn_fails_on_the_usage_limit(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "the agent's turn fails on the usage limit", "StopFailure", error="rate_limit", last_assistant_message="You've hit your weekly limit · resets 11am (Europe/Amsterdam)")

    def agent_stops(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "agent stops", "Stop")

    def agent_stops_again(self, agent: StoryAgent) -> StepResult:
        return self.hooked(agent, "agent stops again after a held stop", "Stop", stop_hook_active=True)

    def agent_reads_message(self, agent: StoryAgent, message: int) -> StepResult:
        return self.agent_runs(agent, f"message read {message}")

    def agent_reacts(self, agent: StoryAgent, message: int, emoji: str) -> StepResult:
        return self.record_command("agent reacts", self.app.console().run(["message", "react", str(message), emoji], self.agent))

    def agent_replies(self, agent: StoryAgent, message: int, text: str) -> StepResult:
        return self.record_command("agent replies", self.app.console().run(["message", "send", text, "--reply-to", str(message)], self.agent))

    def hooked(self, agent: StoryAgent, action: str, type_name: str, **body) -> StepResult:
        return self.hook_observed(action, *self.posted_hook(agent, type_name, **body))

    def hook_observed(self, action: str, status: int, answer: object) -> StepResult:
        verdict = HookVerdict(self.provider, status, answer if isinstance(answer, dict) else {})
        return self.observed(f"{action}, {'refused' if verdict.refused() else 'let through'}", verdict, None)

    def agent_creates_task(self, agent: StoryAgent, title: str) -> int:
        self.agent_runs(agent, f"task create '{title}'")
        return self.task_number()

    def agent_creates_briefed_task(self, agent: StoryAgent, title: str, brief: str) -> int:
        self.agent_runs(agent, f"task create '{title}' --brief '{brief}'")
        return self.task_number()

    def agent_takes_a_task(self, agent: StoryAgent, title: str) -> int:
        self.agent_runs(agent, f"task create '{title}' --start")
        return self.task_number()

    def agent_writes_a_document(self, agent: StoryAgent, title: str, abstract: str, text: str) -> int:
        source = self.app.config.root / f"{title}.md"
        source.write_text(text)
        self.agent_runs(agent, f"doc create '{title}' --file '{source}' --abstract '{abstract}'")
        return int(re.search(r"doc (\d+)", self.command.text)[1])

    def agent_rewrites_the_document(self, agent: StoryAgent, document: int, text: str) -> StepResult:
        source = self.app.config.root / f"document {document} rewritten.md"
        source.write_text(text)
        return self.agent_runs(agent, f"doc update {document} --file '{source}'")

    def agent_asks(self, agent: StoryAgent, question: str, *options: str) -> int:
        self.agent_runs(agent, f"question ask '{question}' --options " + " ".join(f"'{option}'" for option in options))
        return int(re.search(r"question (\d+)", self.command.text)[1])

    def agent_replies_with_number(self, agent: StoryAgent, message: int, text: str) -> int:
        self.agent_replies(agent, message, text)
        return int(re.search(r"message (\d+)", self.command.text)[1])

    def agent_creates_plan(self, agent: StoryAgent, title: str, brief: str) -> int:
        self.agent_runs(agent, f"plan create '{title}' --brief '{brief}'")
        return self.created_number("plan")

    def agent_adds_plan_task(self, agent: StoryAgent, plan: int, title: str) -> int:
        self.agent_runs(agent, f"plan add {plan} '{title}' --brief '- {title} is done'")
        return self.created_number("task")

    def agent_creates_sequence(self, agent: StoryAgent, title: str, steps: str) -> int:
        self.agent_runs(agent, f"sequence create '{title}' --steps '{steps}'")
        return self.created_number("sequence")

    def created_number(self, noun: str) -> int:
        return int(re.search(rf"{noun} (\d+)", self.command.text)[1])

    def agent_adds_memory(self, agent: StoryAgent, text: str, weight: int) -> int:
        self.agent_runs(agent, f"memory add '{text}' --weight {weight}")
        return int(re.search(r"memory (\d+)", self.command.text)[1])

    def agent_answers(self, agent: StoryAgent, message: int, text: str) -> StepResult:
        self.agent_runs(agent, f"message read {message}")
        return self.agent_replies(agent, message, text)

    def task_number(self) -> int:
        return int(re.search(r"task (\d+)", self.command.text)[1])

    def agent_runs_a_command(self, agent: StoryAgent, line: str) -> int:
        raw = "".join(f"{name}={value}\0" for name, value in self.shell_variables_of(agent).items()) + f"\0{line}\n"
        request = HttpRequest(f"http://127.0.0.1:{self.app.server().port}/shell/run", data=raw.encode(), method="POST", headers={"Content-Type": "application/octet-stream", "X-Journal-Env": "main", "X-Journal-Cwd": str(self.app.config.root), "X-Journal-Shell": "sh"})
        newest = self.newest_output()
        text, _, code = urlopen(request, timeout=30).read().decode().rpartition(EXIT)
        self.shell_text, self.shell_exit = text, int(code.split()[0])
        self.shell_outputs = self.newest_output() - newest
        self.observed(f"agent runs a command {line.split()[0]}, {'failing' if self.shell_exit else 'passing'}", None, None)
        return self.newest_output()

    def newest_output(self) -> int:
        with self.app.container.get(Scope).environment(1):
            outputs = self.app.container.get(CommandOutputs)
            rows = outputs.selected(outputs.query().order_descending("id").limit(1))
        return rows[0].row_id if rows else 0

    def agent_has_a_background_run_printing(self, agent: StoryAgent, line: str, *printed: str) -> int:
        runner, caller = self.app.container.get(ShellRunner), self.seated_caller_of(agent)
        with self.app.container.get(Scope).environment(1):
            folder = runner.split_folder(line)
            runner.recorded(folder, line, caller, str(self.app.config.root))
            running = len(folder.kinds()) - 1
            for part in range(running):
                folder.ended_with(part, 0)
            (folder.folder / f"{running}.out").write_text("".join(f"{row}\n" for row in printed))
            runner.test_run_watched(folder, line, caller)
            self.shell_text = runner.background_move(folder, line, running, caller, 1, [])
        self.observed(f"agent has a background run {line.split()[0]}", None, None)
        return folder.number()

    def agent_has_a_watched_foreground_run(self, agent: StoryAgent, line: str) -> int:
        runner, caller = self.app.container.get(ShellRunner), self.seated_caller_of(agent)
        with self.app.container.get(Scope).environment(1):
            folder = runner.split_folder(line)
            runner.recorded(folder, line, caller, str(self.app.config.root))
            runner.test_run_watched(folder, line, caller)
        self.observed(f"agent has a watched foreground run {line.split()[0]}", None, None)
        return folder.number()

    def foreground_run_ends(self, agent: StoryAgent, output: int, status: int = 0) -> StepResult:
        with self.app.container.get(Scope).environment(1):
            folder = OutputFiles(Path(self.app.container.get(CommandOutputs).find(output).folder))
            folder.ended_with(len(folder.kinds()) - 1, status)
            self.app.container.get(ShellRecord).foreground_end(folder.folder.name, status, self.seated_caller_of(agent))
        return self.observed(f"the foreground run ends {'failing' if status else 'passing'}", None, None)

    def recorded_run_ends(self, output: int) -> StepResult:
        return self.recorded_run_ends_with(output, 0)

    def recorded_run_fails(self, output: int) -> StepResult:
        return self.recorded_run_ends_with(output, 1)

    def recorded_run_ends_with(self, output: int, status: int) -> StepResult:
        with self.app.container.get(Scope).environment(1):
            outputs = self.app.container.get(CommandOutputs)
            run = outputs.find(output)
            files = OutputFiles(Path(run.folder))
            files.ended_with(0, status)
            files.finish(status)
            outputs.save(run.ended_with(status, self.app.container.get(TimeSource).seconds()), Actor.system())
        return self.observed(f"the background run ends {'passing' if status == 0 else 'failing'}", None, None)

    def background_run_prints(self, output: int, *printed: str) -> StepResult:
        self.running_part_printed(output, *printed)
        return self.observed("the background run prints", None, None)

    def background_run_ends(self, agent: StoryAgent, output: int, *printed: str, status: int = 0) -> StepResult:
        folder = self.running_part_printed(output, *printed)
        folder.ended_with(len(folder.kinds()) - 1, status)
        with self.app.container.get(Scope).environment(1):
            self.app.container.get(ChainWorker).chain_ended(folder, status, self.seated_caller_of(agent))
        return self.observed(f"the background run ends {'failing' if status else 'passing'}", None, None)

    def running_part_printed(self, output: int, *printed: str) -> OutputFiles:
        with self.app.container.get(Scope).environment(1):
            folder = OutputFiles(Path(self.app.container.get(CommandOutputs).find(output).folder))
        with (folder.folder / f"{len(folder.kinds()) - 1}.out").open("a") as stream:
            stream.write("".join(f"{row}\n" for row in printed))
        return folder

    def seated_caller_of(self, agent: StoryAgent) -> Caller:
        with self.app.container.get(Scope).environment(1):
            return self.app.container.get(HookSeats).caller_seated(self.caller_of(agent))

    def output_count(self) -> int:
        with self.app.container.get(Scope).environment(1):
            outputs = self.app.container.get(CommandOutputs)
            return outputs.counted(outputs.query())

    def another_environment(self, name: str) -> str:
        self.app.container.get(Environments).ensure(name)
        self.observed(f"the project has another environment, {name}", None, None)
        return name

    def task_numbers_in(self, environment: str) -> set[int]:
        return set(self.task_states_in(environment))

    def task_states_in(self, environment: str) -> dict[int, str]:
        return {row["id"]: row["state"] for row in get_answer(self.app, "/journal/tasks", {"X-Journal-Env": environment})[1]["rows"]}

    def plugin_runs(self, plugin: str, line: str) -> StepResult:
        return self.plugin_runs_with_token(plugin, self.app.container.get(PluginTokens).build(plugin), line)

    def plugin_runs_with_token(self, plugin: str, token: str, line: str) -> StepResult:
        arguments = shlex.split(line)
        status, answer = posted(self.app, "/cli", {"argv": arguments, "env": "main", "plugin": plugin, "token": token}, MAIN)
        outcome = Outcome(answer["code"], answer["text"], answer.get("error", "")) if status < 300 else Outcome(status, "", answer.get("error", ""))
        return self.record_command(f"the plugin runs {' '.join(arguments[:2])}", outcome)

    def plugin_folder_copied(self, source: Path) -> Path:
        copy = self.app.config.root / "plugin-sources" / source.name
        shutil.copytree(source, copy, ignore=shutil.ignore_patterns("__pycache__"))
        self.observed(f"the user has a copy of plugin {source.name} in a folder of their own", None, None)
        return copy

    def plugin_manifest_written(self, plugin: str, text: str) -> StepResult:
        installed = self.app.container.get(Plugins).lookup(plugin)
        (self.app.container.get(PluginFolders).folder(installed) / MANIFEST).write_text(text)
        return self.observed(f"the manifest of plugin {plugin} is written over", None, None)

    def plugin_secret(self, plugin: str) -> int:
        return next(row["settings"]["token"]["secret"] for row in get_answer(self.app, "/journal/plugins", MAIN)[1]["rows"] if row["name"] == plugin)

    def secret_variable(self, secret: int) -> str:
        return self.api_row("secrets", secret)["fields"][0]["variable"]

    def plugin_number(self, plugin: str) -> int:
        return next(row["id"] for row in get_answer(self.app, "/journal/plugins", {"X-Journal-Env": "main"})[1]["rows"] if row["name"] == plugin)

    def agent_in_runs(self, agent: StoryAgent, environment: str, session: str, line: str) -> StepResult:
        arguments = shlex.split(line)
        return self.record_command(f"the agent in {environment} runs {' '.join(arguments[:2])}", self.app.console().run(arguments, Caller.agent(environment, session, self.provider)))

    def agent_in_starts_task(self, agent: StoryAgent, environment: str, session: str, title: str) -> int:
        self.session_starts_in(environment, session)
        outcome = self.app.console().run(["task", "create", title, "--start"], Caller.agent(environment, session, self.provider))
        assert outcome.code == 0, outcome.error
        return max(self.task_numbers_in(environment))

    def session_starts_in(self, environment: str, session: str) -> StepResult:
        status, answer = posted(self.app, f"/hooks/{self.provider}", {"hook_event_name": "SessionStart", "session_id": session, "source": "startup"}, {"X-Journal-Env": environment})
        return self.observed(f"a session starts in {environment}", HookVerdict(self.provider, status, answer if isinstance(answer, dict) else {}), None)

    def expect_told_in(self, environment: str, nudge: Nudge, **values) -> None:
        lines = self.log.environment_lines(environment)
        assert any(line.matches(nudge.key, values) for line in lines), f"the agent in {environment} was not told {nudge.key} {values}: told {[(line.key, line.values) for line in lines]}"

    def second_session_starts(self, session: str = "s2") -> StepResult:
        return self.session_starts_with(self.provider, session)

    def replaced_session_stops(self, session: str) -> StepResult:
        return self.hook_observed(f"the replaced session {session} stops", *posted(self.app, f"/hooks/{self.provider}", {"hook_event_name": "Stop", "session_id": session}, MAIN))

    def status_line_reports(self) -> StepResult:
        home = self.app.config.status_home
        home.mkdir(parents=True, exist_ok=True)
        status = {"model": {"display_name": REPORTED_MODEL}, "context_window": {"used_percentage": REPORTED_CONTEXT_PERCENT},
                  "rate_limits": {"five_hour": {"used_percentage": REPORTED_FIVE_HOUR_PERCENT, "resets_at": REPORTED_RESET_TIME}}}
        (home / f"{self.main_session()}.json").write_text(json.dumps(status))
        return self.observed("the session's status line reports its model, context and allowance", None, None)

    def expect_agent_bar_reported(self) -> None:
        self.expect_agent_bar(REPORTED_MODEL, REPORTED_CONTEXT_PERCENT, [REPORTED_FIVE_HOUR_PERCENT])

    def expect_agent_bar_empty(self) -> None:
        self.expect_agent_bar("", None, [])

    def expect_agent_bar(self, model: str, context: int | None, usage: list[int]) -> None:
        row = get_answer(self.app, "/journal/summary", MAIN)[1]["environments"][0]["agent"]
        shown = (row.get("model"), row.get("context"), [window["used"] for window in row.get("usage") or []])
        assert shown == (model, context, usage), f"the agent bar shows model, context and allowance {shown}, not {(model, context, usage)}"

    def other_provider_session_starts(self, session: str = "s3") -> StepResult:
        return self.session_starts_with(next(program.name for program in (Claude, Codex) if program.name != self.provider), session)

    def session_starts_with(self, provider: str, session: str) -> StepResult:
        status, answer = posted(self.app, f"/hooks/{provider}", {"hook_event_name": "SessionStart", "session_id": session, "source": "startup"}, MAIN)
        self.replace_main_session(session, provider)
        return self.observed(f"a {'second' if provider == self.provider else 'another provider'}'s session starts", HookVerdict(provider, status, answer if isinstance(answer, dict) else {}), None)

    def expect_agent_session(self, session: str) -> None:
        sessions = [row.get("session") for row in get_answer(self.app, "/journal/agents", MAIN)[1]["rows"] if row.get("role") in (None, "main")]
        assert sessions == [session], f"the environment's agents hold the sessions {sessions}, not only {session}"

    def repeat(self, count: int, step: Callable[[], None]) -> None:
        for _ in range(count):
            step()

    def agent_consumes(self, agent: StoryAgent, option: Option) -> None:
        for _ in range(int(self.setting(option))):
            self.agent_reads(agent, )
            self.last_step.expect_allowed()

    def setting_seconds(self, option: Option) -> float:
        return float(self.setting(option)) * 60

    def setting(self, option: Option) -> object:
        top, _, name = option.key.partition(".")
        group = get_answer(self.app, "/journal/settings", MAIN)[1].get(top, {})
        return group.get(name, option.default)

    def project_root(self) -> str:
        return str(self.app.config.root)

    def project_file_holding(self, name: str, text: str) -> StepResult:
        path = self.app.config.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        return self.observed(f"the project holds {name}", None, None)

    def project_path(self, name: str) -> str:
        return str(self.app.config.root / name)

    def project_script_holding(self, name: str, text: str) -> None:
        self.project_file_holding(name, text)
        (self.app.config.root / name).chmod(0o755)

    def agent_processes_sampled(self, agent: StoryAgent, usage: ProcessUsage) -> StepResult:
        agent = self.app.container.get(Agents).session_agent(self.main_session())
        self.app.container.get(ProcessUsageStore).replaced({(agent.environment_id, agent.session): usage}, {})
        return self.observed("the machine is sampled for the agent", None, None)

    def project_folder_lost(self, name: str) -> StepResult:
        shutil.rmtree(self.app.config.root / name)
        return self.observed(f"the project lost {name}", None, None)

    def project_link_dangling(self, name: str) -> StepResult:
        path = self.app.config.root / name
        shutil.rmtree(path, ignore_errors=True)
        path.symlink_to(self.app.config.root / "nowhere")
        return self.observed(f"the project has a dangling link at {name}", None, None)

    def project_file(self, name: str, line_count: int) -> str:
        path = self.app.config.root / name
        path.write_text("".join(f"line {number}\n" for number in range(line_count)))
        return str(path)

    def plugin_release_published(self, version: str) -> StepResult:
        folder = self.app.config.root / PLUGIN_SOURCE_FOLDER
        first = not folder.is_dir()
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "run.py").write_text("print()")
        (folder / "journal-plugin.json").write_text(json.dumps({**RELEASED_PLUGIN, "version": version}))
        if first:
            self.git_in(folder, "init", "-q", "-b", "main")
        self.git_in(folder, "add", "-A")
        self.git_in(folder, "-c", "user.email=story@example.com", "-c", "user.name=Story", "commit", "-q", "-m", f"release {version}")
        self.git_in(folder, "tag", f"v{version}")
        return self.observed(f"the plugin's publisher releases version {version}", None, None)

    def plugin_source(self) -> str:
        return f"file://{self.app.config.root / PLUGIN_SOURCE_FOLDER}"

    def user_restarts_the_journal(self) -> StepResult:
        with self.app.container.get(Scope).environment(1):
            self.app.container.get(RestartQueue).restart(1, "")
        return self.observed("the user restarts the journal while a run goes", None, None)

    def journal_starts_again(self) -> StepResult:
        runtime = self.app.runtime()
        for feature in runtime.registry.features:
            for seed in feature.seeds:
                runtime.seeded(seed)
        runtime.compactions_closed()
        self.app.container.get(ProfileFiles).write_all()
        return self.observed("the journal starts again", None, None)

    def an_older_journal_wrote_the_template(self, title: str, brief: str) -> StepResult:
        templates = self.app.container.get(Templates)
        shipped = next(template for template in templates.all() if template.title == title)
        templates.save(shipped.with_(brief=brief), Actor.system())
        return self.observed("an older journal wrote a shipped template", None, None)

    def an_older_journal_left_a_copy_of_the_template(self, title: str, brief: str) -> StepResult:
        self.app.container.get(Templates).save(Template(title=title, brief=brief), Actor.user(1))
        return self.observed("an older journal left a copy of a shipped template, written as the user", None, None)

    def an_older_journal_shipped_the_template(self, title: str, brief: str) -> StepResult:
        self.app.container.get(Templates).save(Template(title=title, brief=brief), Actor.system())
        return self.observed("an older journal shipped a template this one no longer ships", None, None)

    def an_older_journal_wrote_the_sequence(self, title: str, steps: tuple) -> StepResult:
        sequences = self.app.container.get(Sequences)
        shipped = next(sequence for sequence in sequences.all() if sequence.title == title)
        sequences.save(shipped.with_(steps=steps), Actor.system())
        return self.observed("an older journal wrote a shipped sequence", None, None)

    def the_project_holds_a_skill(self, name: str, files: dict[str, str]) -> StepResult:
        for path, text in files.items():
            (self.app.config.root / ".claude/skills" / name / path).parent.mkdir(parents=True, exist_ok=True)
            (self.app.config.root / ".claude/skills" / name / path).write_text(text)
        return self.observed("the project holds a skill of its own", None, None)

    def the_project_is_the_journals_own_repository(self) -> StepResult:
        hook_script = self.app.config.root / JOURNAL_HOOK_SCRIPT
        hook_script.parent.mkdir(parents=True, exist_ok=True)
        hook_script.write_text("#!/bin/sh\n")
        return self.observed("the project is the journal's own repository", None, None)

    def a_hook_went_around_the_journal(self) -> StepResult:
        (self.app.config.home / "runtime").mkdir(parents=True, exist_ok=True)
        with (self.app.config.home / "runtime" / "bypass.log").open("a") as log:
            log.write(f"{int(self.app.container.get(TimeSource).seconds())} hook {self.provider}\n")
        return self.observed("a hook went around the journal", None, None)

    def a_shell_line_went_around_the_journal(self, line: str) -> StepResult:
        (self.app.config.home / "runtime").mkdir(parents=True, exist_ok=True)
        with (self.app.config.home / "runtime" / "bypass.log").open("a") as log:
            log.write(f"{int(self.app.container.get(TimeSource).seconds())} shell {line}\n")
        return self.observed("a shell line ran around the journal", None, None)

    def the_supervisor_stopped_without_closing_its_inbox(self, agent: StoryAgent) -> StepResult:
        inbox = self.inbox_file()
        inbox.parent.mkdir(parents=True, exist_ok=True)
        inbox.write_text(json.dumps({"socket": str(inbox.parent / "gone.sock"), "protocol": 1}))
        return self.observed("the supervisor stopped without closing its inbox", None, None)

    def the_supervisor_closed_its_inbox(self, agent: StoryAgent) -> StepResult:
        self.inbox_file().unlink(missing_ok=True)
        return self.observed("the supervisor closed its inbox", None, None)

    def inbox_file(self) -> Path:
        environment_id = self.app.container.get(Agents).session_agent(self.main_session()).environment_id
        return self.app.config.home / "runtime" / "inboxes" / self.app.container.get(Environments).find(environment_id).name

    def the_project_holds_a_file(self, path: str, data: bytes) -> StepResult:
        (self.app.config.root / path).write_bytes(data)
        return self.observed("the project holds a file", None, None)

    def the_project_file_is_removed(self, path: str) -> StepResult:
        (self.app.config.root / path).unlink()
        return self.observed("a project file is removed", None, None)

    def the_skill_folder_is_removed(self, name: str) -> StepResult:
        shutil.rmtree(self.app.config.root / ".claude/skills" / name)
        return self.observed("the skill's folder is removed", None, None)

    def a_shipped_profiles_file_was_changed(self, name: str, body: str) -> StepResult:
        (self.app.container.get(ProfileFiles).folder() / f"{name}.md").write_text(f"---\nname: {name}\n---\n{body}\n")
        return self.observed("a shipped profile's file was changed", None, None)

    def journal_starts_after_an_update(self) -> StepResult:
        self.app.container.get(Announcer).announce(JournalUpdated(previous=EARLIER_JOURNAL, current=VERSION))
        self.app.container.get(ListenerQueue).drain()
        return self.observed("the journal starts after an update", None, None)

    @staticmethod
    def git_in(folder: Path, *arguments: str) -> None:
        subprocess.run(["git", *arguments], cwd=folder, capture_output=True, timeout=GIT_TIMEOUT_SECONDS, check=True)

    def project_is_a_git_repository(self) -> StepResult:
        for arguments in (["init", "-q", "-b", "main"], ["-c", "user.email=story@example.com", "-c", "user.name=Story", "commit", "-q", "--allow-empty", "-m", "start"]):
            subprocess.run(["git", *arguments], cwd=self.app.config.root, capture_output=True, timeout=GIT_TIMEOUT_SECONDS, check=True)
        return self.observed("the project is a git repository", None, None)
