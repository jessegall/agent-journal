import json
from collections.abc import Callable, Mapping, Sequence
from pathlib import Path
from typing import cast

from engine.cli.console import Console
from server.work.listener_thread import ListenerThread
from server.work.listener_wake import ListenerWake

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.database.reported_findings import ReportedFindings
from engine.query.queries import Queries
from core.modules.pins.models.pin import Pin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.tasks.models.task import Task
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder, OpenTaskOrchestrator
from tests.stories.server.support.story_line_route import StoryLineRoute
from server.work.listener_thread import ListenerThread

TASK_CREATED = "core.tasks.task.created"
PIN_CREATED = "core.pins.pin.created"
SECOND_JOB_TITLE = "Second job"
SECOND_JOB = f'task make "{SECOND_JOB_TITLE}" --brief "Do it" --environment main'
NOTES_PIN_TITLE = "Notes"
PIN_LINE = f'pin make "{NOTES_PIN_TITLE}" --link https://example.org/notes --environment main'
REFUSAL = "[plugin events] not today"
LOG_LIMIT_EVENTS = 1000
WINDOW = "plugins.plugins"


def answer_with_commands(*lines: str) -> str:
    return f"cat <<'ANSWER'\n{json.dumps({'v': 1, 'commands': list(lines)})}\nANSWER"


EVENT_SCRIPTS = {
    "see.sh": "",
    "right.sh": "",
    "refuse.sh": """echo '{"v": 1, "answer": "refuse", "reason": "not today"}'""",
    "fail.sh": "exit 3",
    "broken.sh": "echo '{not json'",
    "pin.sh": answer_with_commands(PIN_LINE),
}


class EventPluginStarted(StoryFixture):
    """A person, Ada, beside the builder, with task 1 open."""

    parent = OpenTaskBuilder

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story: Story) -> None:
        story.expect_success(f"actor show {story.user.id}", "type: user", "name: Ada")


class EventWorkerStarted(StoryFixture):
    """A person, Ada, beside the orchestrator, with task 1 open."""

    parent = OpenTaskOrchestrator

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story: Story) -> None:
        story.expect_success(f"actor show {story.user.id}", "type: user", "name: Ada")


def event_folder(story: Story, *entries: object, scripts: Mapping[str, str] | None = None, name: str = "events", version: str = "1.0.0", listen: object | None = None, **manifest: object) -> Path:
    """The folder of an event plugin with the stock scripts and the ones given, its listen list the entries or, for
    a manifest with a wrong shape, the value of listen."""
    return event_plugin_folder(story.home.folder.parent / "sources", list(entries) if listen is None else listen, {**EVENT_SCRIPTS, **(scripts or {})}, name, version, **manifest)


def install_event_plugin(story: Story, *entries: object, scripts: Mapping[str, str] | None = None, name: str = "events", **manifest: object) -> Path:
    folder = event_folder(story, *entries, scripts=scripts, name=name, **manifest)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    return folder


def event_plugin_story(new_story, *entries: object, scripts: Mapping[str, str] | None = None, fixture: type[StoryFixture] = EventPluginStarted, modules: Sequence[str] = (), **manifest: object) -> Story:
    story = new_story(fixture=fixture)
    for module in modules:
        story.expect_sync_success(module)
    install_event_plugin(story, *entries, scripts=scripts, **manifest)
    return story


def script_calls(story: Story, script: str, plugin: str = "events") -> list[dict[str, object]]:
    """The lines a script was given, one for each time it ran."""
    called = story.home.folder / "plugin-data" / plugin / f"{script}.called"
    return [json.loads(line) for line in called.read_text().splitlines()] if called.is_file() else []


def server_commands(story: Story) -> None:
    story.container.get(Console).commit_listeners = ListenerWake(ListenerThread(lambda: None, lambda error: None))


def plugin_data(story: Story, name: str, plugin: str = "events") -> Path:
    return story.home.folder / "plugin-data" / plugin / name


def tasks_titled(story: Story, title: str) -> list[Task]:
    return [task for task in story.container.get(Queries).query(Task).all_rows() if task.title == title]


def pins_titled(story: Story, title: str) -> list[Pin]:
    return [pin for pin in story.container.get(Queries).query(Pin).all_rows() if pin.title == title]


def plugin_row(story: Story, name: str = "events") -> Plugin:
    return next(plugin for plugin in story.container.get(Queries).query(Plugin).all_rows() if plugin.name == name)


def deliveries(story: Story) -> list[PluginDelivery]:
    return list(story.container.get(Queries).query(PluginDelivery).all_rows())


def logged_events(story: Story, name: str) -> list[LoggedEvent]:
    return [event for event in story.container.get(EventLog).events_after(0, LOG_LIMIT_EVENTS) if event.event == name]


def event_data(call: Mapping[str, object]) -> dict[str, object]:
    return cast(dict[str, object], call["data"])


def data_row(call: Mapping[str, object], field: str = "row") -> dict[str, object]:
    return cast(dict[str, object], event_data(call)[field])


def expect_listed(rows: Sequence[Mapping[str, object]], **fields: object) -> None:
    assert any(all(row.get(name) == value for name, value in fields.items()) for row in rows), f"no row holds {fields}: {rows}"


class PluginPage:
    """The viewer's Plugins page and its commands."""

    def __init__(self, story: Story, line_sender: Callable[[list[str]], object]) -> None:
        self.story, self.line_sender = story, line_sender

    def line(self, *line: str) -> dict[str, object]:
        return cast(dict[str, object], self.line_sender(list(line)))

    def preview(self, source: Path) -> list[dict[str, object]]:
        return cast(list[dict[str, object]], self.line("plugin", "preview", str(source))["rows"])

    def install(self, source: Path) -> None:
        self.line("plugin", "install", str(source), "--yes")

    def disable(self, name: str = "events") -> None:
        self.line("plugin", "disable", name)

    def enable(self, name: str = "events") -> None:
        self.line("plugin", "enable", name)

    def preview_upgrade(self, name: str = "events") -> str:
        return json.dumps(self.line("plugin", "upgrade", name))

    def upgrade(self, name: str = "events") -> None:
        self.line("plugin", "upgrade", name, "--yes")

    def card(self, name: str = "events") -> list[dict[str, object]]:
        rows = cast(list[dict[str, object]], self.line("plugin", "events")["rows"])
        return [row for row in rows if row["plugin"] == name]

    def plugin(self, name: str = "events") -> dict[str, object]:
        rows = cast(list[dict[str, object]], self.line("plugin", "list")["rows"])
        return next(row for row in rows if row["name"] == name)

    def expect_target(self, name: str = "events") -> None:
        plugin = self.plugin(name)
        assert plugin["enabled"] is True, plugin

    def expect_fault(self, *texts: str, name: str = "events") -> None:
        fault = str(self.plugin(name)["last_fault"])
        assert all(text in fault for text in texts), f"the card's fault {fault!r} does not say {texts}"


def plugin_page(story: Story) -> PluginPage:
    route = StoryLineRoute(story.home, ListenerThread(lambda: None, lambda error: None), ReportedFindings())

    def line_sender(line: list[str]) -> object:
        story.steps.append(f"viewer line {line}")
        answer = route.answer(WINDOW, line, story.user.id, "main")
        assert answer.code == 0, f"{line} gave {answer.code}: {answer.error}"
        return answer.value
    return PluginPage(story, line_sender)


@pytest.fixture
def event_page(new_story) -> PluginPage:
    return plugin_page(new_story(fixture=EventPluginStarted))
