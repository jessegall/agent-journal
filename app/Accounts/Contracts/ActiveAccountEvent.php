<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Contracts\Events\Event;

/**
 * A change of the account a driver family starts with: selected or cleared.
 */
interface ActiveAccountEvent extends Event
{
    public string $driver { get; }
}
