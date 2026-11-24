<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\ActiveAccountEvent;

/**
 * An account became the one agents of a driver family start with.
 */
final readonly class ActiveAccountSelected extends AccountEvent implements ActiveAccountEvent
{
    public function __construct(public string $driver, public string $accountId) {}
}
