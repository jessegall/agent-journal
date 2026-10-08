import json

from controllers.base import Arguments, Controller
from engine.extension import Extension
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from resources.base import AGENT, Refused, SYSTEM, USER
from resources import types
from controllers.marks import action


SETTING_KEYS = Extension()


class Features(Controller):
    resource = types.FeatureRow

    @action
    def switch(self, name: str, on: bool = True):
        if name in PROJECT_PARTS.of(Record.features):
            self.record.set_setting(Record.features, {**self.record.features, name: bool(on)})
            return {name: bool(on)}
        row = self.rows.by_title(name)
        return self.update(row.n, enabled=bool(on)) if row else self.create(name, enabled=bool(on))

    @action
    def on(self, name: str, default: bool = True) -> bool:
        if name in PROJECT_PARTS.of(Record.features):
            return bool(self.record.features.get(name, default))
        row = self.rows.by_title(name)
        return bool(row.enabled) if row else default

    @action
    def configure(self, name: str, key: str, value: str):
        known = [setting.name for setting in SETTING_KEYS.keyed().get(name, ())]
        if not known:
            raise Refused(f"no feature named {name!r} has settings")
        if key not in known:
            raise Refused(f"{name} has no setting {key!r}; its settings are {', '.join(known)}")
        check_choices(name, {key: setting_value(value)})
        refuse_a_secret(name, [key], self.actor)
        refuse_a_secret_that_runs_commands(self.record, name, {key: value})
        before = self._held(name, key)
        self.record.change_setting(name, {key: setting_value(value)})
        import features
        features.settings_changed(self.record, [name], self.actor)
        if self.actor == AGENT and self._held(name, key) != before:
            from controllers.types import Agents
            Agents(self.record, actor=self.actor)._mark_primary(f"Changed {name}.{key} from {before} to {self._held(name, key)}", icon="settings")
        return self.record.setting(name, {})

    def _held(self, name: str, key: str):
        setting = next(setting for setting in SETTING_KEYS.keyed()[name] if setting.name == key)
        return self.record.setting(name, {}).get(key, setting.default)

    def _runs_commands(self, word: str, arguments: Arguments) -> bool:
        if word != "configure":
            return super()._runs_commands(word, arguments)
        return changes_a_command(self.record, arguments.name, arguments.key, setting_value(str(arguments.value)))


def check_choices(name: str, values: dict) -> None:
    """Refuses a value a feature setting with choices does not offer, such as a model the provider does not have."""
    for setting in SETTING_KEYS.keyed().get(name, ()):
        if setting.name in values and not setting.allows(values[setting.name]):
            raise Refused(f"{name} {setting.name} is one of {', '.join(map(str, setting.choices))}, not {values[setting.name]!r}")


def secrets_in(name: str, keys) -> list[str]:
    """The settings among the keys that hold a picked secret."""
    return [setting.name for setting in SETTING_KEYS.keyed().get(name, ()) if setting.secret and setting.name in keys]


def refuse_a_secret(name: str, keys, actor: str) -> None:
    """Only the person picks which secret a feature uses; an agent never does."""
    if actor != USER and secrets_in(name, keys):
        raise Refused(f"only you pick the key of {name}, under Integrations in the viewer")


def refuse_a_secret_that_runs_commands(record, name: str, values: dict) -> None:
    """The key of an integration is for that integration alone: a secret that lets commands use it is not picked for one."""
    from features.secrets.controller import Secrets
    from features.secrets.resource import SecretField
    for key in secrets_in(name, values):
        for secret in Secrets(record, actor=SYSTEM).rows.standing():
            if secret.programs and any(SecretField.from_json(raw).variable == values[key] for raw in secret.secret_fields):
                raise Refused(f"the secret {secret.title} lets commands use it, so it cannot be the key of {name}; make one for {name} alone, with no command")


def writes_a_secret(body: dict) -> bool:
    """Whether a request body would pick the secret of a feature, whether it is a settings write or a single setting."""
    named = isinstance(body.get("name"), str) and bool(secrets_in(body["name"], [body.get("key")]))
    return named or any(secrets_in(name, values) for name, values in body.items() if isinstance(values, dict))


def changes_a_command(record, name: str, key: str, value) -> bool:
    """Whether the value differs from what a feature setting that decides what runs holds now."""
    return any(value != record.setting(name, {}).get(key, setting.default)
               for setting in SETTING_KEYS.keyed().get(name, ()) if setting.name == key and setting.runs_commands)


def writes_what_runs(record, settings: dict) -> bool:
    """Whether a settings write changes a feature setting that decides what runs."""
    return any(changes_a_command(record, name, key, value) for name, values in settings.items() if isinstance(values, dict) for key, value in values.items())


def setting_value(value: str) -> bool | int | float | str:
    try:
        parsed = json.loads(value)
    except ValueError:
        return value
    return parsed if isinstance(parsed, (bool, int, float, str)) else value
