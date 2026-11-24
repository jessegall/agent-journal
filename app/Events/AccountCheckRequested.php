<?php

declare(strict_types=1);

namespace App\Events;

/**
 * An account was marked for a check of the sign-in generation it holds.
 */
final readonly class AccountCheckRequested extends AccountEvent
{
    public function __construct(public string $driver, public string $accountId, public int $generation) {}
}
