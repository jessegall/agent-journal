from dataclasses import replace

from tests.stories.core.modules.viewer.support.acme_buttons_module import AcmeButtonsModule

PATH = "tests.stories.core.modules.viewer.support.changed_acme_buttons_module:ChangedAcmeButtonsModule"


class ChangedAcmeButtonsModule(AcmeButtonsModule):
    buttons = [replace(AcmeButtonsModule.buttons[0], runs=AcmeButtonsModule.buttons[0].runs + " --title=Updated")]
