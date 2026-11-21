<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * The owner chose another saved account as the program's active one.
 */
final readonly class AccountSwitched implements ShownOnAccounts
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
