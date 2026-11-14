from dataclasses import replace

from engine.chat.mark_button import MarkButton
from tests.stories.engine.chat.support.mark_faults import GoodModule


class LegacyButtonsModule(GoodModule):
    docks = [replace(GoodModule.docks[0], buttons=[MarkButton("words", "Dock edit", "task edit {row_id} --brief=Dock")])]
