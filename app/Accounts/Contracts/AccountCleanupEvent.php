<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a removed account's folder cleanup: released to a host or tried again.
 */
interface AccountCleanupEvent extends Event
{
    public string $driver { get; }

    public string $accountId { get; }
}
