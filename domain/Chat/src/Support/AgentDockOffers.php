<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Navigation\Contracts\WindowOffers;
use App\Navigation\Data\WindowOfferData;
use App\Support\RecordIdentity;
use Domain\Chat\Contracts\Docking\DockRegistration;
use Domain\Chat\Exceptions\DockSourceUnavailable;
use Domain\Chat\Support\Cards\DockIdentity;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Chat's generic Add to chat on a window that shows a record: offered for every dockable record the viewer may read,
 * docked in the chat the viewer chooses among those it is a member of.
 */
final readonly class AgentDockOffers implements WindowOffers
{
    public function __construct(
        private DockRegistration $registry,
        private DockRequests $requests,
    ) {}

    public function offerFor(RecordIdentity $record): Option
    {
        if (! $this->registry->offersDock($record->type)) {
            return None::create();
        }

        try {
            $this->requests->assertReadable(new DockIdentity($record->type, $record->id));
        } catch (DockSourceUnavailable) {
            return None::create();
        }

        return Some::create(WindowOfferData::from([
            'label' => 'Add to chat',
            'type' => $record->type,
            'id' => $record->id,
            'url' => route('chat.dock', absolute: false),
            'destinationField' => 'inboxId',
            'destinations' => $this->requests->joinedChats(),
        ]));
    }
}
