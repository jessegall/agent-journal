from argparse import Namespace

from journal.console.command import Command
from journal.features.registry import Registry
from journal.repositories.setting_rows import SettingRows
from journal.support.caller import Caller
from journal.support.option import AGENT, Option
from journal.support.rejection import Rejection


class SettingsCommand(Command):
    """journal settings: every setting with its value, one setting whole, and a change to one; the user changes any, an agent only those a feature leaves to it, the rest being the user's to change on the Settings page."""

    noun = "settings"
    default_verb = "list"

    def __init__(self, registry: Registry, settings: SettingRows) -> None:
        self.registry, self.settings = registry, settings

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "every setting with its value")
        self.verb(verbs, "show", "one setting whole: its value, what it does, its default and who may set it").add_argument("key")
        change = self.verb(verbs, "set", "change one setting; an agent sets only the ones marked as the agent's")
        change.add_argument("key")
        change.add_argument("value", help="the value: a number, on or off, one of the choices, text, or lines one per line")

    def list(self, args: Namespace, caller: Caller) -> int:
        for option in self.registry.options():
            print(f"{option.key} = {self.shown(option)}{'  (the agent may set it)' if option.setter == AGENT else ''}")
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
        option = self.option(args.key)
        print(f"{option.key} = {self.shown(option)}\n{option.title}: {option.abstract}\ndefault: {option.default!r}; set by {'the user or the agent' if option.setter == AGENT else 'the user, on the Settings page'}")
        return 0

    def set(self, args: Namespace, caller: Caller) -> int:
        option = self.option(args.key)
        if option.setter != AGENT and not caller.actor.is_user():
            raise Rejection(f"{option.key} is the user's to set, on the Settings page; the settings an agent may set are marked in journal settings list")
        self.settings.set(option.key, option.parsed(args.value), caller.actor)
        print(f"{option.key} = {self.shown(option)}")
        return 0

    def option(self, key: str) -> Option:
        matches = [option for option in self.registry.options() if option.key == key]
        if not matches:
            raise Rejection(f"no setting is named {key}: journal settings list names them all")
        return matches[0]

    def shown(self, option: Option) -> str:
        value = self.settings.option(option)
        return " | ".join(map(str, value)) if isinstance(value, (list, tuple)) else repr(value)
