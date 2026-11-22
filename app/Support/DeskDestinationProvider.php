<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\DestinationProvider;
use App\Contracts\Destinations;
use App\Exceptions\AssigneeUnavailable;
use App\Models\DeskRecord;

/**
 * A desk's destinations are the desk itself, as assignee and as inbox.
 */
final readonly class DeskDestinationProvider implements DestinationProvider
{
    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $desk = DeskRecord::query()->whereKey($requested->id)->sharedLock()->firstOr(
            fn () => throw AssigneeUnavailable::forActor($requested),
        );

        return new ResolvedDestinations($desk, $desk);
    }
}
