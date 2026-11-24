<?php

declare(strict_types=1);

namespace App\Events\Accounts;

/**
 * An account's removal finished: its folder is gone and it signs in no more.
 */
final readonly class AccountRemoved extends AccountEvent
{
    public function __construct(public string $driver, public string $accountId) {}
}
