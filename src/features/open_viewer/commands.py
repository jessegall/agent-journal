from controllers.base import LAST
from features.open_viewer.appoint import online
from features.open_viewer.attachments import attachments
from features.open_viewer.manifest import manifest
from features.open_viewer.settings import apply, settings
from features.parts import Command, Context
from controllers.shared import shared
from overview.summary import lately_summarized


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
