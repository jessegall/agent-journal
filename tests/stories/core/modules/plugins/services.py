import pytest

import json
from pathlib import Path
import os
import shutil
import signal
from datetime import timedelta
from threading import Event, Thread
import subprocess

from engine.actor.actor import Actor
from engine.file.file_access import FileAccess
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.support.plugin_program import SETTINGS_FILE
from core.modules.skills.support.loaded_skills import LoadedSkills
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.plugins.commands.support.plugin_health_check import PluginHealthCheck
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.orphan_services import OrphanServices
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.event_stories import plugin_row
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.hooks import start_counter
from tests.stories.core.modules.plugins.support.service_samples import SERVICE, service_plugin_folder
from core.modules.plugins.models.plugin import Plugin
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.plugins.support.plugin_event_entry import CEILING_SETTING
from core.modules.plugins.support.plugin_services import CONDITION_LIMIT_SETTING

END_LIMIT_SECONDS = 5
SERVED = ("served", "answers")
REMOVAL_PART = ShellPart("rm", CommandCategory.EDIT, ["-rf", "build"], effects=[CommandEffect.DELETES_FILES])


def served_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {service_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.run(f"setting set {CEILING_SETTING} 5000 --project", actor=story.user)
    story.services, story.processes = story.container.get(PluginServices), ServiceProcesses()
    story.services.follow(story.processes)
    return story


def test_an_upgrade_starts_the_service_again_with_the_new_code_before_it_reports_done(new_story):
    story = new_story(fixture=BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    source = service_plugin_folder(story.home.folder.parent)
    story.run(f"plugin install {source} --yes", actor=story.user)
    processes = ServiceProcesses.shared(story.home)
    processes.serving = True
    try:
        story.container.get(PluginServices).follow(processes)
        first = processes.running[("served", "answers")]
        manifest = json.loads((source / "journal-plugin.json").read_text())
        (source / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "1.1.0"}))
        upgraded = story.run("plugin upgrade served --yes", actor=story.user)
        second = processes.running[("served", "answers")]
        story.expect_rows(upgraded.code == 0, second.pid != first.pid, second.running(), not first.running(), detail=upgraded.output_text)
        story.expect_success("plugin service-log served answers --lines 1", actor=story.user)
    finally:
        processes.close()


def expect_service_refusal(story, sample):
    story.expect_hook_refusal("s-1", sample, "plugin:1 refused")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin served] the service says no", actor=story.agent)


def test_a_line_of_four_parts_reaches_the_service_as_four_events_and_starts_no_program(new_story, monkeypatch):
    story = served_story(new_story)
    try:
        starts = start_counter(monkeypatch, "run.sh")
        expect_service_refusal(story, four_parts(REMOVAL_PART))
        served_lines = (story.home.folder / "plugin-data" / "served" / "asked").read_text().splitlines()
        story.expect_rows(len(served_lines) == 1, len(json.loads(served_lines[0])["events"]) == 4, starts == [], detail=str(served_lines))
    finally:
        story.processes.close()


def test_a_line_of_four_parts_reads_the_agent_and_its_skills_as_a_line_of_one_part_does_and_writes_the_settings_once(new_story, monkeypatch):
    story = served_story(new_story)
    try:
        call_counts = counted_calls(monkeypatch)
        expect_service_refusal(story, HookSamples.shell("rm -rf build", REMOVAL_PART))
        single_part_counts = dict(call_counts)
        call_counts.update(settings=0, agent=0, skills=0)
        expect_service_refusal(story, four_parts(REMOVAL_PART))
        served_events = [json.loads(line) for line in (story.home.folder / "plugin-data" / "served" / "asked").read_text().splitlines()]
        story.expect_rows([event["data"]["position"] for event in served_events[-1]["events"]] == [0, 1, 2, 3], single_part_counts["skills"] == 1, call_counts["agent"] == single_part_counts["agent"], call_counts["skills"] == 1, single_part_counts["settings"] + call_counts["settings"] <= 1)
    finally:
        story.processes.close()


