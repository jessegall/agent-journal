import json

from controllers.base import Controller
from engine.extension import Extension
from resources.base import Refused
from resources import types
from controllers.marks import action


SETTING_KEYS = Extension()


class Features(Controller):
    resource = types.FeatureRow

    @action
    def switch(self, name: str, on: bool = True):
        row = self.rows.by_title(name)
        return self.update(row.n, enabled=bool(on)) if row else self.create(name, enabled=bool(on))

    @action
    def on(self, name: str, default: bool = True) -> bool:
        row = self.rows.by_title(name)
        return bool(row.enabled) if row else default

    @action
    def configure(self, name: str, key: str, value: str):
        known = SETTING_KEYS.keyed().get(name)
        if known is None:
            raise Refused(f"no feature named {name!r} has settings")
        if key not in known:
            raise Refused(f"{name} has no setting {key!r}; its settings are {', '.join(known)}")
        self.record.set_setting(name, {**self.record.setting(name, {}), key: setting_value(value)})
        return self.record.setting(name, {})


def setting_value(value: str) -> bool | int | float | str:
    try:
        parsed = json.loads(value)
    except ValueError:
        return value
    return parsed if isinstance(parsed, (bool, int, float, str)) else value
