<?php

declare(strict_types=1);

namespace App\Profiles\Policies;

use App\Actors\Contracts\Policy;
use App\Profiles\Models\Account;

/**
 * Who may read and manage the saved accounts: only the owner holds the accesses, so the grants decide.
 */
final readonly class AccountPolicy implements Policy
{
    public static function model(): string
    {
        return Account::class;
    }
}
