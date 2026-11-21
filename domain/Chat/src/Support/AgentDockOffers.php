<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Agents\Contracts\AgentDirectory;
use App\Agents\Support\AgentOption;
use App\Docking\Cards\DockIdentity;
use App\Docking\Data\DockOfferData;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\DockOffers;
use App\Docking\Sources\Contracts\DockRegistration;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Chat's generic Add to chat: offered for every registered source the viewer may read, docked in the conversation
 * with the agent the viewer chooses among those it may see.
 */
final readonly class AgentDockOffers implements DockOffers
{
    public function __construct(
        private DockRegistration $registry,
        private DockRequests $requests,
        private AgentDirectory $agents,
    ) {}

    public function offerFor(DockIdentity $source): Option
    {
        if (! $this->registry->offersDock($source->type)) {
            return None::create();
        }

        try {
            $this->requests->assertReadable($source);
        } catch (DockSourceUnavailable) {
            return None::create();
        }

        return Some::create(DockOfferData::from([
            'label' => 'Add to chat',
            'type' => $source->type,
            'id' => $source->id,
            'url' => route('chat.dock', absolute: false),
            'destinationField' => 'agent',
            'destinations' => array_map(
                fn (AgentOption $agent) => ['value' => $agent->agentId, 'label' => $agent->name],
                $this->agents->visible(),
            ),
        ]));
    }
}
