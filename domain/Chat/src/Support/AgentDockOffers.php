<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Data\Docks\DockOfferData;
use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\DockIdentity;
use App\Support\Sources\Contracts\DockOffers;
use App\Support\Sources\Contracts\DockRegistration;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Chat's generic Add to chat: offered for every registered source the viewer may read, docked in the chat the
 * viewer chooses among those it is a member of.
 */
final readonly class AgentDockOffers implements DockOffers
{
    public function __construct(
        private DockRegistration $registry,
        private DockRequests $requests,
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
            'destinationField' => 'inboxId',
            'destinations' => $this->requests->joinedChats(),
        ]));
    }
}
