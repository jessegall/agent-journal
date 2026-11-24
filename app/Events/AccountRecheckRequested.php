<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The owner asked to check an account again after its last check found nothing certain.
 */
final readonly class AccountRecheckRequested extends AccountEvent
{
    public function __construct(public string $driver, public string $accountId) {}
}
