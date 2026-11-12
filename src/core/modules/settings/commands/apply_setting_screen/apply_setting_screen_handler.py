from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from core.modules.settings.commands.apply_setting_screen.apply_setting_screen import ApplySettingScreen
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_changes import SettingChanges
from core.modules.settings.support.setting_screen import ScreenReading, SettingScreen


class ApplySettingScreenHandler(Handler[ApplySettingScreen, ScreenReading]):
    """Changes the named settings of a screen, and of the further screens the request names, in one step: all of
    them or none. A change to a setting that is on none of the screens, a value its declaration refuses, or a
    reading that has changed since it was read refuses the whole request and writes nothing."""

    command = ApplySettingScreen

    def __init__(self, screens: SettingScreen, declared: SettingCatalogue, changes: SettingChanges) -> None:
        self.screens, self.declared, self.changes = screens, declared, changes

    def handle(self, command: ApplySettingScreen, context: Context) -> ScreenReading:
        readings = [(self.screens.read(screen), revision) for screen, revision in ((command.screen, command.revision), *command.also)]
        for reading, revision in readings:
            if revision != reading.revision:
                raise Refusal(f"the settings of {reading.screen} changed since you read them", f"run journal setting-screen show {reading.screen} and apply again")
        shown = {node.key for reading, _ in readings for node in reading.nodes}
        stray = [key for key, _ in command.changes if key not in shown]
        if stray:
            raise Refusal(f"{', '.join(stray)} is not on the screen {command.screen}", f"journal setting-screen show {command.screen} lists its settings")
        self.changes.apply([(self.declared.value(key), text) for key, text in command.changes], context)
        return self.screens.read(command.screen)
