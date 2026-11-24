<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * An agent's activity was recorded, so open Activity windows read their feed again.
 */
final readonly class ActivityRecorded extends SessionEvent implements UserInterfaceUpdater
{
    public function __construct(public string $entryId) {}
}
