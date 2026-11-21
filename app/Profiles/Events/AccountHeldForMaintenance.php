<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * A saved account was held for maintenance, out of use until it is let go.
 */
final readonly class AccountHeldForMaintenance implements ShownOnAccounts
{
    public function __construct(public string $program, public string $accountId) {}

    public function program(): string
    {
        return $this->program;
    }

    public function subjectId(): string
    {
        return $this->accountId;
    }
}
