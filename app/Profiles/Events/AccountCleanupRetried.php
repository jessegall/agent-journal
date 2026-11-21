<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * The owner asked a saved account's failed cleanup to run again.
 */
final readonly class AccountCleanupRetried implements ShownOnAccounts
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
