from dataclasses import replace

from engine.viewer.choice import Choice
from tests.stories.core.modules.viewer.support.acme_buttons_module import AcmeButtonsModule, FIELDS

PATH = "tests.stories.core.modules.viewer.support.wider_acme_buttons_module:WiderAcmeButtonsModule"


class WiderAcmeButtonsModule(AcmeButtonsModule):
    buttons = [replace(AcmeButtonsModule.buttons[0], fields=(replace(FIELDS[0], choices=(*FIELDS[0].choices, Choice("low", "Low"))), FIELDS[1]))]
