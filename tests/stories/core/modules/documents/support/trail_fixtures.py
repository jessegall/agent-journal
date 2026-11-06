import json
import shlex
from dataclasses import dataclass

import pytest

from core.base.database.reported_findings import ReportedFindings
from core.base.registry.registry import Registry
from core.base.query.queries import Queries
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from server.listener_thread import ListenerThread
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.story_line_route import StoryLineRoute
from tests.stories.server.support.server_client import server_story
from tests.stories.server.viewer.attachments import IMAGE_BYTES, uploaded


class MissingTrailBehaviour(AssertionError):
    @classmethod
    def described(cls, detail: str) -> "MissingTrailBehaviour":
        return cls(detail)


def feature(condition: bool, detail: str) -> None:
    if not condition:
        raise MissingTrailBehaviour.described(detail)


def pending(task: int):
    return pytest.mark.xfail(strict=True, raises=MissingTrailBehaviour, reason=f"plan 1093 task {task}")


def viewer_answer(story: Story, window: str, words: list[str], environment: str = "main"):
    listeners = ListenerThread(story.run_listeners, pytest.fail)
    route = StoryLineRoute(story.home, listeners, ReportedFindings())
    return route.run_line(story.container, window, words, story.user.id, environment, None)


def viewer(story: Story, window: str, words: list[str]):
    answer = viewer_answer(story, window, words)
    assert answer.code == 0, (window, words, answer.error)
    return answer.value


class TrailReady(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        story.expect_success('task make "Existing cart work" --brief "Keep the receipt" --environment main', actor=story.agent)
        story.expect_success('plan make "Cart plan" --brief "Check totals" --environment main', actor=story.agent)
        story.expect_success('doc make "Cart design" --abstract "Totals" --body "Use integer cents"', actor=story.agent)
        viewer(story, "messages.chat", ["message", "send", "Original cart request"])
        viewer(story, "messages.chat", ["message", "comment", "1", "Implement the cart request"])
        story.run_listeners()

    def expect(self, story: Story) -> None:
        answer = viewer(story, "messages.chat", ["message", "feed"])
        assert "Implement the cart request" in json.dumps(answer)


class LinkedTrail(StoryFixture):
    parent = TrailReady

    def steps(self, story: Story) -> None:
        story.expect_success('message reply 2 "Working on task 1"', actor=story.agent)
        story.run_listeners()


class SelectedTrail(StoryFixture):
    parent = TrailReady

    def steps(self, story: Story) -> None:
        story.expect_success("message read 2", actor=story.agent)


class ApprovedTrailPlan(StoryFixture):
    parent = TrailReady

    def steps(self, story: Story) -> None:
        story.expect_success("plan ready 1", actor=story.agent)
        viewer(story, "messages.chat", ["plan", "approve", "1"])


class StartedTrailPlan(StoryFixture):
    parent = ApprovedTrailPlan

    def steps(self, story: Story) -> None:
        story.expect_success("plan start 1", actor=story.agent)


@dataclass(frozen=True)
class Trail:
    story: Story

    def person(self, window: str, *words: str):
        return viewer(self.story, window, list(words))

    def comment(self, window: str, noun: str, number: int, text: str):
        self.person(window, noun, "comment", str(number), text)
        rows = self.person("messages.chat", "message", "feed")["rows"]
        return next(row for row in rows if row["text"] == text and row["commented_row"] == f"{noun}:{number}")

    def command(self, line: str):
        outcome = self.story.run(line, actor=self.story.agent)
        assert outcome.code == 0, outcome.output_text
        return outcome

    def requested_command(self, line: str):
        outcome = self.story.run(line, actor=self.story.agent)
        feature(outcome.code == 0, f"missing command behaviour: {line}: {outcome.output_text}")
        return outcome

    def select(self, number: int = 2) -> None:
        self.command(f"message read {number}")

    def switch(self, number: int) -> None:
        self.requested_command(f"message work-from {number}")

    def source_rows(self, agent_id: int):
        registered = (entry.model.loaded() for entry in self.story.container.get(Registry).models.values())
        models = [model for model in registered if model.model_name == "message_work_source"]
        if not models:
            return ()
        rows = tuple(self.story.container.get(Queries).query(models[0]).filter(agent_id=agent_id, environment_id=1).all_rows())
        assert len(rows) <= 1, "more than one source row for an agent and environment"
        return rows

    def source_ids(self, agent_id: int):
        return tuple(row.message_id for row in self.source_rows(agent_id) if row.message_id is not None)

    def expect_source(self, number: int) -> None:
        actual = self.source_ids(self.story.agent.id)
        feature(actual == (number,), f"expected selected message {number}, got {actual}")

    def links(self, source: str):
        value = json.loads(self.command(f"link list --source {source} --json").output_text)
        return value["rows"]

    def expect_link(self, source: str, target: str, relation: str) -> None:
        model, number = target.split(":")
        found = [row for row in self.links(source) if row["target_model"] == model and row["target_id"] == int(number) and row["link_type"] == relation]
        feature(len(found) == 1, f"expected one {source} {relation} {target}, got {found}")

    def expect_no_link(self, source: str, target: str) -> None:
        model, number = target.split(":")
        feature(not any(row["target_model"] == model and row["target_id"] == int(number) for row in self.links(source)), f"unexpected link from {source} to {target}")

    def make_task(self, title: str = "New cart work") -> None:
        self.command(f"task make {shlex.quote(title)} --brief 'Follow the request' --environment main")

    def context(self, noun: str = "task", number: int = 1, flags: str = ""):
        outcome = self.requested_command(f"{noun} context {number} --json {flags}")
        return json.loads(outcome.output_text)

    def tick(self):
        return self.story.hook("s-1", HookSamples.tick())


@pytest.fixture
def trail(new_story):
    return Trail(new_story(fixture=TrailReady))


@pytest.fixture
def linked_trail(new_story):
    return Trail(new_story(fixture=LinkedTrail))


@pytest.fixture
def selected_trail(new_story):
    return Trail(new_story(fixture=SelectedTrail))


def send_picture(trail: Trail) -> int:
    with server_story(trail.story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        token = uploaded(server, cookie, "cart.png", IMAGE_BYTES)
        message = server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["message", "send", "", "--file", token]})
    number = message["id"]
    trail.command(f'message tag {number} "cart.png" "Cart total is wrong"')
    trail.command(f'message reply {number} "Review task 1"')
    trail.story.run_listeners()
    return number


@dataclass(frozen=True)
class PictureTrail:
    trail: Trail
    message_id: int


@pytest.fixture
def picture_trail(linked_trail):
    return PictureTrail(linked_trail, send_picture(linked_trail))
