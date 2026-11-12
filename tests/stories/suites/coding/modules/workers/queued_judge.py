import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.plugins.support.event_stories import install_event_plugin
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DISPATCH, FIRST_PROOF, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.queued_judge_plugin import PLUGIN_NAME, judge_script, queue_answer, queuing_plugin_folder

JUDGED = "judged.txt"
SECOND_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 2"
SECOND_PROOF = 'proof make 1 --task 2 "cart.py:1, the cart total story"'
MERGE_REQUEST_KEY = "suites.coding.workers.merge_request.created"
PASSING = f"sleep 0.3\necho judged > {{marks}}/{JUDGED}\n"
FAILING = "echo 'cart.py line 3: the total is wrong'\nexit 1\n"


def queuing_story(new_story, body: str, event_name: str = "worker_delivering"):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.marks = story.home.folder.parent / "marks"
    story.marks.mkdir()
    story.judge = judge_script(story.home.folder.parent, body.format(marks=story.marks))
    story.expect_success(f"plugin install {queuing_plugin_folder(story.home.folder.parent / 'sources', story.judge, event_name)} --yes", actor=story.user)
    recording_runner_at(story.home)
    story.expect_success("setting set journal.core.processes.run-batch-size 3 --project", actor=story.user)
    story.repository = repository_environment(story)
    return story


def handed_in_worker(story, line: str = DISPATCH, proof: str = FIRST_PROOF):
    worker = dispatched_worker(story, line)
    story.repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(proof, actor=worker)
    return worker


def queue(story) -> dict[str, list[dict[str, object]]]:
    return json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)


def judge_runs(story, state: str) -> list[dict[str, object]]:
    return [run for run in queue(story)[state] if run["plugin"] == PLUGIN_NAME]


def test_a_hand_in_is_sent_back_with_what_a_failed_judge_run_printed_and_goes_on_once_a_run_exits_0(new_story):
    story = queuing_story(new_story, FAILING)
    worker = handed_in_worker(story)
    story.expect_refusal(COMMIT, f"[plugin {PLUGIN_NAME}] cart.py line 3: the total is wrong", actor=worker)
    story.expect_rows(not (story.marks / JUDGED).exists())
    story.judge.write_text(PASSING.format(marks=story.marks))
    story.expect_success(COMMIT, actor=worker)
    story.expect_rows((story.marks / JUDGED).is_file(), len(judge_runs(story, "running")) + len(judge_runs(story, "waiting")) == 2)


def test_two_hand_ins_at_once_queue_their_judge_runs_under_the_limit_of_one(new_story):
    story = queuing_story(new_story, PASSING)
    story.expect_success('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    first = handed_in_worker(story)
    second = handed_in_worker(story, SECOND_DISPATCH, SECOND_PROOF)
    story.expect_success(COMMIT, actor=first)
    story.expect_success(COMMIT, actor=second)
    story.expect_rows(len(judge_runs(story, "running")) == 1, len(judge_runs(story, "waiting")) == 1)


def test_a_judge_run_a_guard_on_a_merge_queued_sends_the_merge_back_when_it_exits_1(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    script = judge_script(story.home.folder.parent, FAILING)
    install_event_plugin(story, {"event": MERGE_REQUEST_KEY, "guard": "queue.sh"}, scripts={"queue.sh": f"echo '{queue_answer(script)}'"}, name=PLUGIN_NAME,
                         processes=[{"kind": "judge", "title": "Judging the merge", "category": "check"}])
    recording_runner_at(story.home)
    target_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge --wait {agent_number(story, worker.id)}", "was refused before anything was merged", "cart.py line 3: the total is wrong", actor=story.agent)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) == target_tip)
