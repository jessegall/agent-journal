from features.base import Behaviour, FeatureDetails, Line
from features.groups import Group


class AttachmentDescriptionsDetails(FeatureDetails):
    name = "attachment_descriptions"
    group = Group.RECORDS
    label = "Read attachments for the agent"
    has_skill = False

    title = "Read attachments"

    abstract = """
        Files you attach are read for the agent, and videos are turned into still frames. Each image
        and video gets a short description you can search.
    """

    help = """
        When a media file needs tags, inspect it and run journal <type> tag <n> <name> <tags>
        with a few words describing what it shows.

        A video attached to a message is sampled into frames: short clips every half second,
        medium clips every two seconds, and long clips at most sixty frames.
    """

    aliases = (("video", "frames"), "attachments")

    behaviours = [
        Behaviour(
            name="tagging",
            title="Ask for a description of each image and video",
        ),
        Behaviour(
            name="frames",
            title="Turn videos into still frames",
            abstract="Needs ffmpeg",
        ),
    ]

    lines = [
        Line(
            name="untagged",
            title="{{type}} {{n}} file {{name}} needs tags",
            brief='inspect the attachment, then journal {{type}} tag {{n}} {{quoted}} "<a few words describing what it shows>"',
        ),
    ]
