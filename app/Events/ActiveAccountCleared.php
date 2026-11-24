<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ActiveAccountEvent;

/**
 * A driver family has no account chosen to start with any more.
 */
final readonly class ActiveAccountCleared extends AccountEvent implements ActiveAccountEvent
{
    public function __construct(public string $driver) {}
}
