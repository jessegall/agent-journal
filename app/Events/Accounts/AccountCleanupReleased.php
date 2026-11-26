<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\AccountCleanupEvent;

/**
 * A removed account's folder may now be cleaned by a host, since its processes are gone.
 */
final readonly class AccountCleanupReleased implements AccountCleanupEvent, AccountEvent
{
    public function __construct(public string $driver, public string $accountId) {}
}
