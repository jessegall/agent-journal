import re
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.row.row_owner import RowOwner
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story

AGENT_ROLES = {"worker": "worker", "helper": "helper", "merger": "helper", "designer": "helper"}
PROFILES = {"merger": "journal-merger", "designer": "journal-designer"}


class MainControlsActors(StoryFixture):
    """Ada, a person, beside the started main agent, with a worker, an ordinary helper, a merger and a
    designer under it: story.user and story.agent, and agent_actors for the others."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        for name, role in AGENT_ROLES.items():
            row_id = story.new_row_id(f"agent start {name}-session claude {role} --parent {story.agent.id} --environment main")
            if name in PROFILES:
                story.expect_success(f"agent edit {row_id} --profile {PROFILES[name]}")

    def expect(self, story: Story) -> None:
        for name, actor in agent_actors(story).items():
            story.expect_success(f"agent show {actor.id}", f"role: {'main' if name == 'main' else AGENT_ROLES[name]}")


def agent_actors(story: Story) -> dict[str, Actor]:
    actors = {"main": story.agent}
    for row_id in range(story.user.id + 1, story.user.id + 1 + len(AGENT_ROLES)):
        session = re.search(r"^session: (\w+)-session$", story.run(f"agent show {row_id}", actor=story.user).output_text, re.MULTILINE)
        actors[session[1]] = Actor(row_id, ActorType.AGENT)
    return actors


@dataclass(frozen=True)
class PersonViewer:
    """Ada signed in to the viewer of a story's server, writing and reading settings through the viewer's line
    route."""

    server: object
    cookie: str
    environment: str = "main"

    def set_setting(self, key: str, value: str) -> None:
        self.server.viewer_line_value(self.cookie, {"window": "coding.work-mode", "environment": self.environment, "line": ["setting", "set", key, value]})


@contextmanager
def person_viewer(story: Story) -> Iterator[PersonViewer]:
    with server_story(story) as server:
        yield PersonViewer(server, server.expect_viewer_login(server.viewer_key("Ada")))


@contextmanager
def scope_line(story: Story, environment_id: int = 1) -> Iterator[None]:
    database = story.container.get(Database)
    previous = database.row_owner
    database.row_owner = RowOwner(None, environment_id)
    try:
        yield
    finally:
        database.row_owner = previous