def counted_calls(monkeypatch) -> dict[str, int]:
    call_counts = {"settings": 0, "agent": 0, "skills": 0}
    file_writer, find, names = FileAccess.write, AgentRows.find, LoadedSkills.names

    def counted_write(self, file, *arguments, **options):
        call_counts["settings"] += 1 if Path(file).name == SETTINGS_FILE else 0
        return file_writer(self, file, *arguments, **options)

    def counted_find(self, agent_id):
        call_counts["agent"] += 1
        return find(self, agent_id)

    def counted_names(self, agent_id):
        call_counts["skills"] += 1
        return names(self, agent_id)

    monkeypatch.setattr(FileAccess, "write", counted_write)
    monkeypatch.setattr(AgentRows, "find", counted_find)
    monkeypatch.setattr(LoadedSkills, "names", counted_names)
    return call_counts


def test_a_line_of_four_parts_starts_no_program_while_the_service_is_closed(new_story, monkeypatch):
    story = served_story(new_story)
    story.processes.close()
    starts = start_counter(monkeypatch, "run.sh")
    story.expect_hook_allowed("s-1", four_parts(ShellPart("whoami", CommandCategory.READ, [])))
    story.expect_hook_allowed("s-1", four_parts(ShellPart("whoami", CommandCategory.READ, [])))
    served = plugin_row(story, "served")
    story.expect_rows(starts == [], served.fault_count == 0, not served.failing)
    story.expect_text("plugin list", "last fault: its service answers is closed, so the event went through unjudged at command_starting", actor=story.user)


def test_a_delivery_runs_the_program_while_the_service_is_closed_and_records_no_fault(new_story, monkeypatch):
    story = served_story(new_story)
    story.processes.close()
    starts = start_counter(monkeypatch, "run.sh")
    scanned_edit(story, "s-1", "a.py")
    story.run_listeners()
    served = plugin_row(story, "served")
    story.expect_rows(starts == ["served"], served.fault_count == 0, served.last_fault == "")


def four_parts(last: ShellPart):
    return HookSamples.shell(f"ls && pwd && date && {last.program} {' '.join(last.arguments)}", *(ShellPart(name, CommandCategory.READ, []) for name in ("ls", "pwd", "date")), last)


def test_the_services_read_names_each_service_and_whether_it_runs(new_story):
    story = served_story(new_story)
    try:
        story.expect_text("plugin services", "served answers: running")
    finally:
        story.processes.close()
    story.expect_text("plugin services", "served answers: stopped")


def test_a_service_is_started_again_once_the_files_of_its_plugin_changed(new_story):
    story = served_story(new_story)
    try:
        first = story.processes.running[("served", "answers")]
        story.services.follow(story.processes)
        story.expect_rows(story.processes.running[("served", "answers")].pid == first.pid)
        code = story.container.get(PluginFolders).code("served")
        (code / "journal-plugin.json").write_text((code / "journal-plugin.json").read_text() + "\n")
        upgraded = PluginDigest.digest(code, PluginManifest.read(code))
        story.container.get(Database).update(Statement("UPDATE plugins SET files_digest = ?, version = version + 1 WHERE name = 'served'", [upgraded]))
        story.services.follow(story.processes)
        second = story.processes.running[("served", "answers")]
        story.expect_rows(second.pid != first.pid, second.running(), not first.running())
    finally:
        story.processes.close()


