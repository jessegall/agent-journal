<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Records\DestinationProvider;
use App\Contracts\Records\Destinations;
use App\Exceptions\AssigneeUnavailable;
use App\Models\Inboxes\Inbox;

/**
 * An inbox's destination is the inbox itself, as holder and as address.
 */
final readonly class InboxDestinationProvider implements DestinationProvider
{
    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $inbox = Inbox::query()->ownedByCore()->whereKey($requested->id)->sharedLock()->firstOr(
            fn () => throw AssigneeUnavailable::forActor($requested),
        );

        return new ResolvedDestinations($inbox, $inbox);
    }
}
