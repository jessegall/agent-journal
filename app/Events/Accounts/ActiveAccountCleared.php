<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Accounts\ActiveAccountEvent;

/**
 * A driver family has no account chosen to start with any more.
 */
final readonly class ActiveAccountCleared implements AccountEvent, ActiveAccountEvent
{
    public function __construct(public string $driver) {}
}
