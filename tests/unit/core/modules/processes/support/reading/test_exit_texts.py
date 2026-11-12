import pytest

from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading.exit_texts import EXIT_TEXTS, ExitTexts


def test_every_exit_has_its_sentence():
    assert set(EXIT_TEXTS) == set(ReadingExit) and all(text.sentence for text in EXIT_TEXTS.values())


@pytest.mark.parametrize("level", [level for level in PressureLevel if level > PressureLevel.SUGGEST])
def test_every_level_above_a_suggestion_states_an_exit_the_agent_takes_alone(level):
    alone = [way for way in level.exits if not way.needs_other_party]
    listed = ExitTexts.listed(level.exits, "make build", 7)
    assert alone and all(EXIT_TEXTS[way].sentence in listed for way in alone)


def test_an_exit_names_its_command_with_the_command_and_the_output():
    listed = ExitTexts.listed((ReadingExit.COMPLY, ReadingExit.READ_OUTPUT), "make build", 7)
    assert listed == "add or fix the reader: journal reader add make build; read it: journal output read 7"
