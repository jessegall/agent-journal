from journal.engine.states.void import Void
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.working_worker import WorkingWorker

TEST_SCRIPT = "#!/bin/sh\ncase \"$*\" in *passing*) echo '1 passed'; exit 0;; *) echo '1 failed'; exit 1;; esac\n"
BUILD_SCRIPT = "#!/bin/sh\necho 'built the viewer'\n"


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_reads_searches_edits_files_and_runs_journal_commands(story):
    story.agent_runs_in_the_shell(story.agents.subject, "cat src/parser.py").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, "grep -rn parse src").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, "sed -i '' 's/old/new/' src/parser.py").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, "rm src/old_parser.py").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, "journal todo list").expect_allowed()
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.COMMAND_KINDS, "read, search, edit")
def test_a_worker_the_user_allows_no_tests_or_builds_running_a_test_is_refused_and_told_to_queue_it_with_the_journal(story):
    result = story.agent_runs_in_the_shell(story.agents.subject, "python3 -m pytest tests/test_parser.py")
    result.expect_refused(story.agents.subject, WorkersNudges.TEST_QUEUE)
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.COMMAND_KINDS, "read, search, edit")
def test_a_worker_the_user_allows_no_tests_or_builds_running_a_build_is_refused_and_told_to_queue_it_with_the_journal(story):
    result = story.agent_runs_in_the_shell(story.agents.subject, "npm run build")
    result.expect_refused(story.agents.subject, WorkersNudges.BUILD_QUEUE)
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_runs_any_other_program_by_default(story):
    story.agent_runs_in_the_shell(story.agents.subject, "python3 scripts/fix_names.py").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, ".journal/plugins/code-commandments/bin/commandments-release judge --changes").expect_allowed()
    story.agent_runs_in_the_shell(story.agents.subject, "/tmp/built/journal-hook claude .").expect_allowed()
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_runs_a_journal_alias_as_a_journal_command(story):
    story.agent_runs(story.agents.main, "alias add judge 'echo judged'").expect_command_passed()
    story.agent_runs_in_the_shell(story.agents.subject, "journal judge tools/journal-hook").expect_allowed()
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.COMMAND_KINDS, "read, search, edit")
def test_a_worker_the_user_allows_no_other_programs_is_refused_one(story):
    result = story.agent_runs_in_the_shell(story.agents.subject, "python3 scripts/fix_names.py")
    result.expect_refused(story.agents.subject, WorkersNudges.COMMAND_KIND_REFUSAL)
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_worker_queues_a_single_named_test_and_the_journal_runs_it(story):
    story.project_script_holding("run_tests.sh", TEST_SCRIPT)
    result = story.agent_runs(story.agents.subject, "tests turn tests/test_parser.py::test_passing")
    result.expect_command_passed()
    result.expect_command_text("1 passed")
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_worker_queueing_a_folder_of_tests_is_refused(story):
    story.project_file_holding("tests/stories/a_story.py", "")
    result = story.agent_runs(story.agents.subject, "tests turn tests/stories")
    result.expect_command_refused()
    result.expect_command_text("single named tests")
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.BUILD_COMMAND, "./build.sh")
def test_a_worker_queues_a_build_and_the_journal_runs_the_projects_build_command(story):
    story.project_script_holding("build.sh", BUILD_SCRIPT)
    result = story.agent_runs(story.agents.subject, "build")
    result.expect_command_passed()
    result.expect_command_text("built the viewer")
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.COMMAND_KINDS, "read, search")
def test_a_worker_the_user_allows_only_reads_and_searches_is_refused_a_file_edit(story):
    story.agent_runs_in_the_shell(story.agents.subject, "grep -rn parse src").expect_allowed()
    result = story.agent_runs_in_the_shell(story.agents.subject, "rm src/old_parser.py")
    result.expect_refused(story.agents.subject, WorkersNudges.COMMAND_KIND_REFUSAL)
    story.expect_stack(story.agents.subject, Void, WorkingTask)
