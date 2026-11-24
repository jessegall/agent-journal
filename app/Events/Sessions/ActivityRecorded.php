<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * An agent's activity was recorded, so open Activity windows read their feed again.
 */
final readonly class ActivityRecorded extends SessionEvent implements UserInterfaceUpdater
{
    public function __construct(public string $entryId) {}
}
