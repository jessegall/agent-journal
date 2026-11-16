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


TIMED_JOB_REASON = "a timed job visits the rows of every environment"


class PluginCardReading:
    """Claims the cards in every plugin's queue whose folder changed since the last look, so a mark shows
    as soon as its answer is written; the line for the agent stays queued for the agent's next hook, the
    only moment it can arrive."""

    def __call__(self, container: Container) -> bool:
        queries, bus, counts = container.get(Queries), container.get(Bus), container.get(PluginFolderTimes)
        outputs_added = 0
        for runnable in container.get(RunnablePlugins).running():
            plugin = runnable.plugin
            queue = PluginQueue(container.get(PluginFolders).data(plugin.name))
            if not counts.has_updates(plugin.name, queue.folder):
                continue
            remaining_unclaimed = False
            with closing(queue.claim_cards()) as claims:
                for claim in claims:
                    agent = queries.query(Agent).all_environments(TIMED_JOB_REASON).filter(id=claim.answer.agent_id).first()
                    if agent is None:
                        remaining_unclaimed = True
                        continue
                    bus.run(AddPluginOutput(plugin.id, agent.id, claim.answer.output), Actor.core(), environment_id=agent.environment_id)
                    claim.remove_cards()
                    outputs_added += 1
            if remaining_unclaimed:
                counts.mark_unclaimed(plugin.name)
            else:
                counts.mark_claimed(plugin.name)
        return outputs_added > 0