def server_kept_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {service_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.run(f"setting set {CEILING_SETTING} 5000 --project", actor=story.user)
    story.services, story.processes = story.container.get(PluginServices), ServiceProcesses.shared(story.home)
    story.processes.serving = True
    story.services.follow(story.processes)
    return story


@pytest.fixture
def controlled_service(new_story):
    story = server_kept_story(new_story)
    yield story
    story.processes.close()


def test_stopping_a_service_ends_it_and_says_it_stopped(controlled_service):
    story = controlled_service
    process = story.processes.running[SERVED]
    story.expect_text("plugin service stop served answers", "served answers: stopped", actor=story.user)
    process.wait(5)
    story.expect_rows(not process.running(), SERVED not in story.processes.running)
    story.expect_text("plugin services", "served answers: stopped", actor=story.user)


@pytest.mark.parametrize("line, reason", [
    ("plugin service stop served missing", "plugin served has no running service missing"),
    ("plugin service restart absent answers", "plugin absent has no running service answers"),
])
def test_a_service_the_journal_does_not_run_is_refused(controlled_service, line, reason):
    story = controlled_service
    story.expect_refusal(line, reason, actor=story.user)
    story.expect_rows(story.processes.running[SERVED].running())


def test_switching_a_plugin_off_and_on_starts_its_stopped_service(controlled_service):
    story = controlled_service
    story.run("plugin service stop served answers", actor=story.user)
    story.run("plugin disable served", actor=story.user)
    story.services.follow(story.processes)
    story.run("plugin enable served", actor=story.user)
    story.services.follow(story.processes)
    story.expect_rows(story.processes.running[SERVED].running())


def test_removing_a_plugin_has_stopped_its_services_when_it_reports_done(controlled_service):
    story = controlled_service
    process = story.processes.running[SERVED]
    story.expect_success("plugin remove served", actor=story.user)
    story.expect_rows(not process.running(), SERVED not in story.processes.running)


def test_a_service_that_answers_its_health_check_leaves_the_plugin_without_a_fault(new_story):
    story = served_story(new_story)
    try:
        story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_absent("plugin list", "last fault", actor=story.user)
    finally:
        story.processes.close()


def test_a_health_check_missed_is_the_plugins_fault_and_starts_the_service_again(new_story):
    story = served_story(new_story)
    try:
        first = story.processes.running[("served", "answers")]
        (story.home.folder / "plugin-data" / "served" / "unwell").write_text("")
        story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_text("plugin list", "last fault: its service answers missed its health check", actor=story.user)
        story.expect_rows(story.processes.running[("served", "answers")].pid != first.pid)
    finally:
        story.processes.close()


def test_five_health_checks_missed_in_a_row_show_the_plugin_failing(new_story):
    story = served_story(new_story)
    try:
        (story.home.folder / "plugin-data" / "served" / "unwell").write_text("")
        for _ in range(5):
            story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_text("chat-mark list --environment 1", "Plugin served is failing: its service answers missed its health check", actor=story.user)
    finally:
        story.processes.close()


def is_running(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    return True


def conditioned_story(new_story, condition: str):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = service_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    manifest["services"][0]["when"] = condition
    (folder / "journal-plugin.json").write_text(json.dumps(manifest))
    story.run(f"plugin install {folder} --yes", actor=story.user)
    story.run(f"setting set {CONDITION_LIMIT_SETTING} 1 --project", actor=story.user)
    story.services, story.processes = story.container.get(PluginServiceRound), ServiceProcesses()
    return story


@pytest.fixture
def unready_service(new_story):
    return conditioned_story(new_story, "false")

@pytest.fixture
def delayed_service(new_story):
    return conditioned_story(new_story, 'test -f "$JOURNAL_PLUGIN_DATA/ready"')



def test_a_service_whose_condition_kept_it_from_starting_is_not_listed(unready_service):
    story = unready_service
    try:
        story.services.run(story.processes)
        story.expect_absent("plugin services", "served answers")
    finally:
        story.processes.close()


def test_a_service_started_by_an_exec_script_lists_by_health_and_keeps_stderr(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = service_plugin_folder(story.home.folder.parent)
    manifest_path = folder / "journal-plugin.json"
    manifest = json.loads(FileAccess.read(manifest_path))
    manifest["services"][0]["command"] = ["start.sh"]
    FileAccess.write(manifest_path, json.dumps(manifest))
    script = folder / "start.sh"
    FileAccess.write(script, '#!/bin/sh\necho "service diagnostic" >&2\nexec ./serve.py\n')
    script.chmod(0o755)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    services, processes = story.container.get(PluginServices), ServiceProcesses()
    try:
        services.follow(processes)
        story.expect_text("plugin services", "served answers: running")
        story.expect_text("plugin service-log served answers --lines 1", "service diagnostic")
        FileAccess.write(story.home.folder / "plugin-data" / "served" / "unwell", "")
        story.expect_text("plugin services", "served answers: stopped")
        services.check_health(processes)
        story.expect_rows("plugin served service answers restarted after a missed health check" in FileAccess.read(story.home.system_log))
        process = processes.running[("served", "answers")]
        os.kill(process.pid, signal.SIGKILL)
        process.wait(5)
        story.expect_text("plugin services", "served answers: stopped")
        services.follow(processes)
        story.expect_rows("plugin served service answers restarted after exit" in FileAccess.read(story.home.system_log))
    finally:
        processes.close()


def test_a_plugin_an_agent_installs_through_the_persons_approval_has_its_services_started_without_an_enable(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = service_plugin_folder(story.home.folder.parent)
    manifest_path = folder / "journal-plugin.json"
    manifest = json.loads(FileAccess.read(manifest_path))
    manifest["installed"] = "touch run.sh; echo '{}'"
    FileAccess.write(manifest_path, json.dumps(manifest))
    story.expect_refusal(f"plugin install {folder} --yes --reason needed", "A user was asked in the dock", actor=story.agent)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(story.container.get(Queries).query(ApprovalRequest).first().id)])
    services, processes = story.container.get(PluginServices), ServiceProcesses()
    try:
        services.follow(processes)
        story.expect_text("plugin services", "served answers: running")
        story.expect_rows(list(processes.running) == [("served", "answers")])
    finally:
        processes.close()


FAILING_SERVICE = "#!/bin/sh\nexit 1\n"


def rewritten_service(story, text: str) -> None:
    path = story.container.get(PluginFolders).code("served") / "serve.py"
    path.write_text(text)
    path.chmod(0o755)


def failed_round(story) -> None:
    running = story.processes.running.get(("served", "answers"))
    if running is not None:
        running.wait(END_LIMIT_SECONDS)
    story.services.run(story.processes)


def test_a_service_that_fails_again_and_again_is_tried_after_a_growing_pause_and_the_user_hears_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {service_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    rewritten_service(story, FAILING_SERVICE)
    story.services, story.processes = story.container.get(PluginServiceRound), ServiceProcesses()
    try:
        story.services.run(story.processes)
        failed_round(story)
        first_retry = story.processes.running[("served", "answers")]
        failed_round(story)
        story.expect_rows(("served", "answers") not in story.processes.running, detail="a second failure in a row waits before the next try")
        story.advance(timedelta(seconds=31))
        failed_round(story)
        story.expect_rows(story.processes.running[("served", "answers")].pid != first_retry.pid)
        failed_round(story)
        story.run_listeners()
        story.expect_text("plugin list", "last fault: its service answers keeps failing to run: it ended with exit 1", actor=story.user)
        for _ in range(3):
            story.advance(timedelta(minutes=11))
            failed_round(story)
        story.run_listeners()
        story.expect_rows(story.container.get(Queries).query(Plugin).first().fault_count == 1)
        rewritten_service(story, SERVICE)
        failed_round(story)
        story.advance(timedelta(minutes=11))
        story.services.run(story.processes)
        story.expect_rows(story.processes.running[("served", "answers")].running())
    finally:
        story.processes.close()


def test_a_service_that_cannot_start_does_not_stop_the_round_and_is_told_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {service_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    (story.container.get(PluginFolders).code("served") / "serve.py").unlink()
    story.services, story.processes = story.container.get(PluginServiceRound), ServiceProcesses()
    try:
        for _ in range(4):
            story.services.run(story.processes)
            story.advance(timedelta(minutes=11))
        story.run_listeners()
        story.expect_rows(("served", "answers") not in story.processes.running)
        story.expect_text("plugin list", "keeps failing to run: it could not start", actor=story.user)
        story.expect_rows(story.container.get(Queries).query(Plugin).first().fault_count == 1)
    finally:
        story.processes.close()


def changed_plugin_files(story) -> None:
    code = story.container.get(PluginFolders).code("served")
    (code / "journal-plugin.json").write_text((code / "journal-plugin.json").read_text() + "\n")
    upgraded = PluginDigest.digest(code, PluginManifest.read(code))
    story.container.get(Database).update(Statement("UPDATE plugins SET files_digest = ?, version = version + 1 WHERE name = 'served'", [upgraded]))


def test_a_restart_with_the_plugin_folder_replaced_leaves_one_service_running(new_story):
    story = served_story(new_story)
    leftover = story.processes.running[("served", "answers")]
    code = story.container.get(PluginFolders).code("served")
    replaced = code.with_name(f"{code.name}.old")
    shutil.copytree(code, replaced)
    shutil.rmtree(code)
    shutil.copytree(replaced, code)
    changed_plugin_files(story)
    after_restart = ServiceProcesses()
    try:
        story.services.follow(after_restart)
        current = after_restart.running[("served", "answers")]
        story.expect_rows(current.running(), current.pid != leftover.pid, not is_running(leftover.pid))
    finally:
        after_restart.close()
        story.processes.close()


def service_process_ids(story) -> list[int]:
    program = str(story.container.get(PluginFolders).code("served") / "serve.py")
    return [pid for pid, _, command_parts in OrphanServices.listed() if program in command_parts[:2]]


def second_server_start(story, is_locked: Event, is_following: Event, started: list[subprocess.Popen]) -> None:
    code, pid_file = story.container.get(PluginFolders).code("served"), story.services.sockets.pid(*SERVED)
    environment = story.services.environment(SERVED, PluginManifest.read(code))
    with story.services.start_lock(SERVED):
        is_locked.set()
        is_following.wait(END_LIMIT_SECONDS)
        started.append(subprocess.Popen([str(code / "serve.py")], cwd=code, env=environment, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True))
        pid_file.write_text(str(started[0].pid))


def test_one_service_has_one_process_across_a_restart_by_command_two_servers_and_a_server_restart(new_story):
    story = server_kept_story(new_story)
    previous_restart = story.processes.running[SERVED]
    story.expect_success("plugin service restart served answers", actor=story.user)
    first = story.processes.running[SERVED]
    story.expect_success("plugin service-log served answers --lines 1", actor=story.user)
    story.expect_rows(first.pid != previous_restart.pid, service_process_ids(story) == [first.pid], detail=str(service_process_ids(story)))
    second_server, after_restart = ServiceProcesses(), ServiceProcesses()
    story.services.follow(second_server)
    story.services.follow(story.processes)
    story.expect_rows(second_server.running[SERVED].pid == first.pid, service_process_ids(story) == [first.pid], detail=str(service_process_ids(story)))
    story.processes.close()
    is_locked, is_following, started = Event(), Event(), []
    different_server = Thread(target=second_server_start, args=[story, is_locked, is_following, started])
    different_server.start()
    try:
        is_locked.wait(END_LIMIT_SECONDS)
        is_following.set()
        story.services.follow(after_restart)
        different_server.join(END_LIMIT_SECONDS)
        story.expect_rows(after_restart.running[SERVED].pid == started[0].pid, service_process_ids(story) == [started[0].pid], detail=str(service_process_ids(story)))
        os.killpg(started[0].pid, signal.SIGKILL)
        started[0].wait(END_LIMIT_SECONDS)
        last_server = ServiceProcesses()
        story.services.follow(last_server)
        current = last_server.running[SERVED]
        story.expect_rows(current.running(), current.pid != started[0].pid, service_process_ids(story) == [current.pid], detail=str(service_process_ids(story)))
        last_server.close()
    finally:
        after_restart.close()
