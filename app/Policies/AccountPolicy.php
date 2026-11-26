<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Accounts\Account;

/**
 * Who may read and manage the saved accounts: only the owner holds the accesses, so the grants decide.
 */
final readonly class AccountPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Account::class;
    }
}
