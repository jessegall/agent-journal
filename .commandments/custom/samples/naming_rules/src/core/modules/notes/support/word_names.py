from engine.command.handler import Handler

PAGE_SIZE = 5
# @sin naming_unitless_quantity_name
WAIT = 5
# @righteous naming_unitless_quantity_name
WAIT_SECONDS = 5
# @sin syntax_syntax_one_element_tuple
SOLE = ("only",)
# @righteous syntax_syntax_one_element_tuple
PAIR = ("first", "second")


# @sin naming_poetic_type_name
# @sin architecture_core_second_class_in_a_file
class WordedNote:
    """A class named for a word that says nothing."""


# @sin naming_sentence_type_name
# @sin architecture_core_second_class_in_a_file
class TheNote:
    """A class named as the start of a sentence."""


# @righteous naming_poetic_type_name
# @righteous naming_sentence_type_name
# @sin architecture_core_second_class_in_a_file
class NoteLine:
    """A class named for what it holds."""

    # @sin naming_poetic_method_name
    def whisper(self) -> str:
        return "x"

    # @sin naming_poetic_method_name
    # @sin naming_sentence_method_name
    def by_the_hour(self) -> str:
        return "x"

    # @righteous naming_poetic_method_name
    # @righteous naming_sentence_method_name
    def hourly(self) -> str:
        return "x"

    # @sin naming_poetic_parameter_name
    def tale(self, magic: str) -> str:
        # @sin naming_poetic_variable_name
        # @sin naming_sentence_variable_name
        of_the_day = magic
        # @sin naming_poetic_variable_name
        # @sin naming_sentence_variable_name
        thing = of_the_day
        # @sin naming_poetic_variable_name
        return thing

    # @sin naming_poetic_method_name
    # @sin naming_sentence_method_name
    # @sin naming_sentence_parameter_name
    def held(self, in_the_hour: str, text: str) -> str:
        # @righteous naming_poetic_variable_name
        line = text
        # @sin naming_sentence_variable_name
        return line + in_the_hour


# @sin naming_long_docstring_line
# @sin architecture_core_second_class_in_a_file
class LongNote: """A docstring line that runs past one hundred and ten characters is cut in two, and this one does not stop where it should, so it is flagged."""


# @righteous naming_long_docstring_line
# @sin architecture_core_second_class_in_a_file
class ShortNote: """A docstring whose lines stay short."""


# @sin naming_class_unnamed_for_its_base
# @sin architecture_layout_suite_command_outside_commands
# @sin naming_command_named_for_its_effect
# @sin architecture_core_second_class_in_a_file
class Notes(Handler):
    """A handler that does not end in Handler."""
