from enum import StrEnum


# @sin architecture_layout_suite_top_folder_file
class SampleType(StrEnum):
    """A sample type for the values below."""

    NOTE = "sample.note"


# @sin architecture_layout_value_at_a_module_top
SAMPLE_MARKS = [SampleType.NOTE]
