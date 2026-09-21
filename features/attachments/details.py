from features.base import Behaviour, FeatureDetails, Line


class AttachmentsDetails(FeatureDetails):
    name = "attachments"

    title = "Attachments"

    abstract = """
        An attached file is read for the agent — a video sampled into frames — and each image or
        video is described in a few searchable words
    """

    help = """
        When a media file needs tags, inspect it and run journal <type> tag <n> <name> <tags>
        with a few words describing what it shows.

        A video attached to a message is sampled into frames: short clips every half second,
        medium clips every two seconds, and long clips at most sixty frames.
    """

    aliases = (("video", "frames"),)

    behaviours = [
        Behaviour(
            name="tagging",
            title="Ask for a description of each image and video",
            abstract="The agent is told when a media file has no tags yet",
        ),
        Behaviour(
            name="frames",
            title="Sample a video into frames",
            abstract="Needs ffmpeg and ffprobe on the machine",
        ),
    ]

    lines = [
        Line(
            name="untagged",
            title="{{type}} {{n}} file {{name}} needs tags",
            brief='inspect the attachment, then journal {{type}} tag {{n}} {{quoted}} "<a few words describing what it shows>"',
        ),
    ]
