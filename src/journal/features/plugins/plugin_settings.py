import json

from journal.features.plugins.plugin_folders import PluginFolders
from journal.features.plugins.plugin_setting import PluginSetting
from journal.models.actor import Actor
from journal.models.actor_kind import ActorKind
from journal.models.plugin import Plugin
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.refused import Refused
from journal.repositories.plugins import Plugins
from journal.repositories.secrets import Secrets
from journal.secret_values import SecretValues

KINDS = ("text", "number", "flag", "choice", "list", "secret")
FLAGS = {"true": True, "on": True, "yes": True, "false": False, "off": False, "no": False}


class PluginSettings:
    """A plugin's settings as its schema names them: each set by the user and checked against its kind; a secret setting is a secret of the Secrets feature, filled on the Secrets page and given to the plugin only once the user allows it."""

    def __init__(self, folders: PluginFolders, plugins: Plugins, secrets: Secrets, values: SecretValues) -> None:
        self.folders, self.plugins, self.secrets, self.values = folders, plugins, secrets, values

    def schema(self, plugin: Plugin) -> list[PluginSetting]:
        path = plugin.manifest.settings
        return [PluginSetting.from_json(setting) for setting in json.loads((self.folders.of(plugin) / path).read_text())] if path else []

    def started(self, plugin: Plugin, by: Actor) -> dict:
        """Its settings at their defaults, and a secret asked for each secret setting, proposed for the plugin."""
        settings = {}
        for setting in self.schema(plugin):
            if setting.is_secret:
                secret = self.secrets.save(Secret(title=f"{plugin.name} {setting.title}", brief=setting.help, kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields(f"{plugin.name} {setting.key}"), proposed=(self.program(plugin),)), by)
                settings[setting.key] = {"secret": secret.id}
            else:
                settings[setting.key] = setting.default
        return settings

    def configure(self, name: str, key: str, value: str, by: Actor) -> Plugin:
        if by.kind != ActorKind.USER:
            raise Refused("only the user configures a plugin")
        plugin = self.plugins.named(name)
        setting = next((s for s in self.schema(plugin) if s.key == key), None)
        if setting is None:
            raise Refused(f"{name} has no setting {key}: it has {', '.join(s.key for s in self.schema(plugin)) or 'none'}")
        return self.plugins.save(plugin.with_(settings={**plugin.settings, key: self.parsed(setting, value)}), by)

    @staticmethod
    def parsed(setting: PluginSetting, value: str) -> object:
        kind = setting.kind
        if setting.is_secret:
            raise Refused(f"{setting.key} is a secret: the user fills it on the Secrets page, never through a command")
        if kind == "number":
            try:
                return float(value) if "." in value else int(value)
            except ValueError:
                raise Refused(f"{setting.key} is a number; {value!r} is not") from None
        if kind == "flag":
            if value.lower() not in FLAGS:
                raise Refused(f"{setting.key} is on or off; {value!r} is neither")
            return FLAGS[value.lower()]
        if kind == "choice" and value not in setting.choices:
            raise Refused(f"{setting.key} is one of {', '.join(setting.choices)}")
        if kind == "list":
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    def given(self, plugin: Plugin) -> dict[str, str]:
        """The values of its secret settings that the user filled and let the plugin have, by their variables."""
        values = self.values.values()
        given = {}
        for setting in plugin.settings.values():
            if not isinstance(setting, dict) or "secret" not in setting:
                continue
            secret = self.secrets.find(setting["secret"])
            if self.program(plugin) in secret.programs:
                given |= {f["variable"]: values[f["variable"]] for f in secret.fields if f["variable"] in values}
        return given

    @staticmethod
    def program(plugin: Plugin) -> str:
        """The name a secret is allowed to the plugin under, as the Secrets page lists programs."""
        return f"plugin:{plugin.name}"
