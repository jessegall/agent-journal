<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\ActiveAccountEvent;

/**
 * An account became the one agents of a driver family start with.
 */
final readonly class ActiveAccountSelected implements AccountEvent, ActiveAccountEvent
{
    public function __construct(public string $driver, public string $accountId) {}
}
