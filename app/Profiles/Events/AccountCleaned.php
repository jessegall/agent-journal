<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * A saved account's cleanup moved on in its generation.
 */
final readonly class AccountCleaned implements ShownOnAccounts
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
