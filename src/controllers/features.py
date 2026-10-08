import json

from controllers.base import Arguments, Controller
from engine.extension import Extension
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from resources.base import Refused
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
        self.record.change_setting(name, {key: setting_value(value)})
        return self.record.setting(name, {})

    def _runs_commands(self, word: str, arguments: Arguments) -> bool:
        if word != "configure":
            return super()._runs_commands(word, arguments)
        return changes_a_command(self.record, arguments.name, arguments.key, setting_value(str(arguments.value)))


def check_choices(name: str, values: dict) -> None:
    """Refuses a value a feature setting with choices does not offer, such as a model the provider does not have."""
    for setting in SETTING_KEYS.keyed().get(name, ()):
        if setting.name in values and not setting.allows(values[setting.name]):
            raise Refused(f"{name} {setting.name} is one of {', '.join(map(str, setting.choices))}, not {values[setting.name]!r}")


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
