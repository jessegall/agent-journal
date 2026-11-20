<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Contracts\DestinationProvider;
use App\Desks\Contracts\Destinations;
use App\Desks\Models\DeskRecord;

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
