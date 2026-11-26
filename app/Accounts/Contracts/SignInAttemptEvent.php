<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a sign-in attempt: started, finished, released or its cleanup retried.
 */
interface SignInAttemptEvent extends Event
{
    public string $driver { get; }

    public string $attemptId { get; }
}
