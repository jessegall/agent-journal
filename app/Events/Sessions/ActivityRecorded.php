<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Navigation\Contracts\ClientUpdate;

/**
 * An agent's activity was recorded, so open Activity windows read their feed again.
 */
final readonly class ActivityRecorded implements ClientUpdate, SessionEvent
{
    public function __construct(public string $entryId) {}
}
