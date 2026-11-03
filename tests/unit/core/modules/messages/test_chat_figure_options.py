from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.toggle_option import ToggleOption
from core.modules.messages.messages_module import MessagesModule


def chat_options():
    chat = next(window for window in MessagesModule.windows if window.name == "messages.chat")
    return {option.key: option for option in chat.options}


def test_the_chat_window_offers_the_figure_of_each_voice_and_the_floors_in_its_pane_menu():
    options = chat_options()
    figure, floors = options["figure"], options["floors"]
    assert isinstance(figure, ChoiceOption) and figure.default == "voice"
    assert [value for value, _ in figure.choices] == ["voice", "none", "butler", "homie", "coach", "colleague", "squire"]
    assert isinstance(floors, ToggleOption) and floors.default is False
