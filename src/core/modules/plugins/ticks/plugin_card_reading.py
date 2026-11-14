from contextlib import closing

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_folder_times import PluginFolderTimes


class PluginCardReading:
    """Claims the cards in every plugin's queue whose folder changed since the last look, so a mark shows as soon
    as its answer is written; the line for the agent stays queued for the agent's next hook, the only moment it
    can arrive."""

    def __call__(self, container: Container) -> bool:
        queries, bus, times = container.get(Queries), container.get(Bus), container.get(PluginFolderTimes)
        outputs_added = 0
        for runnable in container.get(RunnablePlugins).running():
            plugin = runnable.plugin
            queue = PluginQueue(container.get(PluginFolders).data(plugin.name))
            if not times.has_news(plugin.name, queue.folder):
                continue
            left_unclaimed = False
            with closing(queue.claim_cards()) as claims:
                for claim in claims:
                    agent = queries.query(Agent).filter(id=claim.answer.agent_id).first()
                    if agent is None:
                        left_unclaimed = True
                        continue
                    bus.run(AddPluginOutput(plugin.id, agent.id, claim.answer.output), Actor.core(), environment_id=agent.environment_id)
                    claim.remove_cards()
                    outputs_added += 1
            times.looked(plugin.name, left_unclaimed)
        return outputs_added > 0
