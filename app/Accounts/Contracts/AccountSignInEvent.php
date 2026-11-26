<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Contracts\Events\Event;

/**
 * An account signed in or out.
 */
interface AccountSignInEvent extends Event
{
    public string $driver { get; }

    public string $accountId { get; }
}
