from journal.features.feature import Feature
from journal.features.sharing.commands.share_command import ShareCommand
from journal.features.sharing.seeds.tunnel_at_boot import TunnelAtBoot
from journal.models.option import Option


class Sharing(Feature):
    HOST = Option("sharing.host", "Tunler server", "The tunler server that gives this journal its web address; empty uses the one tunler is logged in to", "", kind="text")
    name = "sharing"
    title = "Share links"
    help = "Share one document, report or plan with someone outside the journal. The link opens that item and nothing else, and reaches this journal through a tunler tunnel."
    options = (HOST,)
    seeds = (TunnelAtBoot,)
    commands = (ShareCommand,)
