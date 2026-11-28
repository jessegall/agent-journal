<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\AssigneeUnavailable;
use App\Models\Inboxes\Inbox;
use App\Records\Contracts\DestinationProvider;
use App\Records\Contracts\Destinations;

/**
 * An inbox's destination is the inbox itself, as holder and as address.
 */
final readonly class InboxDestinationProvider implements DestinationProvider
{
    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $inbox = Inbox::query()->ownedByCore()->whereKey($requested->id)->sharedLock()->firstOr(
            AssigneeUnavailable::throwing()->forActor($requested),
        );

        return RecipientDestinations::resolved($inbox, $inbox);
    }
}
