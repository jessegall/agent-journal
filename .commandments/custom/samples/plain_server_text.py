from features.base import FeatureDetails


class SampleDetails(FeatureDetails):
    # @sin PlainServerTextDetector
    label = "Turn off other hooks while the agent runs"
    # @sin PlainServerTextDetector
    explains = "I keep a row for every run."
    # @righteous PlainServerTextDetector
    hint = "Delete old temporary files"
    # @righteous PlainServerTextDetector
    explains = "The journal installs updates; you can choose how they are handled."
    help = "you run journal hooks list"
