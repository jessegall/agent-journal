import json
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass

from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import SonnetWorkerAndFreeTask
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.server.window_data_route import window_data

WINDOW = "coding.agent-settings"


@dataclass(frozen=True)
class AssignTab:
    """Ada's viewer on the Assign tab of the agent settings: it reads the board as the tab does and sends each change
    through the viewer's line route with the revision it read."""

    server: object
    cookie: str

    def board(self) -> dict:
        status, answer = window_data(self.server, self.cookie, keys="assign", window=WINDOW)
        assert status == 200 and answer["keys"]["assign"]["code"] == 0, answer
        return answer["keys"]["assign"]["value"]

    def change(self, *words: str, revision: str | None = None) -> dict:
        read = self.board()["revision"] if revision is None else revision
        _, _, text = viewer_answer(self.server.viewer_port(), "/api/line", self.cookie, "", {"window": WINDOW, "environment": "main", "line": [*words, "--revision", read]})
        return json.loads(text)

    def read(self, *words: str) -> dict:
        _, _, text = viewer_answer(self.server.viewer_port(), "/api/line", self.cookie, "", {"window": WINDOW, "environment": "main", "line": list(words)})
        return json.loads(text)

    def target(self, kind_of_target: str) -> dict:
        return next(entry for entry in self.board()["targets"] if entry["target"] == kind_of_target)

    def rules(self) -> list[dict]:
        return self.board()["rules"]


@contextmanager
def assign_tab(story: Story) -> Iterator[AssignTab]:
    with server_story(story) as server:
        yield AssignTab(server, server.expect_viewer_login(server.viewer_key("Ada")))


def model_flags(target: dict) -> list[str]:
    return ["--target", "model", "--program", target["program"], "--model", target["program_model"]]


class SecondWorkerSession(StoryFixture):
    """Beside the sonnet worker and its task, a second worker session, w-7, with no task, and a second main session."""

    parent = SonnetWorkerAndFreeTask

    def steps(self, story: Story) -> None:
        story.run(f"agent start w-7 claude worker --parent {story.agent.id} --environment main")
        story.run("agent start s-8 claude main --environment main")

    def expect(self, story: Story) -> None:
        story.expect_text("agent list --environment main", "w-7", actor=story.user)


