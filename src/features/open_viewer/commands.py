from dataclasses import asdict
from typing import TypedDict

from agents.control import force, options, pause, relaunch, request, resume, shell
from agents.screen import screen_since
from controllers.base import LAST
from engine import typist
from engine.seats import terminal_of
from features.open_viewer.appoint import appoint, online
from features.open_viewer.attachments import FILES_PAGE, FileKind, attachments, attachments_page
from features.open_viewer.manifest import manifest
from features.open_viewer.settings import apply, settings
from features.open_viewer.transcripts import TRANSCRIPT_PAGE, paged, transcript_at
from features.parts import Command, Context
from controllers.shared import shared
from features.permission_prompts.skipping import set_skipped
from overview.summary import lately_summarized
from providers import PROVIDERS
from resources.base import Missing, Refused


class ShowManifest(Command):
    name = "manifest"

    def run(self, context: Context, environments):
        return manifest(environments.record.root)


class ShowSummary(Command):
    name = "summary"

    def run(self, context: Context, environments):
        summary = lately_summarized(environments.record.root)
        return {**summary, "environments": [e for e in summary["environments"] if shared(e["name"])],
                "helpers": [e for e in summary["helpers"] if shared(e["name"])]}


class ShowEvents(Command):
    name = "events"

    def run(self, context: Context, environments, since: int = 0, last: int = LAST):
        return [event.to_json() for event in environments.record.event_log.events(since, last)]


class ShowAttachments(Command):
    name = "attachments"

    def run(self, context: Context, environments):
        return attachments(environments.record)


class ShowAttachmentsPage(Command):
    name = "attached"

    def run(self, context: Context, environments, kind: FileKind = FileKind.ALL, shelf: str | None = None, search: str = "", last: int = FILES_PAGE, skip: int = 0):
        return attachments_page(environments.record, kind, shelf, search, last, skip)


class ShowSettings(Command):
    name = "settings"

    def run(self, context: Context, features):
        return settings(features.record)


class SaveSettings(Command):
    name = "save"
    user_only = True

    def run(self, context: Context, features, values: dict):
        return apply(features.record, values, features.actor)


class ShowOnline(Command):
    name = "online"

    def run(self, context: Context, agents):
        return [agent for agent in online(agents.record.root) if shared(agent["environment"])]


class Appoint(Command):
    name = "appoint"
    user_only = True

    def run(self, context: Context, agents, session: str):
        return appoint(agents.record.root, agents.record.env, session)


class ShowOptions(Command):
    name = "options"

    def run(self, context: Context, agents, provider: str, model: str = "", effort: str = ""):
        return options(provider, model, effort)


class RunShell(Command):
    name = "shell"
    user_only = True

    def run(self, context: Context, agents, session: str, command: str, now: bool = False):
        return shell(agents.record.root, agents.record.env, session, command, now)


def _terminal(agents, session: str) -> str:
    terminal = terminal_of(agents.record.root, session)
    if not terminal:
        raise Missing(f"no session {session}")
    return terminal


class ShowScreen(Command):
    name = "screen"

    def run(self, context: Context, agents, session: str, since: int = -1):
        return asdict(screen_since(agents.record.root, _terminal(agents, session), since))


class SendKeys(Command):
    name = "keys"
    user_only = True

    def run(self, context: Context, agents, session: str, text: str):
        return {"sent": typist.send(agents.record.root, _terminal(agents, session), text.encode())}


class Relaunch(Command):
    name = "relaunch"
    user_only = True

    def run(self, context: Context, agents, session: str, skip: bool = False):
        set_skipped(agents.record, skip)
        return {**relaunch(agents.record.root, agents.record.env, session), "skip": skip}


class Force(Command):
    name = "force"
    user_only = True

    def run(self, context: Context, agents, session: str):
        return force(agents.record.root, agents.record.env, session)


class Pause(Command):
    name = "pause"
    user_only = True

    def run(self, context: Context, agents, session: str):
        return pause(agents.record.root, agents.record.env, session)


class Resume(Command):
    name = "resume"
    user_only = True

    def run(self, context: Context, agents, session: str):
        return resume(agents.record.root, agents.record.env, session)


class Control(Command):
    name = "control"
    user_only = True

    def run(self, context: Context, agents, session: str, action: str, value: str = ""):
        return request(agents.record.root, agents.record.env, session, action, value)


def _provider(name: str):
    if name not in PROVIDERS:
        raise Missing(f"no provider {name}")
    return PROVIDERS[name]()


class ProviderHooks(TypedDict):
    path: str
    hooks: dict
    elsewhere: list[dict]


class ShowHooks(Command):
    name = "hooks"

    def run(self, context: Context, agents, provider: str) -> ProviderHooks:
        project = agents.record.root.parent
        wired = _provider(provider)
        return ProviderHooks(path=str(wired.config(project).relative_to(project)), hooks=wired.hooks(project), elsewhere=wired.hooks_elsewhere(project))


class WireHooks(Command):
    name = "wire"
    user_only = True

    def run(self, context: Context, agents, provider: str, hooks: dict):
        try:
            return {"hooks": _provider(provider).set_hooks(agents.record.root.parent, hooks)}
        except ValueError as error:
            raise Refused(str(error)) from error


class ShowTranscript(Command):
    name = "transcript"

    def run(self, context: Context, agents, n: int, subagent: str = "", since: int = 0, before: int = 0, last: int = TRANSCRIPT_PAGE):
        return paged(transcript_at(agents.load(n), subagent), agents.record, since, before, last)


class ShowLinks(Command):
    name = "links"

    def run(self, context: Context, agents, n: int, subagent: str = ""):
        return {"links": transcript_at(agents.load(n), subagent).links()}
