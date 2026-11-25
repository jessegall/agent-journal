<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;

/**
 * A change of the sign-in attempt that may write an account's folder: claimed or released.
 */
interface AccountWriterEvent extends Event
{
    public string $driver { get; }

    public string $accountId { get; }

    public string $attemptId { get; }
}
