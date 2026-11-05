from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_queue import PluginQueue


class PluginCardReading:
    """Claims the cards in every plugin's queue, so a mark shows as soon as its answer is written; the line
    for the agent stays queued for the agent's next hook, the only moment it can arrive."""

    def __call__(self, container: Container) -> bool:
        queries, bus = container.get(Queries), container.get(Bus)
        outputs_added = 0
        for plugin in container.get(PluginQuery).enabled_ones():
            for card_answer in PluginQueue(container.get(PluginFolders).data(plugin.name)).claim_cards():
                agent = queries.query(Agent).filter(id=card_answer.agent_id).first()
                if agent is not None:
                    bus.run(AddPluginOutput(plugin.id, agent.environment_id, agent.id, card_answer.output), Actor.core(), environment_id=agent.environment_id)
                    outputs_added += 1
        return outputs_added > 0
