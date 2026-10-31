from enum import StrEnum


# @sin architecture_layout_TopFolderHoldsModuleAndSuiteDetector
class SampleType(StrEnum):
    """A sample type for the values below."""

    NOTE = "sample.note"


# @sin architecture_layout_TopFolderHoldsNoValuesDetector
SAMPLE_MARKS = [SampleType.NOTE]