class RetiredWorkerRule(StoryFixture):
    """Ada gave rule 1 to a worker session, w-9, which then ended and was retired."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        worker_id = story.new_row_id(f"agent start w-9 claude worker --parent {story.agent.id} --environment main")
        story.run(f"assign-rule make --target agent --agent row:{worker_id} --condition any --environment main", actor=story.user)
        story.run(f"agent end {worker_id}")
        story.run(f'agent retire {agent_number(story, worker_id)} --reason "not needed"', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("assign-rule list --environment main", "agent", actor=story.user)


def test_the_tab_lists_the_main_agent_once_each_worker_with_its_facts_and_each_program_and_model(new_story):
    story = new_story(fixture=SecondWorkerSession)
    story.expect_text("agent list --environment main", "w-7", actor=story.user)
    with assign_tab(story) as tab:
        targets = tab.board()["targets"]
    kinds = [entry["target"] for entry in targets]
    worker = next((entry for entry in targets if entry.get("agent_id") == story.helper.id), {})
    story.expect_rows(kinds.count("main") == 1, kinds.count("model") >= 1, worker.get("program") == "claude", "sonnet" in worker.get("program_model", ""),
                      worker.get("running"), worker.get("open_tasks", 0) >= 1, detail=str(targets))


def test_a_person_adds_orders_turns_off_and_deletes_rules_in_the_tab(new_story):
    story = new_story(fixture=SonnetWorkerAndFreeTask)
    story.expect_text("assign-rule board --environment main", "target Main agent", "first match wins", actor=story.user)
    with assign_tab(story) as tab:
        model = tab.target("model")
        main_answer = tab.change("assign-rule", "make", "--target", "main", "--condition", "complexity minimum 4")
        tab.change("assign-rule", "make", *model_flags(model), "--condition", "text has_word migration")
        range_answer = tab.change("assign-rule", "make", "--target", "main", "--condition", "complexity minimum 2", "--condition", "complexity maximum 4", "--condition", "tag has backend")
        made = tab.rules()
        first, second, third = (rule["id"] for rule in made)
        tab.change("assign-rule", "move", str(third), "--to", "1")
        moved = [rule["id"] for rule in tab.rules()]
        tab.change("assign-rule", "disable", str(first))
        turned_off = next(rule for rule in tab.rules() if rule["id"] == first)
        tab.change("assign-rule", "delete", str(first))
        kept = [rule["id"] for rule in tab.rules()]
    summaries = [rule["summary"] for rule in made]
    story.expect_rows(main_answer["code"] == 0, range_answer["code"] == 0, made[0]["enabled"], made[1]["target_key"] == model["key"],
                      summaries == ["complexity is at least 4", "text has the word migration", "all of: complexity is at least 2; complexity is at most 4; tag has backend"],
                      moved == [third, first, second], not turned_off["enabled"], kept == [third, second], detail=str((summaries, moved, kept)))


def test_a_save_from_an_older_reading_is_refused_and_changes_nothing(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    old = json.loads(story.run("assign-rule board --json --environment main", actor=story.user).output_text)["revision"]
    story.run("assign-rule make --target main --condition any --environment main", actor=story.user)
    with assign_tab(story) as tab:
        answer = tab.change("assign-rule", "make", "--target", "main", "--condition", "tag has backend", revision=old)
        rules = tab.rules()
    story.expect_rows(answer["code"] != 0, "the rules changed since this draft was read" in json.dumps(answer), len(rules) == 1, detail=str(answer))


def test_a_rule_whose_agent_is_retired_shows_a_warning(new_story):
    story = new_story(fixture=RetiredWorkerRule)
    story.expect_text("assign-rule show 1 --environment main", "target: agent", actor=story.user)
    with assign_tab(story) as tab:
        rule = tab.rules()[-1]
    story.expect_rows(rule["warning"] == "its agent is retired", detail=str(rule))


class TwentyScoredTasks(StoryFixture):
    """Beside Ada and task 1, twenty more tasks scored 2, each titled 'Fix the part N'."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        for number in range(20):
            story.run(f'task make "Fix the part {number}" --complexity 2 --environment main', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text("task show 21 --environment main", "Fix the part 19", actor=story.user)


def test_before_saving_the_tab_says_how_many_of_the_last_20_tasks_a_rule_would_take(new_story):
    story = new_story(fixture=TwentyScoredTasks)
    story.expect_text("task list --environment main", "Fix the part 0", actor=story.user)
    with assign_tab(story) as tab:
        scored = tab.read("assign-rule", "recent", "--condition", "complexity minimum 1")
        common_word = tab.read("assign-rule", "recent", "--condition", "text has_word the")
    rules = json.loads(story.run("assign-rule list --json --environment main", actor=story.user).output_text)["rows"]
    story.expect_rows(scored.get("value", {}).get("text") == "The rule would have taken all 20 of the last 20 tasks", common_word.get("code") == 0,
                      common_word.get("value", {}).get("matched") == 20, rules == [], detail=str((scored, common_word)))


def test_trying_a_rule_on_a_task_shows_each_condition_and_assigns_nothing(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_text("task show 1 --environment main", "Fix the cart", actor=story.user)
    with assign_tab(story) as tab:
        answer = tab.read("assign-rule", "try", "1", "--condition", "title has_word cart", "--condition", "complexity minimum 4")
    trial = answer.get("value", {})
    decisions = json.loads(story.run("assign-decision list --json --environment main", actor=story.user).output_text)["rows"]
    labels = [(entry["label"], entry["matched"]) for entry in trial.get("conditions", [])]
    story.expect_rows(answer.get("code") == 0, trial.get("matches") is False, labels == [("title has the word cart", True), ("complexity is at least 4", False)],
                      decisions == [], detail=str((answer, decisions)))
